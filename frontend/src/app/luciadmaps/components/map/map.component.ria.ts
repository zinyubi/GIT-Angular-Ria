import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild,
  Output, EventEmitter, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';
import { createPoint } from '@luciad/ria/shape/ShapeFactory.js';
import { createTransformation } from '@luciad/ria/transformation/TransformationFactory.js';
import { LocationMode } from '@luciad/ria/transformation/LocationMode.js';
import { OutOfBoundsError } from '@luciad/ria/error/OutOfBoundsError.js';
import { RiaMapConfigService, DEFAULT_BASELAYER_CONFIG_RIA } from '../../riamapconfig.service';
import { BaseLayerServiceRia } from '../../services/base-layer.ria.service';
import { RiaProjectionswitcherComponent } from '../projectionswitcher/riaprojectionswitcher.component';
import { MouseCoordinateServiceRia } from '../../services/mouse-coordinate.ria.service';
import { MousecoordsComponentRia } from '../mousecoords/mousecoords.component.ria';
import { CompassServiceRia } from './../../services/compass.ria.service';
import { LayertreeComponentRia } from './../layertree/layertree.component.ria';
import { PanControlComponentRia } from '../pancontrol/pan-control.component.ria';
import { RiaStyleEditorComponent } from '../util/riavisualization/editor';
import { addSampleData, RiaVizFacade } from '../util/riavisualization';
import { Observable } from 'rxjs';
import { Point } from '@luciad/ria/shape/Point.js';
import { RiaLocationEditorComponent } from '../util/riavisualization/editor/location-editor.component';


