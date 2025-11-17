// src/app/luciadmaps/components/map/map.component.ria.ts
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';
import { createPoint } from '@luciad/ria/shape/ShapeFactory.js';
import { createTransformation } from '@luciad/ria/transformation/TransformationFactory.js';
import { LocationMode } from '@luciad/ria/transformation/LocationMode.js';
import { OutOfBoundsError } from '@luciad/ria/error/OutOfBoundsError.js';

import {
  RiaMapConfigService,
  DEFAULT_BASELAYER_CONFIG_RIA,
} from '../../riamapconfig.service';
import { BaseLayerServiceRia } from '../../services/base-layer.ria.service';
import { RiaProjectionswitcherComponent } from '../projectionswitcher/riaprojectionswitcher.component';
import { MouseCoordinateServiceRia } from '../../services/mouse-coordinate.ria.service';
import { MousecoordsComponentRia } from '../mousecoords/mousecoords.component.ria';
import { CompassServiceRia } from '../../services/compass.ria.service';
import { LayertreeComponentRia } from '../layertree/layertree.component.ria';
import { PanControlComponentRia } from '../pancontrol/pan-control.component.ria';
import { RiaStyleEditorComponent } from '../util/riavisualization/editor';
import { RiaLocationEditorComponent } from '../util/riavisualization/editor/location-editor.component';
import { RiaVizFacade } from '../util/riavisualization';

import { Observable } from 'rxjs';
import { Point } from '@luciad/ria/shape/Point.js';

export type PickPreviewPhase = 'latlon' | 'alt' | 'done' | 'cancel';

