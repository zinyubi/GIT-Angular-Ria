// src/app/luciadmaps/components/util/gizmo/FeatureGizmoController.ts
import { Controller } from "@luciad/ria/view/controller/Controller.js";
import { HandleEventResult } from "@luciad/ria/view/controller/HandleEventResult.js";
import { GestureEvent } from "@luciad/ria/view/input/GestureEvent.js";
import { GestureEventType } from "@luciad/ria/view/input/GestureEventType.js";
import { KeyEvent } from "@luciad/ria/view/input/KeyEvent.js";
import { KeyEventType } from "@luciad/ria/view/input/KeyEventType.js";
import { Map } from "@luciad/ria/view/Map.js";
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { Shape } from "@luciad/ria/shape/Shape.js";
import { ShapeType } from "@luciad/ria/shape/ShapeType.js";
import { Point } from "@luciad/ria/shape/Point.js";
import { Polygon } from "@luciad/ria/shape/Polygon.js";
import { ShapeList } from "@luciad/ria/shape/ShapeList.js";
import {
  createPoint,
  createPolyline,
  createPolygon,
  createShapeList,
  createExtrudedShape
} from "@luciad/ria/shape/ShapeFactory.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import { PerspectiveCamera } from "@luciad/ria/view/camera/PerspectiveCamera.js";
import { GizmoOverlayLayer } from "./GizmoOverlayLayer.js";
import { LocationMode } from "@luciad/ria/transformation/LocationMode.js";

type Mode = "translateXY" | "translateZ" | "extrude";

interface Options {
  handleSizeMeters?: number;
  snapMeters?: number;
}
const DEFAULTS = { handleSizeMeters: 50, snapMeters: 1 } as const;

export class FeatureGizmoController extends Controller {
  private overlay = new GizmoOverlayLayer();

  private hXY!: Shape;
  private hZ!: Shape;
  private hExtrude: Shape | null = null;

  private active: Mode | null = null;
  private lastVP: Point | null = null;

  private _original: Shape | null = null;
  private _working: Shape | null = null;

  private opts: { handleSizeMeters: number; snapMeters: number };

  constructor(
    private readonly layer: FeatureLayer,
    private readonly feature: Feature,
    options: Options = {}
  ) {
    super();
    this.opts = {
      handleSizeMeters: options.handleSizeMeters ?? DEFAULTS.handleSizeMeters,
      snapMeters: options.snapMeters ?? DEFAULTS.snapMeters
    };
  }

  override onActivate(map: Map) {
    super.onActivate(map);
    this.overlay.attach(map);

    if (!this.feature.shape) return;
    this._original = this.feature.shape.copy();
    this._working  = this.feature.shape.copy();

    this.rebuildHandles();
    this.invalidate();
  }

  override onDeactivate(map: Map) {
    this.overlay.clear();
    super.onDeactivate(map);
  }

  override onKeyEvent(ev: KeyEvent): HandleEventResult {
    if (ev.type === KeyEventType.UP && ev.domEvent?.key === "Escape") {
      if (this._original) this.feature.shape = this._original.copy();
      return HandleEventResult.EVENT_HANDLED | HandleEventResult.REQUEST_DEACTIVATION;
    }
    return HandleEventResult.EVENT_IGNORED;
  }

  override onGestureEvent(ev: GestureEvent): HandleEventResult {
    if (!this.map || !this.feature.shape || !this._working) return HandleEventResult.EVENT_IGNORED;

    if (ev.type === GestureEventType.MOVE) {
      this.lastVP = ev.viewPoint;
      return HandleEventResult.EVENT_HANDLED;
    }

    if (ev.type === GestureEventType.DOWN) {
      this.lastVP = ev.viewPoint;
      this.active = this.pickMode(ev.viewPoint);
      return HandleEventResult.EVENT_HANDLED;
    }

    if (ev.type === GestureEventType.DRAG && this.active && this.lastVP) {
      switch (this.active) {
        case "translateXY": this.dragTranslateXY(this.lastVP, ev.viewPoint); break;
        case "translateZ":  this.dragTranslateZ(this.lastVP, ev.viewPoint);  break;
        case "extrude":     this.dragExtrude(this.lastVP, ev.viewPoint);     break;
      }
      this.feature.shape = this._working.copy();
      this.lastVP = ev.viewPoint;
      this.rebuildHandles();
      return HandleEventResult.EVENT_HANDLED;
    }

    if (ev.type === GestureEventType.UP) {
      this.active = null;
      return HandleEventResult.EVENT_HANDLED;
    }

    return HandleEventResult.EVENT_IGNORED;
  }

