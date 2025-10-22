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
import { SelectController } from "@luciad/ria/view/controller/SelectController.js";

import { RiaMapConfigService , DEFAULT_BASELAYER_CONFIG_RIA } from '../../riamapconfig.service';
import { BaseLayerServiceRia } from '../../services/base-layer.ria.service';
import { RiaProjectionswitcherComponent } from '../projectionswitcher/riaprojectionswitcher.component';
import { MouseCoordinateServiceRia } from '../../services/mouse-coordinate.ria.service';
import { MousecoordsComponentRia } from '../mousecoords/mousecoords.component.ria';
import { CompassServiceRia } from './../../services/compass.ria.service';
import { LayertreeComponentRia } from './../layertree/layertree.component.ria';
import { PanControlComponentRia } from '../pancontrol/pan-control.component.ria';

// Your mesh/shape helper
import { Visualizer } from "../util/Visualizer";

// --- Gizmo editing additions ---
import {MemoryStore} from "@luciad/ria/model/store/MemoryStore.js";
import {FeatureModel} from "@luciad/ria/model/feature/FeatureModel.js";
import {FeatureLayer} from "@luciad/ria/view/feature/FeatureLayer.js";
import {Feature} from "@luciad/ria/model/feature/Feature.js";
import {createPolygon} from "@luciad/ria/shape/ShapeFactory.js";
import {FeatureGizmoController} from "./../util/gizmo/FeatureGizmoController";
// --------------------------------

import { Observable } from 'rxjs';
import { Point } from '@luciad/ria/shape/Point.js';

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

  async ngAfterViewInit(): Promise<void> {
    const refCode = this.cfg.getDefaultProjection().reference;
    const reference = getReference(refCode);
    this.updateCompassTransform();

    this.map = new WebGLMap(this.mapDiv.nativeElement, { reference });

    this.map.on("ReferenceChanged",(reference)=> {
      // eslint-disable-next-line no-console
      console.log(reference);
    });

    // optional: world fit
    const world = createBounds(reference, [-180, -90, 180, 90]); // eslint-disable-line @typescript-eslint/no-unused-vars

    await this.baseLayersRia.addBaseLayersFromConfigRia(this.map, DEFAULT_BASELAYER_CONFIG_RIA);

    // show mouse coords in WGS84
    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));

    // Your demo visual shapes/meshes
    const viz = new Visualizer({ map: this.map! });

    // this.map!.defaultController = new SelectController();

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

    viz.add({
      type: "point",
      lon: 77.59, lat: 12.965, alt : 0 ,
      color: "rgba(0,150,255,1)",
      size: 12,
      outlineColor: "white",
      outlineWidth: 2
    });

    viz.add({
      type: "point",
      lon: 77.60, lat: 12.972 , alt: 0,
      color: "rgba(39, 114, 32, 1)",
    });

    // 2D LINE (polyline)
    viz.add({
      type: "line",
      positions: [
        77.585, 12.968,
        77.595, 12.972,
        77.605, 12.976,
        77.615, 12.980
      ],
      color: "rgba(255,215,0,1)",
      width: 3,
      opacity: 0.9
    });

    // 3D polyline
    viz.add({
      type: "line3D",
      positions: [
        77.59, 12.965, 2000 ,
        77.61, 12.975, 7000 ,
        77.63, 12.985, 5000,
      ],
      color: "rgba(18, 51, 235, 0.97)",
      width: 6
    });

    // 2D POLYGON
    viz.add({
      type: "polygon",
      positions: [
        77.588, 12.968,
        77.610, 12.968,
        77.610, 12.982,
        77.588, 12.982
      ],
      color: "rgba(0,200,120,1)",
      fillOpacity: 0.35,
      outlineColor: "#00A070",
      outlineWidth: 2
    });

    viz.add({
      type: "polygon",
      positions: [
        77.585, 12.965,
        77.615, 12.965,
        77.615, 12.985,
        77.585, 12.985
      ],
      color: "rgba(80,120,255,1)",
      fillOpacity: 0.18,
      outlineColor: "rgba(80,120,255,0.8)",
      outlineWidth: 1
    });

    viz.add({
      type: "polygon",
      positions: [
        78.585, 12.965, 2000,
        78.615, 12.965, 2000,
        78.615, 12.985, 2000,
        78.585, 12.985 , 2000
      ],
      color: "rgba(80, 255, 80, 1)",
      fillOpacity: 0.18,
      outlineColor: "rgba(218, 231, 32, 0.8)",
      outlineWidth: 1
    });

    // 3D point (sphere)
    // viz.add({
    //   type: "point3D",
    //   lon: 77.60, lat: 12.972 , alt: 2000,
    //   color: "rgba(255, 83, 30, 1)",
    //   sizeMeters : 20,
    // });

    // Billboard circle
    // viz.add({
    //   type: "point3D",
    //   mode: "billboard",
    //   lon: 77.60, lat: 12.972 , alt: 3000,
    //   billboardDiameterMeters: 12000,
    //   color: "rgba(0,180,255,0.9)",
    //   outlineColor: "white",
    //   outlineWidth: 2,
    //   opacity: 1
    // });

    // 3D polyline A->B->C
    // viz.add({
    //   type: "line",
    //   positions: [
    //     77.58, 12.97, 2000,
    //     77.60, 12.98, 8000,
    //     77.62, 12.99, 3000
    //   ],
    //   color: "rgba(71, 214, 14, 0.95)",
    //   width: 4
    // });


    

    const wireLayer = (layer: FeatureLayer) => {
      layer.on("SelectionChanged", () => {
        const sel = layer;
        const f = sel && (sel as any).first ? (sel as any).first() : null;
        if (!f) { this.map!.controller = null; return; }
        if (!layer.editable) { this.map!.controller = null; return; }

        // start the gizmo editor for the selected feature
        this.map!.controller = new FeatureGizmoController(layer, f, {
          handleSizeMeters: 80, // tweak as you like
          snapMeters: 1
        });
      });
    };

        // wire both layers from Visualizer
    wireLayer(viz.get2DLayer());
    wireLayer(viz.get3DLayer());







    // ---------- Gizmo: Editable FeatureLayer setup ----------
    const store  = new MemoryStore<Feature>({ data: [] });
    const model  = new FeatureModel(store, { reference: this.map.reference });
    this.featureLayer = new FeatureLayer(model, {
      id:"Shapes",
      label:"Shapes",
      selectable:true,
      editable:true
    });
    this.map.layerTree.addChild(this.featureLayer, "top");

    // Demo polygon you can select & edit with gizmo
    const editPoly = createPolygon(this.map.reference!, [
      [77.58, 12.965, 0],
      [77.60, 12.965, 0],
      [77.60, 12.980, 0],
      [77.58, 12.980, 0],
      [77.58, 12.965, 0],
    ]);
    store.add(new Feature(editPoly));

    // Fit to area
    await this.map.mapNavigator.fit({
      bounds: createBounds(this.map.reference!, [77.57, 0.05, 12.95, 0.05])
    });

    // Keep current controller as "default" (navigation)
    this.defaultController = this.map.controller;

    // Selection → swap to gizmo controller; clearing → revert to default
    this.map.on("SelectionChanged", (ev: any) => {
    
      const sel = ev.selectionChanges?.[0]?.selected ?? [];
      const f = sel[0] as Feature | undefined;
      console.log(sel)

      if (!f || !this.featureLayer?.editable) {
        this.map!.controller = this.defaultController;
        return;
      }

      this.map!.controller = new FeatureGizmoController(this.featureLayer, f, {
        handleSizeMeters: 80,
        snapMeters: 1
      });
    });
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
