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

import { RiaMapConfigService } from '../../ria-map-config.service';
import { DEFAULT_BASELAYER_CONFIG_RIA } from './../../ria-map-config.service';
import { BaseLayerServiceRia } from '../../services/base-layer.ria.service';
import { RiaProjectionswitcherComponent } from '../projectionswitcher/riaprojectionswitcher.component';
import { MouseCoordinateServiceRia } from '../../services/mouse-coordinate.ria.service';
import { MousecoordsComponentRia } from '../mousecoords/mousecoords.component.ria';
import { CompassServiceRia } from './../../services/compass.ria.service';
import { LayertreeComponentRia } from './../layertree/layertree.component.ria';
import { PanControlComponentRia } from '../pancontrol/pan-control.component.ria';

import { Visualizer } from "../../components/Visualizer"; // adjust the path to your folder
import type { MeshSpec } from "../../components/Visualizer";


import { Observable } from 'rxjs';
import { Point } from '@luciad/ria/shape/Point.js';
import { point } from '@luciad/ria/util/expression/ExpressionFactory.js';

@Component({
  standalone: true,
  selector: 'riamap',
  imports: [
    CommonModule,
    RiaProjectionswitcherComponent,
    MousecoordsComponentRia,
    LayertreeComponentRia,
    PanControlComponentRia
  ],
  templateUrl: './map.component.ria.html',
  styleUrls: ['./map.component.ria.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponentRia implements AfterViewInit, OnDestroy {
  @ViewChild('mapDiv', { static: true }) mapDiv!: ElementRef<HTMLDivElement>;
  @Output() pointPicked = new EventEmitter<{ lon: number; lat: number }>();

  public map?: WebGLMap;
  picking = false;

  compassTransform = 'rotateZ(0deg)';
  private mapChangeHandle: { remove(): void } | null = null;
  private rafQueued = false;

  // for one-shot picking cleanup
  private pickListener?: (e: MouseEvent) => void;

  // declare here, initialize in constructor (after DI)
  modelPoint$!: Observable<Point | null>;
  currentProjKey: string;

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

  async ngAfterViewInit(): Promise<void> {
    const refCode = this.cfg.getDefaultProjection().reference;
    const reference = getReference(refCode);
    this.updateCompassTransform();

    this.map = new WebGLMap(this.mapDiv.nativeElement, { reference });


    this.map.on("ReferenceChanged",(reference)=> {
      console.log(reference)
    })


    // this.map.on("MapChange", ()=>{
    //     console.log(this.map?.layerTree.children)
    // })
    // optional: world fit (kept from your code, not strictly needed)
    const world = createBounds(reference, [-180, -90, 180, 90]); // eslint-disable-line @typescript-eslint/no-unused-vars

    await this.baseLayersRia.addBaseLayersFromConfigRia(this.map, DEFAULT_BASELAYER_CONFIG_RIA);

    // show mouse coords in WGS84
    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));



    // points.addPoint(77.5946, 12.9716 , 16);    // optional: programmatic add
    // // To temporarily disable click-to-add without separate start/stop:
    // // points.setInteractive(false);

    const viz = new Visualizer({ map: this.map! });
    // Sphere
    viz.add({
      type: "ellipsoid",
      lon: 77.5900, lat: 12.9720, alt: 30000,
      params: { radiusX: 15000, radiusY: 15000, radiusZ: 15000, verticalSlices: 48, horizontalSlices: 32 },
      color: "rgba(80,160,255,0.35)",
      lightIntensity: 1.1
    });

    // Dome
    viz.add({
      type: "ellipsoidalDome",
      lon: 77.6000, lat: 12.9750, alt: 50000,
      params: { radiusX: 25000, radiusY: 25000, radiusZ: 12000, verticalSlices: 48, horizontalSlices: 24 },
      color: "rgba(255,80,80,0.45)",
      lightIntensity: 1.2
    });

    // Cone
    viz.add({
      type: "cone",
      lon: 77.61, lat: 12.98, alt: 12000,
      params: { radius: 6000, height: 20000, slices: 64 },
      color: "rgba(201,253,201,0.35)"
    });





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
  onPanelCollapseToggled(e: { collapsed: boolean }) { console.debug('[LayerTree] panelCollapseToggled', e); }
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