  // ---------- Handles ----------

  private rebuildHandles() {
    if (!this._working || !this.map) { this.overlay.clear(); return; }

    const ref = this.map.reference || getReference("CRS:84");
    const a = this.anchor(this._working);
    const m = this.opts.handleSizeMeters;

    // XY cross
    const p1 = createPoint(ref, [a.x - m, a.y, a.z]);
    const p2 = createPoint(ref, [a.x + m, a.y, a.z]);
    const p3 = createPoint(ref, [a.x, a.y - m, a.z]);
    const p4 = createPoint(ref, [a.x, a.y + m, a.z]);
    this.hXY = createPolyline(ref, [p1, p2, p3, p4]);

    // Vertical Z line
    const p5 = createPoint(ref, [a.x, a.y, a.z]);
    const p6 = createPoint(ref, [a.x, a.y, a.z + m]);
    this.hZ  = createPolyline(ref, [p5, p6]);

    // Extrude cap for polygons/solids
    this.hExtrude = null;
    if (this.canExtrude(this._working)) {
      const t1 = createPoint(ref, [a.x, a.y, a.z + m * 0.8]);
      const t2 = createPoint(ref, [a.x, a.y, a.z + m * 1.2]);
      this.hExtrude = createPolyline(ref, [t1, t2]);
    }

    this.overlay.update([this.hXY, this.hZ, ...(this.hExtrude ? [this.hExtrude] : [])]);
    this.invalidate();
  }

  private pickMode(vp: Point): Mode | null {
    if (!this.map) return null;

    const near = (s: Shape, pxTol=12) => {
      const mid = this.midpoint(s);
      const sp  = this.map!.mapToViewTransformation.transform(mid);
      const dx = sp.x - vp.x, dy = sp.y - vp.y;
      return (dx*dx + dy*dy) <= (pxTol*pxTol);
    };

    if (this.hExtrude && near(this.hExtrude)) return "extrude";
    if (near(this.hZ)) return "translateZ";
    if (near(this.hXY)) return "translateXY";
    return null;
  }

  // ---------- Drag ops ----------

  private dragTranslateXY(vp0: Point, vp1: Point) {
    if (!this._working || !this.map) return;

    // view → map via CLOSEST_SURFACE, so we get ground-projected deltas
    const v2m = this.map.getViewToMapTransformation(LocationMode.CLOSEST_SURFACE);
    const w0 = v2m.transform(vp0);
    const w1 = v2m.transform(vp1);

    let dx = w1.x - w0.x;
    let dy = w1.y - w0.y;

    const step = this.opts.snapMeters;
    if (step > 0) { dx = Math.round(dx/step)*step; dy = Math.round(dy/step)*step; }

    this.translateXY(this._working, dx, dy);
  }

  private dragTranslateZ(vp0: Point, vp1: Point) {
    if (!this._working || !this.map) return;

    const cam = this.map.camera as PerspectiveCamera;
    const a = this.anchor(this._working);
    const eyeToAnchor = Math.hypot(a.x - cam.eye.x, a.y - cam.eye.y, (a.z ?? 0) - cam.eye.z);
    const viewH = this.map.viewSize[1];
    const metersPerPixel = (2 * eyeToAnchor * Math.tan(cam.fovY / 2)) / viewH;

    const dyPixels = vp0.y - vp1.y; // drag up = positive dz
    let dz = dyPixels * metersPerPixel;
    const step = this.opts.snapMeters;
    if (step > 0) dz = Math.round(dz/step)*step;

    this.raiseZ(this._working, dz);
  }

  private dragExtrude(vp0: Point, vp1: Point) {
    if (!this._working || !this.map) return;

    const cam = this.map.camera as PerspectiveCamera;
    const a = this.anchor(this._working);
    const eyeToAnchor = Math.hypot(a.x - cam.eye.x, a.y - cam.eye.y, (a.z ?? 0) - cam.eye.z);
    const viewH = this.map.viewSize[1];
    const metersPerPixel = (2 * eyeToAnchor * Math.tan(cam.fovY / 2)) / viewH;

    const dyPixels = vp0.y - vp1.y;
    let dz = dyPixels * metersPerPixel;
    const step = this.opts.snapMeters;
    if (step > 0) dz = Math.round(dz/step)*step;

    if (this._working.type === ShapeType.POLYGON) {
      const poly = this._working as Polygon;
      const z0 = poly.getPoint(0).z ?? 0;
      const z1 = z0 + dz;
      const prism = createExtrudedShape(poly.reference!, poly, z0, z1);
      this._working = createShapeList(poly.reference!, [prism]);
      return;
    }
    if (this._working.type === ShapeType.SHAPE_LIST) {
      this.raiseZ(this._working, dz);
    }
  }

