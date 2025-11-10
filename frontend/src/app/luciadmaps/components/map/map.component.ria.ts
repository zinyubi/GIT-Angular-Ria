import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  Output, EventEmitter,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';
import { createBounds, createPoint } from '@luciad/ria/shape/ShapeFactory.js';
import { createTransformation } from '@luciad/ria/transformation/TransformationFactory.js';
import { LocationMode } from '@luciad/ria/transformation/LocationMode.js';
import { OutOfBoundsError } from '@luciad/ria/error/OutOfBoundsError.js';
import { RiaMapConfigService , DEFAULT_BASELAYER_CONFIG_RIA } from '../../riamapconfig.service';
import { BaseLayerServiceRia } from '../../services/base-layer.ria.service';
import { RiaProjectionswitcherComponent } from '../projectionswitcher/riaprojectionswitcher.component';
import { MouseCoordinateServiceRia } from '../../services/mouse-coordinate.ria.service';
import { MousecoordsComponentRia } from '../mousecoords/mousecoords.component.ria';
import { CompassServiceRia } from './../../services/compass.ria.service';
import { LayertreeComponentRia } from './../layertree/layertree.component.ria';
import { PanControlComponentRia } from '../pancontrol/pan-control.component.ria';
import { RiaStyleEditorComponent } from '../util/riavisualization/editor';
import { addSampleData } from './../util/riavisualization';
import {FeatureLayer} from "@luciad/ria/view/feature/FeatureLayer.js";
import {Feature} from "@luciad/ria/model/feature/Feature.js";
import {FeatureGizmoController} from "./../util/gizmo/FeatureGizmoController";
import { RiaVizFacade } from '../util/riavisualization';
import { Observable } from 'rxjs';
import { Point } from '@luciad/ria/shape/Point.js';
import { SelectController } from '@luciad/ria/view/controller/SelectController.js';
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

  vizFacade!: RiaVizFacade;
  public map?: WebGLMap;
  picking = false;
  isLayerTreeOpen = true;   // default: tree open
  isEditorOpen = false;     // default: editor closed
  isLocationOpen   = false;


  compassTransform = 'rotateZ(0deg)';
  private mapChangeHandle: { remove(): void } | null = null;
  private rafQueued = false;

  // for one-shot picking cleanup
  private pickListener?: (e: MouseEvent) => void;

  // declare here, initialize in constructor (after DI)
  modelPoint$!: Observable<Point | null>;
  currentProjKey: string;

  // --- Gizmo editing state ---
  private featureLayer!: FeatureLayer;
  private defaultController: any;
  // ---------------------------

  constructor(
    private cfg: RiaMapConfigService,
    private baseLayersRia: BaseLayerServiceRia,
    private mouseCoordsRia: MouseCoordinateServiceRia,
    private compassServiceRia: CompassServiceRia,
  ) {
    this.modelPoint$ = this.mouseCoordsRia.model$();
    this.currentProjKey = this.cfg.getDefaultKey();
  }

  ngOnDestroy(): void {
    this.stopPointPicking();
    this.mapChangeHandle?.remove?.();
    this.mapChangeHandle = null;
  }

  private updateCompassTransform() {
    if (!this.map) return;
    this.compassTransform = this.compassServiceRia.cssRotationForMapRia(this.map);
  }

  //  // fired when the tree header is toggled (legacy event)
  onPanelCollapseToggled(e: { collapsed: boolean }) {
    this.isLayerTreeOpen = !e.collapsed;
    if (this.isLayerTreeOpen) {
      this.isEditorOpen = false; 
      this.isLocationOpen = false;

    } // close editor if tree opened
  }

  // fired by [collapsed]/(collapsedChange) 2-way binding
  onLayertreeCollapsedChange(collapsed: boolean) {
    this.isLayerTreeOpen = !collapsed;
    if (this.isLayerTreeOpen) {
      this.isEditorOpen = false;
      this.isLocationOpen = false;
    }
  }
  onEditorCollapsedChange(collapsed: boolean) {
    this.isEditorOpen = !collapsed;
    if (this.isEditorOpen) {
      this.isLayerTreeOpen = false;
      this.isLocationOpen = false;
    }
  }

    onLocationCollapsed(collapsed: boolean) {
    this.isLocationOpen = !collapsed;
    if (this.isLocationOpen) {
      this.isLayerTreeOpen = false;
      this.isEditorOpen = false;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    const refCode = this.cfg.getDefaultProjection().reference;
    const reference = getReference(refCode);
    this.map = new WebGLMap(this.mapDiv.nativeElement, { reference  });

    this.map.on("ReferenceChanged",(reference)=> {
      // eslint-disable-next-line no-console
      console.log(reference);
    });

    // const indiaBounds = createBounds(reference, [68.1766451354, 7.96553477623, 97.4025614766, 35.4940095078]);
    // await this.map.mapNavigator.fit({ bounds: indiaBounds, animate: true });

    this.updateCompassTransform();
    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));



    // const initialbound = boundsFromLonLatRect(this.map.reference, 73.49, 22.99, 72.64, 23.09);
    // await this.map.mapNavigator.fit({ bounds: initialbound, animate: true });

    // this.map!.defaultController = new SelectController();
    // const world = createBounds(reference, [-180, -90, 180, 90]); // eslint-disable-line @typescript-eslint/no-unused-vars

    await this.baseLayersRia.addBaseLayersFromConfigRia(this.map, DEFAULT_BASELAYER_CONFIG_RIA);


    this.vizFacade = await addSampleData(this.map!, {
      enabled: true, storeLogs: false, paintLogs: false, outlineNew: true, fitAfterAdd: true
    });
    
    


    // Keep current controller as "default" (navigation)
    this.defaultController = this.map.controller;

    // --------------------------------------------------------

    // @ts-ignore map.on returns a handle with remove()
    this.mapChangeHandle = this.map.on('MapChange', () => {
      if (this.rafQueued) return;
      this.rafQueued = true;
      requestAnimationFrame(() => {
        this.rafQueued = false;
        this.updateCompassTransform();
      });
    });
  }

  // ---------- Layer tree debug ----------
  openLayerTree()  { this.onLayertreeCollapsedChange(false); }
  openStyle()      { this.onEditorCollapsedChange(false); }
  openLocation()   { this.onLocationCollapsed(false); }

  onNodeExpandToggled(e: { id: string; label: string; expanded: boolean }) { console.debug('[LayerTree] nodeExpandToggled', e); }
  onNodeVisibilityToggled(e: { id: string; label: string; visible: boolean }) { console.debug('[LayerTree] nodeVisibilityToggled', e); }

  // ---------- Point picking (one-shot) ----------
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

        const wgs84 = getReference('EPSG:4326'); // or CRS:84 if you prefer lon/lat ordering
        const toWgs = createTransformation(map.reference, wgs84, { normalizeWrapAround: map.wrapAroundWorld });
        const wgsPt = toWgs.transform(mapPt) as any;

        const lon = (wgsPt.x ?? wgsPt[0]) as number;
        const lat = (wgsPt.y ?? wgsPt[1]) as number;

        if (Number.isFinite(lon) && Number.isFinite(lat)) {
          this.pointPicked.emit({ lon: +lon.toFixed(6), lat: +lat.toFixed(6) });
        }
      } catch (err) {
        if (!(err instanceof OutOfBoundsError)) { throw err; }
        // click outside valid map area -> ignore
      } finally {
        this.stopPointPicking(); // one-shot
      }
    };

    // Use capture=false so Luciad controllers still get events; we only need the click
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

  // ---------- Compass / zoom / projection ----------
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

    // keep mouse coords in WGS84 display
    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));
    this.updateCompassTransform();
  }
}