@Component({
  standalone: true,
  selector: 'riamap',
  imports: [
    CommonModule,
    RiaProjectionswitcherComponent,
    MousecoordsComponentRia,
    LayertreeComponentRia,
    PanControlComponentRia,
    RiaStyleEditorComponent,
    RiaLocationEditorComponent,
  ],
  templateUrl: './map.component.ria.html',
  styleUrls: ['./map.component.ria.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponentRia implements AfterViewInit, OnDestroy {
  @ViewChild('mapDiv', { static: true }) mapDiv!: ElementRef<HTMLDivElement>;
  @Output() pointPicked = new EventEmitter<{ lon: number; lat: number }>();

  @ViewChild(LayertreeComponentRia) private treeCmp?: LayertreeComponentRia;

  vizFacade!: RiaVizFacade;
  public map?: WebGLMap;
  picking = false;
  isLayerTreeOpen = true;
  isEditorOpen = false;
  isLocationOpen = false;

  compassTransform = 'rotateZ(0deg)';
  private mapChangeHandle: { remove(): void } | null = null;
  private rafQueued = false;

  private pickListener?: (e: MouseEvent) => void;

  modelPoint$!: Observable<Point | null>;
  currentProjKey: string;

  constructor(
    private cfg: RiaMapConfigService,
    private baseLayersRia: BaseLayerServiceRia,
    private mouseCoordsRia: MouseCoordinateServiceRia,
    private compassServiceRia: CompassServiceRia,
    private cdr: ChangeDetectorRef,
  ) {
    this.modelPoint$ = this.mouseCoordsRia.model$();
    this.currentProjKey = this.cfg.getDefaultKey();
  }

  ngOnDestroy(): void {
    this.stopPointPicking();
    this.mapChangeHandle?.remove?.();
    this.mapChangeHandle = null;
  }

  // 🔹 Public API so MapPanel can force a tree refresh
  public refreshLayerTree(): void {
    this.treeCmp?.refreshNow();
  }

  private updateCompassTransform() {
    if (!this.map) return;
    this.compassTransform = this.compassServiceRia.cssRotationForMapRia(this.map);
  }

  // Panel toggles (unchanged)
  onLayertreeCollapsedChange(collapsed: boolean) {
    this.isLayerTreeOpen = !collapsed;
    if (this.isLayerTreeOpen) { this.isEditorOpen = false; this.isLocationOpen = false; }
  }
  onEditorCollapsedChange(collapsed: boolean) {
    this.isEditorOpen = !collapsed;
    if (this.isEditorOpen) { this.isLayerTreeOpen = false; this.isLocationOpen = false; }
  }
  onLocationCollapsed(collapsed: boolean) {
    this.isLocationOpen = !collapsed;
    if (this.isLocationOpen) { this.isLayerTreeOpen = false; this.isEditorOpen = false; }
  }
  onPanelCollapseToggled(e: { collapsed: boolean }) {
  this.isLayerTreeOpen = !e.collapsed;
  if (this.isLayerTreeOpen) {
    this.isEditorOpen = false;
    this.isLocationOpen = false;
  }
  this.cdr.markForCheck(); // OnPush
}

  async ngAfterViewInit(): Promise<void> {
    const refCode = this.cfg.getDefaultProjection().reference;
    const reference = getReference(refCode);
    this.map = new WebGLMap(this.mapDiv.nativeElement, { reference });

    // Bind map to child tree immediately and rebuild
    if (this.treeCmp) {
      (this.treeCmp as any).map = this.map;
      this.treeCmp.refreshNow();
    }
    this.cdr.markForCheck();

    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));
    await this.baseLayersRia.addBaseLayersFromConfigRia(this.map, DEFAULT_BASELAYER_CONFIG_RIA);
    this.cdr.markForCheck();

    this.vizFacade = await addSampleData(this.map!, {
      enabled: true, storeLogs: false, paintLogs: false, outlineNew: true, fitAfterAdd: true
    });
    

    this.mapChangeHandle = this.map.on('MapChange', () => {
      if (this.rafQueued) return;
      this.rafQueued = true;
      requestAnimationFrame(() => {
        this.rafQueued = false;
        this.updateCompassTransform();
        this.cdr.markForCheck();
      });
    });
  }

  // Debug handlers (optional)
  onNodeExpandToggled(_: any) { /* noop */ }
  onNodeVisibilityToggled(_: any) { /* noop */ }

  // Point picking (one-shot)
  startPointPicking(): void {
    if (this.picking || !this.map) return;
    this.picking = true;

    const container = this.mapDiv.nativeElement;
    const map = this.map;

    this.pickListener = (e: MouseEvent) => {
      try {
        const rect = container.getBoundingClientRect();
        const viewPt = createPoint(null, [e.clientX - rect.left, e.clientY - rect.top]);
        const mapPt  = map.getViewToMapTransformation(LocationMode.TERRAIN).transform(viewPt);

        const toWgs = createTransformation(map.reference, getReference('EPSG:4326'), {
          normalizeWrapAround: map.wrapAroundWorld
        });
        const wgsPt: any = toWgs.transform(mapPt);

        const lon = (wgsPt.x ?? wgsPt[0]) as number;
        const lat = (wgsPt.y ?? wgsPt[1]) as number;

        if (Number.isFinite(lon) && Number.isFinite(lat)) {
          this.pointPicked.emit({ lon: +lon.toFixed(6), lat: +lat.toFixed(6) });
        }
      } catch (err) {
        if (!(err instanceof OutOfBoundsError)) { throw err; }
      } finally {
        this.stopPointPicking();
      }
    };

    container.addEventListener('click', this.pickListener, { once: true });
  }

  stopPointPicking(): void {
    if (!this.picking) return;
    this.picking = false;
    if (this.pickListener) {
      this.mapDiv.nativeElement.removeEventListener('click', this.pickListener);
      this.pickListener = undefined;
    }
  }

  // Compass / zoom / projection
  rotateNorth(): void {
    if (!this.map) return;
    this.compassServiceRia.rotateToNorthRia(this.map);
  }

  zoomBy(factor: number) {
    if (!this.map) return;
    this.map.mapNavigator.zoom({ factor, animate: true });
  }

  onProjectionChoose(key: string) {
    if (!this.map) return;
    const cfg = this.cfg.getProjectionConfig(key);
    if (!cfg) return;

    const reference = getReference(cfg.reference);
    this.map.reference = reference;
    this.currentProjKey = key;

    // keep mouse coords in WGS84
    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));
    this.updateCompassTransform();
  }
}