  // ---------- helpers ----------

  private anchor(s: Shape): Point {
    try { const fp = (s as any).focusPoint as Point; if (fp) return fp.copy(); } catch {}
    const b = s.bounds!;
    return createPoint(s.reference || getReference("CRS:84"), [b.x + b.width/2, b.y + b.height/2, b.z + b.depth/2]);
  }

  private canExtrude(s: Shape): boolean {
    return s.type === ShapeType.POLYGON || s.type === ShapeType.SHAPE_LIST;
  }

  private midpoint(s: Shape): Point {
    const b = s.bounds!;
    return createPoint(s.reference!, [b.x + b.width/2, b.y + b.height/2, b.z + b.depth/2]);
  }

  private translateXY(s: Shape, dx:number, dy:number) {
    (s as any).translate2D?.(dx, dy);
    if (s.type === ShapeType.SHAPE_LIST) {
      const list = s as ShapeList;
      try { (list as any).shapes?.forEach((sh: Shape)=> (sh as any).translate2D?.(dx,dy)); } catch {}
    }
  }

  private raiseZ(s: Shape, dz:number) {
    const liftPoint = (p: Point) => createPoint(p.reference!, [p.x, p.y, (p.z ?? 0) + dz]);

    if (s.type === ShapeType.POINT) {
      const p = s as Point;
      (s as any).move3D?.(p.x, p.y, (p.z ?? 0) + dz);
    } else if (s.type === ShapeType.POLYLINE) {
      const pl = s as any;
      const n  = pl.pointCount ?? pl.getPointCount?.() ?? 0;
      const pts: Point[] = [];
      for (let i=0;i<n;i++) pts.push(liftPoint(pl.getPoint(i)));
      (s as any).setToPoints?.(pts);
    } else if (s.type === ShapeType.POLYGON) {
      const pg = s as Polygon;
      const n  = (pg as any).pointCount ?? (pg as any).getPointCount?.() ?? 0;
      const pts: Point[] = [];
      for (let i=0;i<n;i++) pts.push(liftPoint(pg.getPoint(i)));
      this._working = createPolygon(pg.reference!, pts);
    } else if (s.type === ShapeType.SHAPE_LIST) {
      const list = s as any as ShapeList;
      const lifted: Shape[] = [];
      const childCount = (list as any).size?.() ?? (list as any).length ?? 0;
      for (let i=0;i<childCount;i++) {
        const child: Shape = (list as any).get?.(i) ?? (list as any)[i];
        lifted.push(this.raiseZClone(child, dz));
      }
      this._working = createShapeList(s.reference!, lifted);
    } else {
      (s as any).translate3D?.(0,0,dz);
    }
  }

  private raiseZClone(s: Shape, dz:number): Shape {
    if (s.type === ShapeType.POLYGON) {
      const pg = s as Polygon;
      const n  = (pg as any).pointCount ?? (pg as any).getPointCount?.() ?? 0;
      const pts: Point[] = [];
      for (let i=0;i<n;i++) {
        const p = pg.getPoint(i);
        pts.push(createPoint(pg.reference!, [p.x, p.y, (p.z ?? 0) + dz]));
      }
      return createPolygon(pg.reference!, pts);
    }
    if (s.type === ShapeType.POLYLINE) {
      const pl = s as any;
      const n  = pl.pointCount ?? pl.getPointCount?.() ?? 0;
      const pts: Point[] = [];
      for (let i=0;i<n;i++) {
        const p = pl.getPoint(i);
        pts.push(createPoint(pl.reference!, [p.x, p.y, (p.z ?? 0) + dz]));
      }
      return (createPolyline as any)(pl.reference!, pts);
    }
    if (s.type === ShapeType.POINT) {
      const p = s as Point;
      return createPoint(p.reference!, [p.x, p.y, (p.z ?? 0) + dz]);
    }
    const c = s.copy();
    (c as any).translate3D?.(0,0,dz);
    return c;
  }
}