export interface PickPreviewEvent {
  lon: number;
  lat: number;
  alt: number | null;
  phase: PickPreviewPhase;
}

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
  @ViewChild(LayertreeComponentRia) private treeCmp?: LayertreeComponentRia;

  @Output() pointPicked = new EventEmitter<{ lon: number; lat: number; alt?: number }>();
  @Output() pickPreview = new EventEmitter<PickPreviewEvent>();

  public map?: WebGLMap;
  vizFacade?: RiaVizFacade;

  // UI state
  isLayerTreeOpen = true;
  isEditorOpen = false;
  isLocationOpen = false;

  compassTransform = 'rotateZ(0deg)';
  private mapChangeHandle: { remove(): void } | null = null;
  private rafQueued = false;

  modelPoint$!: Observable<Point | null>;
  currentProjKey: string;

  // Picking state
  picking = false;
  pickingPhase: 'none' | 'latlon' | 'alt' = 'none';

  private pickBaseLonLat: { lon: number; lat: number } | null = null;
  private pickBaseScreenY = 0;
  private pickBaseAlt = 1000;
  pickCurrentAlt: number | null = null;

  private lastPreviewLonLat: { lon: number; lat: number } | null = null;

  private pickClickListener?: (e: MouseEvent) => void;
  private pickMoveListener?: (e: MouseEvent) => void;

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
    this.stopPointPicking(true);
    this.mapChangeHandle?.remove?.();
    this.mapChangeHandle = null;
  }

  public refreshLayerTree(): void {
    this.treeCmp?.refreshNow();
  }

  private updateCompassTransform() {
    if (!this.map) return;
    this.compassTransform = this.compassServiceRia.cssRotationForMapRia(this.map);
  }

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
  onPanelCollapseToggled(e: { collapsed: boolean }) {
    this.isLayerTreeOpen = !e.collapsed;
    if (this.isLayerTreeOpen) {
      this.isEditorOpen = false;
      this.isLocationOpen = false;
    }
    this.cdr.markForCheck();
  }

  async ngAfterViewInit(): Promise<void> {
    const refCode = this.cfg.getDefaultProjection().reference;
    const reference = getReference(refCode);
    this.map = new WebGLMap(this.mapDiv.nativeElement, { reference });

    if (this.treeCmp) {
      (this.treeCmp as any).map = this.map;
      this.treeCmp.refreshNow();
    }
    this.cdr.markForCheck();

    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));
    await this.baseLayersRia.addBaseLayersFromConfigRia(
      this.map,
      DEFAULT_BASELAYER_CONFIG_RIA,
    );
    this.cdr.markForCheck();

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

  onNodeExpandToggled(_: any) { /* noop */ }
  onNodeVisibilityToggled(_: any) { /* noop */ }

  // ───────────────────────────────
  //  Altitude scaling by zoom/camera height
  // ───────────────────────────────
  private computeMetersPerPixel(): number {
    if (!this.map) return 300;

    const scale = this.map.mapScale; // real map scale

    // Normalize scale into a usable multiplier
    const baseScale = 1000000;    
    let sf =    1/ scale[0];     // tune this for sensitivity
    let scaleFactor = sf / baseScale


    // // Clamp extremes
    // if (scaleFactor < 0.1) scaleFactor = 0.1;   // slow when zoomed in
    // if (scaleFactor > 25) scaleFactor = 25;     // fast when zoomed out

    const base = 200; // 200 meters per pixel at base scale
    return base * scaleFactor;
  }

  // ───────────────────────────────
  //  Two-phase point picking
  // ───────────────────────────────

  startPointPicking(): void {
    if (!this.map) return;

    this.stopPointPicking(true);

    const container = this.mapDiv.nativeElement;
    const map = this.map;

    this.picking = true;
    this.pickingPhase = 'latlon';
    this.pickBaseLonLat = null;
    this.pickCurrentAlt = null;
    this.lastPreviewLonLat = null;

    container.classList.add('is-picking');
    container.classList.add('is-picking-lat');
    this.cdr.markForCheck();

    this.pickClickListener = (e: MouseEvent) => {
      try {
        if (!this.map) return;

        if (this.pickingPhase === 'latlon') {
          const rect = container.getBoundingClientRect();
          const viewPt = createPoint(null, [
            e.clientX - rect.left,
            e.clientY - rect.top,
          ]);

          const mapPt = map
            .getViewToMapTransformation(LocationMode.TERRAIN)
            .transform(viewPt);

          const toWgs = createTransformation(
            map.reference,
            getReference('EPSG:4326'),
            { normalizeWrapAround: map.wrapAroundWorld },
          );
          const wgsPt: any = toWgs.transform(mapPt);

          const lon = (wgsPt.x ?? wgsPt[0]) as number;
          const lat = (wgsPt.y ?? wgsPt[1]) as number;
          if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
            return;
          }

          this.pickBaseLonLat = {
            lon: +lon.toFixed(6),
            lat: +lat.toFixed(6),
          };
          this.pickBaseScreenY = e.clientY;
          this.pickBaseAlt = 1000;
          this.pickCurrentAlt = this.pickBaseAlt;
          this.lastPreviewLonLat = { ...this.pickBaseLonLat };

          console.debug('[MapComponentRia] pick phase1 lat/lon', this.pickBaseLonLat);

          this.pickPreview.emit({
            lon: this.pickBaseLonLat.lon,
            lat: this.pickBaseLonLat.lat,
            alt: this.pickCurrentAlt,
            phase: 'latlon',
          });

          this.pickingPhase = 'alt';
          container.classList.remove('is-picking-lat');
          container.classList.add('is-picking-alt');
          this.cdr.markForCheck();

          this.pickMoveListener = (moveEvt: MouseEvent) => {
            if (!this.pickBaseLonLat || !this.map) return;

            const dy = this.pickBaseScreenY - moveEvt.clientY; // up → positive
            const metersPerPixel = this.computeMetersPerPixel();
            const alt = this.pickBaseAlt + dy * metersPerPixel;
            this.pickCurrentAlt = Math.max(0, Math.min(1_000_000, alt));

            // 🔍 debug zoom + scale
            const zoom = this.map!.mapScale;


            this.lastPreviewLonLat = { ...this.pickBaseLonLat! };

            this.pickPreview.emit({
              lon: this.pickBaseLonLat!.lon,
              lat: this.pickBaseLonLat!.lat,
              alt: this.pickCurrentAlt!,
              phase: 'alt',
            });

            this.cdr.markForCheck();
          };

          window.addEventListener('mousemove', this.pickMoveListener);
          return;
        }

        if (this.pickingPhase === 'alt') {
          if (!this.pickBaseLonLat) return;
          const finalAlt =
            this.pickCurrentAlt != null ? this.pickCurrentAlt : this.pickBaseAlt;

          const out = {
            lon: this.pickBaseLonLat.lon,
            lat: this.pickBaseLonLat.lat,
            alt: +finalAlt.toFixed(1),
          };
          console.debug('[MapComponentRia] pick complete', out);

          this.pickPreview.emit({
            lon: out.lon,
            lat: out.lat,
            alt: out.alt,
            phase: 'done',
          });

          this.pointPicked.emit(out);

          // keep preview, so clearPreview = false
          this.stopPointPicking(false);
        }
      } catch (err) {
        if (!(err instanceof OutOfBoundsError)) {
          throw err;
        }
      }
    };

    container.addEventListener('click', this.pickClickListener);
  }

  stopPointPicking(clearPreview: boolean = true): void {
    const hadPicking = this.picking || this.pickingPhase !== 'none';

    this.picking = false;
    this.pickingPhase = 'none';
    this.pickCurrentAlt = null;
    this.pickBaseLonLat = null;

    const container = this.mapDiv.nativeElement;
    container.classList.remove('is-picking', 'is-picking-lat', 'is-picking-alt');

    if (this.pickClickListener) {
      container.removeEventListener('click', this.pickClickListener);
      this.pickClickListener = undefined;
    }
    if (this.pickMoveListener) {
      window.removeEventListener('mousemove', this.pickMoveListener);
      this.pickMoveListener = undefined;
    }

    if (clearPreview && hadPicking) {
      const lon = this.lastPreviewLonLat?.lon ?? 0;
      const lat = this.lastPreviewLonLat?.lat ?? 0;

      this.pickPreview.emit({
        lon,
        lat,
        alt: null,
        phase: 'cancel',
      });
    }

    this.cdr.markForCheck();
  }

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

    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));
    this.updateCompassTransform();
  }
}
