import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  signal
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import type { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import type { Feature } from "@luciad/ria/model/feature/Feature.js";
import {
  createPoint,
  createPolyline,
  createPolygon
} from "@luciad/ria/shape/ShapeFactory.js";

// ========================
// Local type declarations
// ========================
type Kind = "point" | "polyline" | "polygon";
type CoordMode = "LLH" | "XYZ";
type MeshShape = "ellipsoid" | "ellipsoidalDome" | "cone" | "cylinder" | "arrow" | "glb";

interface SelectedCtx {
  feature: Feature;
  featureId: string;
  layerId: string;
  layerLabel: string;
  kind: Kind;
  coordMode: CoordMode;
}

@Component({
  standalone: true,
  selector: "ria-location-editor",
  imports: [CommonModule, FormsModule],
  templateUrl: "./location-editor.component.html",
  styleUrls: ["./location-editor.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RiaLocationEditorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) map!: WebGLMap;
  @Input({ required: true }) viz!: any;

  // enable console logging of selected object
  @Input() debug = true;

  // collapsed state (two-way bound like your style editor)
  private _collapsed = false;
  @Input() set collapsed(v: boolean) { this._collapsed = !!v; }
  get collapsed() { return this._collapsed; }
  @Output() collapsedChange = new EventEmitter<boolean>();
  toggleCollapsed() {
    this._collapsed = !this._collapsed;
    this.collapsedChange.emit(this._collapsed);
  }

  sel = signal<SelectedCtx | null>(null);

  // ----------------- POINT EDIT FIELDS -----------------
  point = {
    x: 0, y: 0, z: 0,
    stepXY: 0.0001,
    stepZ: 10
  };

  // ----------------- TRANSLATION (line/polygon) -----------------
  delta = {
    dx: 0, dy: 0, dz: 0,
    stepXY: 0.0005,
    stepZ: 10
  };

  // ----------------- MESH UI STATE -----------------
  mesh = {
    shape: "ellipsoid" as MeshShape,
    color: "#66ccff",
    transparency: false,
    lightIntensity: 1.0,
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },        // degrees
    translation: { x: 0, y: 0, z: 0 },     // meters
    params: {
      // ellipsoid/dome
      radiusX: 10, radiusY: 10, radiusZ: 10,
      verticalSlices: 24, horizontalSlices: 16,
      // cone/cylinder
      radius: 8, height: 20,
      // general
      slices: 48,
      // arrow
      stickRadius: 5, stickLength: 40, tipBaseRadius: 10, tipLength: 20
    } as Record<string, any>
  };

  private offSel: { remove(): void } | null = null;

  // ============= LIFECYCLE =============
  ngOnInit() {
    // Listen to Luciad selection
    this.offSel = (this.map as any).on?.("SelectionChanged", (ev: any) => {
      const feat = ev?.selectionChanges?.[0]?.selected?.[0] as Feature | undefined;
      if (!feat) { this.sel.set(null); return; }

      const fid = (feat as any).id as string | undefined;
      if (fid && typeof fid === "string" && fid.startsWith("dbg-")) { this.sel.set(null); return; }

      const owner = this.viz?.lookupOwnerByFeature?.(feat);
      if (!owner) { this.sel.set(null); return; }

      const coordMode = this.detectCoordMode(feat);
      const ctx: SelectedCtx = {
        feature: feat,
        featureId: fid ?? (feat as any).properties?.id ?? "id",
        layerId: owner.layerId,
        layerLabel: owner.label,
        kind: owner.kind,
        coordMode
      };

      this.sel.set(ctx);
      this.populateFromFeature(ctx);
      this.logSelection(feat, owner, ctx); // <-- print the selected object & summary
    });
  }

  ngOnDestroy() { this.offSel?.remove?.(); this.offSel = null; }

  // ============= APPLY: POINT =============
  applyPoint() {
    const s = this.sel(); if (!s || s.kind !== "point") return;

    const { store, model } = this.getStoreLike(s.layerId);
    if (!store) { console.warn("[LocationEditor] store not found"); return; }

    const cur = this.getFeatureFromStore(store, model, s);
    if (!cur) { console.warn("[LocationEditor] feature not found in store", s.featureId); return; }

    const ref: any = (cur as any).shape?._reference || (cur as any).shape?.reference || this.map.reference;
    const { x, y, z } = this.point;

    const newShape = createPoint(ref, [x, y, z ?? 0]);
    const next = this.cloneWithShape(cur, newShape, s.featureId);

    this.putOrReload(store, model, s.featureId, next);
  }

  // ============= APPLY: TRANSLATE LINE/POLYGON =============
  applyTranslate() {
    const s = this.sel(); if (!s || (s.kind !== "polyline" && s.kind !== "polygon")) return;

    const { store, model } = this.getStoreLike(s.layerId);
    if (!store) { console.warn("[LocationEditor] store not found"); return; }

    const cur = this.getFeatureFromStore(store, model, s);
    if (!cur) return;

    const sh: any = (cur as any).shape;
    const ref: any = sh?._reference || sh?.reference || this.map.reference;

    const src = this.getPointCoords(sh);
    if (!src || !src.length) return;

    const { dx, dy, dz } = this.delta;

    const moved: Array<[number, number, number]> = src.map(([px, py, pz]) => ([
      (px ?? 0) + dx,
      (py ?? 0) + dy,
      (pz ?? 0) + (dz ?? 0)
    ]) as [number, number, number]);

    let newShape: any;

    if (s.kind === "polyline") {
      newShape = createPolyline(ref, moved);
    } else {
      const first = moved[0];
      const last  = moved[moved.length - 1];
      const isClosed = last && first &&
        last[0] === first[0] && last[1] === first[1] && (last[2] ?? 0) === (first[2] ?? 0);

      const closed: Array<[number, number, number]> = isClosed
        ? moved
        : [...moved, [first[0], first[1], first[2] ?? 0] as [number, number, number]];

      newShape = createPolygon(ref, closed);
    }

    const next = this.cloneWithShape(cur, newShape, s.featureId);
    this.putOrReload(store, model, s.featureId, next);
  }

  // ============= APPLY: MESH (NEW) =============
  applyMesh() {
    const s = this.sel(); if (!s) return;

    if (typeof this.viz?.updateMeshSpec === "function") {
      const patch = {
        shape: this.mesh.shape,
        color: this.mesh.color,
        transparency: this.mesh.transparency,
        lightIntensity: this.mesh.lightIntensity,
        scale: { ...this.mesh.scale },
        rotation: { ...this.mesh.rotation },
        translation: { ...this.mesh.translation },
        params: { ...this.mesh.params }
      };
      const ok = this.viz.updateMeshSpec(s.featureId, patch);
      if (!ok) console.warn("[LocationEditor] updateMeshSpec failed (feature missing spec?)");
    } else {
      console.warn("[LocationEditor] viz.updateMeshSpec not found; add it to your Visualizer facade.");
    }
  }

  // ============= POPULATE / DETECT =============
  private populateFromFeature(ctx: SelectedCtx) {
    const sh: any = (ctx.feature as any).shape;
    if (sh) {
      if (ctx.kind === "point") {
        const p = this.pointFromShape(sh);
        this.point.x = p[0] ?? 0;
        this.point.y = p[1] ?? 0;
        this.point.z = p[2] ?? 0;
        this.point.stepXY = ctx.coordMode === "LLH" ? 0.0001 : 10;
        this.point.stepZ = 10;
      } else {
        this.delta.dx = 0; this.delta.dy = 0; this.delta.dz = 0;
        this.delta.stepXY = ctx.coordMode === "LLH" ? 0.0005 : 10;
        this.delta.stepZ = 10;
      }
    }

    // populate mesh UI if there is mesh spec/style
    if (this.hasMeshSpec(ctx)) this.populateMeshFromFeature(ctx.feature);
  }

  private detectCoordMode(feat: Feature): CoordMode {
    try {
      const ref: any = (feat as any).shape?._reference || (feat as any).shape?.reference;
      const id = (ref?.identifier || ref?.code || ref?.name || "").toString().toUpperCase();
      if (id.includes("GEOCENTRIC") || id.includes("ECEF") || id.includes("XYZ")) return "XYZ";
    } catch {}
    const p = this.pointFromShape((feat as any).shape);
    if (Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90) return "LLH";
    return "LLH";
  }

  // ============= STORE HELPERS =============
  private getStoreLike(layerId: string): { store: any | null; model: any | null } {
    const entry = (this.viz as any).registry?.get?.(layerId);
    const model: any = entry?.layer?.model ?? entry?.model ?? null;
    const store = (model && (model.store || model._store)) ? (model.store || model._store) : entry?.store ?? null;
    return { store, model };
  }

  private queryAll(store: any, model?: any) {
    if (model && typeof model.query === "function") return model.query();
    if (store && typeof store.query === "function") return store.query();
    return null;
  }

  private iterCursor(cursor: any, cb: (f: Feature) => void) {
    if (!cursor) return;
    if (typeof cursor.forEach === "function") { cursor.forEach(cb); return; }
    if (typeof cursor.hasNext === "function" && typeof cursor.next === "function") {
      while (cursor.hasNext()) cb(cursor.next());
      return;
    }
    if (Array.isArray(cursor)) cursor.forEach(cb);
  }

  private getFromStoreById(store: any, extId: string): Feature | null {
    // try raw id first
    const direct = store?.get?.(extId);
    if (direct) return direct;

    // try to coerce common forms: "f_123" or "123" -> 123
    const m = /^f[_-]?(\d+)$/.exec(String(extId));
    const maybeNum = m ? Number(m[1]) : Number(extId);
    if (Number.isFinite(maybeNum)) {
      const byNum = store?.get?.(maybeNum);
      if (byNum) return byNum;
    }
    return null;
  }

  private getFeatureFromStore(store: any, model: any, s: SelectedCtx): Feature | null {
    let cur = s.featureId ? this.getFromStoreById(store, s.featureId) : undefined;
    if (cur) return cur;
    const cursor = this.queryAll(store, model);
    let found: Feature | null = null;
    this.iterCursor(cursor, (f: Feature) => {
      const id = (f as any).id;
      if (!found && (f === s.feature || (id && id === s.featureId))) found = f;
    });
    return found;
  }

  private putOrReload(store: any, model: any, featureId: string, next: Feature) {
    if (typeof store.put === "function") {
      store.put(next);
      return;
    }
    const items: Feature[] = [];
    const cursor = this.queryAll(store, model);
    this.iterCursor(cursor, (f: Feature) => {
      const id = (f as any).id;
      items.push(id === featureId ? next : f);
    });
    store.reload?.(items);
  }

  private cloneWithShape(cur: Feature, newShape: any, id: string): Feature {
    return {
      id,
      shape: newShape,
      properties: (cur as any).properties,
      copy() {
        return {
          id: this.id,
          shape: this.shape,
          properties: { ...(this.properties || {}) },
          copy: this.copy
        };
      }
    } as Feature;
  }

  // ============= GEOMETRY UTILS =============
  private pointFromShape(sh: any): [number, number, number] {
    if (typeof sh?.x === "number" && typeof sh?.y === "number") {
      return [sh.x, sh.y, typeof sh.z === "number" ? sh.z : 0];
    }
    const c = sh?._coords || sh?.coordinates || sh?._coordinates;
    if (Array.isArray(c)) {
      return [c[0] ?? 0, c[1] ?? 0, c[2] ?? 0];
    }
    return [0, 0, 0];
  }

  /** Returns an array of tuple coordinates for line / polygon outer ring */
  private getPointCoords(sh: any): Array<[number, number, number]> | null {
    if (typeof sh?.pointCount === "number" && typeof sh?.point === "function") {
      const out: Array<[number, number, number]> = [];
      for (let i = 0; i < sh.pointCount; i++) {
        const p = sh.point(i) as any;
        out.push([p.x ?? p[0] ?? 0, p.y ?? p[1] ?? 0, p.z ?? p[2] ?? 0]);
      }
      return out;
    }
    if (Array.isArray(sh?.rings) && sh.rings.length > 0) {
      const ring = sh.rings[0];
      return (ring as any[]).map(p => [
        p?.x ?? p?.[0] ?? 0,
        p?.y ?? p?.[1] ?? 0,
        p?.z ?? p?.[2] ?? 0,
      ]) as Array<[number, number, number]>;
    }
    if (Array.isArray(sh?._rings) && sh._rings.length > 0) {
      const ring = sh._rings[0];
      return (ring as any[]).map(p => [
        p?.x ?? p?.[0] ?? 0,
        p?.y ?? p?.[1] ?? 0,
        p?.z ?? p?.[2] ?? 0,
      ]) as Array<[number, number, number]>;
    }
    if (Array.isArray(sh?.points)) {
      return (sh.points as any[]).map(p => [
        p?.x ?? p?.[0] ?? 0,
        p?.y ?? p?.[1] ?? 0,
        p?.z ?? p?.[2] ?? 0,
      ]) as Array<[number, number, number]>;
    }
    if (Array.isArray(sh?._coordinates) && Array.isArray(sh._coordinates[0])) {
      return (sh._coordinates as any[]).map(p => [
        p?.[0] ?? 0, p?.[1] ?? 0, p?.[2] ?? 0
      ]) as Array<[number, number, number]>;
    }
    return null;
  }

  // ============= MESH HELPERS (NEW) =============
  hasMeshSpec(s?: SelectedCtx | null) {
    const f = s?.feature as any;
    return !!(f?.properties?.meshSpec || f?.properties?.meshStyle);
  }

  private populateMeshFromFeature(f: Feature) {
    const p: any = (f as any).properties ?? {};
    const spec = p.meshSpec as any;
    const style = p.meshStyle as any;

    if (spec) {
      this.mesh.shape = spec.shape ?? this.mesh.shape;
      this.mesh.color = spec.color ?? this.mesh.color;
      this.mesh.transparency = !!spec.transparency;
      this.mesh.lightIntensity = spec.lightIntensity ?? 1.0;

      const sc = (typeof spec.scale === "number")
        ? { x: spec.scale, y: spec.scale, z: spec.scale }
        : (spec.scale || {});
      this.mesh.scale = { x: 1, y: 1, z: 1, ...sc };
      this.mesh.rotation = { x: 0, y: 0, z: 0, ...(spec.rotation || {}) };
      this.mesh.translation = { x: 0, y: 0, z: 0, ...(spec.translation || {}) };
      this.mesh.params = { ...(spec.params || this.mesh.params) };
      return;
    }

    if (style) {
      this.mesh.color = style.color ?? this.mesh.color;
      this.mesh.transparency = !!style.transparency;
      this.mesh.scale = { x: 1, y: 1, z: 1, ...(style.scale || {}) };
      this.mesh.rotation = { x: 0, y: 0, z: 0, ...(style.rotation || {}) };
      this.mesh.translation = { x: 0, y: 0, z: 0, ...(style.translation || {}) };
    }
  }

  nudgePoint(dx: number, dy: number, dz: number = 0) {
    this.point.x += dx; this.point.y += dy; this.point.z += dz;
  }
  nudgeDelta(dx: number, dy: number, dz: number = 0) {
    this.delta.dx += dx; this.delta.dy += dy; this.delta.dz += dz;
  }

  nudgeMeshTranslation(dx=0, dy=0, dz=0) {
    this.mesh.translation.x += dx;
    this.mesh.translation.y += dy;
    this.mesh.translation.z += dz;
  }
  nudgeMeshRotation(rx=0, ry=0, rz=0) {
    this.mesh.rotation.x += rx;
    this.mesh.rotation.y += ry;
    this.mesh.rotation.z += rz;
  }
  nudgeMeshScale(sx=0, sy=0, sz=0) {
    this.mesh.scale.x += sx; this.mesh.scale.y += sy; this.mesh.scale.z += sz;
  }

  // ============= GETTERS =============
  get selected(): SelectedCtx | null { return this.sel(); }

  // ============= DEBUG HELPERS =============
  private stringifySafe(obj: any, space = 2) {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (k, v) => {
        if (typeof v === "object" && v !== null) {
          if (seen.has(v)) return "[[Circular]]";
          seen.add(v);
        }
        return v;
      },
      space
    );
  }

  private logSelection(feat: Feature, owner: any, ctx: SelectedCtx) {
    if (!this.debug) return;

    const shape: any = (feat as any).shape;
    const coordsPeek = (() => {
      try {
        const p = this.pointFromShape(shape);
        if (Array.isArray(p) && p.length) return { x: p[0], y: p[1], z: p[2] };
      } catch {}
      return undefined;
    })();

    console.groupCollapsed(
      `%c[LocationEditor] Selected`,
      "color:#2563eb;font-weight:600",
      { id: ctx.featureId, kind: ctx.kind, layer: ctx.layerLabel, coordMode: ctx.coordMode }
    );

    console.log("→ Summary:", {
      featureId: ctx.featureId,
      kind: ctx.kind,
      layerId: ctx.layerId,
      layerLabel: ctx.layerLabel,
      coordMode: ctx.coordMode,
      coordsPeek
    });

    console.log("→ Feature:", feat);
    console.log("→ Feature.properties:", (feat as any).properties);
    console.log("→ Feature.shape:", shape);

    try {
      console.log("→ Feature (JSON snapshot):", this.stringifySafe({
        id: (feat as any).id,
        properties: (feat as any).properties,
        shape: {
          type: shape?.constructor?.name,
          x: shape?.x, y: shape?.y, z: shape?.z,
          pointCount: shape?.pointCount
        }
      }, 2));
    } catch {}

    console.log("→ Owner:", owner);
    console.log("→ SelectedCtx:", ctx);

    console.groupEnd();
  }
}
