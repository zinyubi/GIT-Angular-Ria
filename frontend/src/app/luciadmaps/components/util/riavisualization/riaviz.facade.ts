import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import type { LayerDefinition, CreatedLayer, MeshSpec, DebugConfig } from "./riaviz.types";
import { MapContext, LayerRegistry, FeatureStore } from "./riaviz.services";
import type { Feature } from "@luciad/ria/model/feature/Feature.js";

// NEW: mesh helpers
import { buildMeshIconFromSpec } from "./riaviz.mesh";
import type { MeshIcon3DStyle } from "@luciad/ria/view/style/Icon3DStyle.js";

type Kind = "point" | "polyline" | "polygon";

export class RiaVizFacade {
  private ctx: MapContext;
  private reg: LayerRegistry;
  private storeImpl: FeatureStore;

  private featureOwner = new Map<string, { layerId: string; kind: Kind; label: string }>();

  constructor(map: WebGLMap) {
    this.ctx = new MapContext(map);
    this.reg = new LayerRegistry(this.ctx);
    this.storeImpl = new FeatureStore(this.reg);
  }

  /* ---------- Layers ---------- */
  createLayer(def: LayerDefinition, debug?: DebugConfig): CreatedLayer {
    return this.reg.createLayer(def, debug);
  }

  /** Reuse existing layer (label+kind+reference) or create when missing. */
  getOrCreateLayer(def: LayerDefinition, debug?: DebugConfig): CreatedLayer {
    return this.reg.getOrCreateLayer(def, debug);
  }

  setActiveLayer(id: string) { this.reg.setActiveLayer(id); }
  setLayerVisibility(id: string, visible: boolean) { this.reg.setVisibility(id, visible); }
  setLayerOpacity(id: string, opacity: number) { this.reg.setOpacity(id, opacity); }

  /** Mesh-aware layer style update */
  updateLayerStyle(id: string, style: any) {
    const next = this.ensureMesh3D(style);
    this.reg.updateLayerStyle(id, next);
  }

  removeLayer(id: string) { this.reg.remove(id); }

  /* ---------- Editor hooks ---------- */
  lookupOwnerByFeature(feature: Feature) {
    const fid = (feature as any)?.id as string | undefined;
    if (fid && this.featureOwner.has(fid)) return this.featureOwner.get(fid)!;

    for (const entry of this.iterRegistry()) {
      const store: any = entry.store;
      if (!store) continue;

      if (fid && typeof store.get === "function" && (store.get(fid) ?? store.get(Number(fid)))) {
        const info = { layerId: entry.id, kind: entry.kind as Kind, label: entry.label };
        if (fid) this.featureOwner.set(fid, info);
        return info;
      }

      const cursor = (store.query ? store.query() : entry.model?.query?.());
      if (cursor) {
        let found = false;
        this.iterCursor(cursor, (f: Feature) => {
          if (found) return;
          const id = (f as any).id;
          if (f === feature || (fid && id === fid)) found = true;
        });
        if (found) {
          const info = { layerId: entry.id, kind: entry.kind as Kind, label: entry.label };
          if (fid) this.featureOwner.set(fid, info);
          return info;
        }
      }
    }
    return null;
  }

  /** Mesh-aware feature style update */
  updateFeatureStyle(layerId: string, featureId: string, stylePatch: any) {
    const e = this.reg.get(layerId);
    const store: any = (e as any).store;
    if (!store) return;

    let f: any = (typeof store.get === "function") ? (store.get(featureId) ?? store.get(Number(featureId))) : null;
    if (!f) {
      const cursor = (store.query ? store.query() : (e as any).model?.query?.());
      if (cursor) {
        this.iterCursor(cursor, (fx: any) => {
          if (f) return;
          const id = fx?.id;
          if (id === featureId || id === Number(featureId)) f = fx;
        });
      }
    }
    if (!f) return;

    const props = f.properties || {};
    let nextStyle = this.mergeDeep(props.__style || {}, stylePatch || {});
    nextStyle = this.ensureMesh3D(nextStyle);

    const next = { ...f, properties: { ...props, __style: nextStyle } };

    if (typeof store.put === "function") store.put(next);
    else if (typeof store.reload === "function") {
      const items: Feature[] = [];
      const cursor = (store.query ? store.query() : (e as any).model?.query?.());
      this.iterCursor(cursor, (fx: any) => {
        const id = fx?.id;
        items.push((id === featureId || id === Number(featureId)) ? next : fx);
      });
      store.reload(items);
    }
  }

  /** Mesh-aware layer style update by label */
  updateLayerStyleByLabel(label: string, kind: Kind, stylePatch: any) {
    const hit = this.reg.findByLabel(label, kind, undefined);
    if (!hit) return;
    let merged = this.mergeDeep(hit.style || {}, stylePatch || {});
    merged = this.ensureMesh3D(merged);
    this.reg.updateLayerStyle(hit.id, merged);
  }

  /* ---------- Features (+ remember owners) ---------- */
  addPoint(lon: number, lat: number, attrs?: Record<string, any>, style?: any) {
    const a = this.reg.activeLayer; if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPoint(a.id, lon, lat, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "point"); return ref;
  }
  addPoint3D(lon: number, lat: number, alt: number, attrs?: Record<string, any>, style?: any) {
    const a = this.reg.activeLayer; if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPoint3D(a.id, lon, lat, alt, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "point"); return ref;
  }
  addPolyline(coords: Array<[number, number] | [number, number, number]>, attrs?: Record<string, any>, style?: any) {
    const a = this.reg.activeLayer; if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPolyline(a.id, coords, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "polyline"); return ref;
  }
  addPolyline3D(coordsWithZ: Array<[number, number, number]>, attrs?: Record<string, any>, style?: any) {
    const a = this.reg.activeLayer; if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPolyline3D(a.id, coordsWithZ, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "polyline"); return ref;
  }
  addLine3D(coordsWithZ: Array<[number, number, number]>, attrs?: Record<string, any>, style?: any) {
    return this.addPolyline3D(coordsWithZ, attrs, style);
  }
  addPolygon(ring: Array<[number, number] | [number, number, number]>, attrs?: Record<string, any>, style?: any) {
    const a = this.reg.activeLayer; if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPolygon(a.id, ring, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "polygon"); return ref;
  }
  addExtrudedPolygon(ring: Array<[number, number] | [number, number, number]>, minH: number, maxH: number, attrs?: Record<string, any>, style?: any) {
    const a = this.reg.activeLayer; if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addExtrudedPolygon(a.id, ring, minH, maxH, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "polygon"); return ref;
  }
  addExtrudedPolyline(coords: Array<[number, number] | [number, number, number]>, minH: number, maxH: number, attrs?: Record<string, any>, style?: any) {
    const a = this.reg.activeLayer; if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addExtrudedPolyline(a.id, coords, minH, maxH, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "polyline"); return ref;
  }
  addMeshIcon(lon: number, lat: number, mesh: MeshSpec, attrs?: Record<string, any>, style?: any, alt?: number) {
    const a = this.reg.activeLayer; if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addMeshIcon(a.id, lon, lat, mesh, { attrs, style, alt });
    this.rememberOwner(ref?.id, a.id, "point"); return ref;
  }

  get registry(){ return this.reg; }

  /* ---------- internals ---------- */
  private rememberOwner(id?: string, layerId?: string, kind?: Kind) {
    if (!id || !layerId) return;
    try {
      const entry = this.reg.get(layerId);
      const label = (entry as any).layer?.label ?? entry.label ?? "Layer";
      this.featureOwner.set(id, { layerId, kind: (kind || (entry as any).kind) as Kind, label });
    } catch {}
  }

  private *iterRegistry(): Iterable<{ id: string; kind: Kind; label: string; store: any; model: any }> {
    const anyReg: any = this.reg as any;
    if (typeof anyReg.iterEntries === "function") { yield* anyReg.iterEntries(); return; }
    const mapLike: Map<string, any> = anyReg.entries || anyReg._entries;
    if (mapLike?.forEach) {
      const out: any[] = [];
      mapLike.forEach((v: any, k: string) => out.push({ id: k, kind: v.kind, label: v.label, store: v.store, model: v.model }));
      for (const e of out) yield e;
    }
  }

  private iterCursor(cursor: any, cb: (f: Feature) => void) {
    if (!cursor) return;
    if (typeof cursor.forEach === "function") { cursor.forEach(cb); return; }
    if (typeof cursor.hasNext === "function" && typeof cursor.next === "function") {
      while (cursor.hasNext()) cb(cursor.next()); return;
    }
    if (Array.isArray(cursor)) cursor.forEach(cb);
  }

  private mergeDeep<T extends object>(a: T, b: any): T {
    const out: any = Array.isArray(a) ? [...(a as any)] : { ...(a as any) };
    if (b && typeof b === "object") {
      Object.keys(b).forEach(k => {
        const v = (b as any)[k];
        if (v && typeof v === "object" && !Array.isArray(v)) out[k] = this.mergeDeep(out[k] || {}, v);
        else out[k] = v;
      });
    }
    return out as T;
  }

  /** Ensure mesh3d has a Mesh and rebuild geometry when shape/params change */
  private ensureMesh3D(style: any): any {
    if (!style?.point || style.point.symbol !== "mesh3d") return style;

    const m: (MeshIcon3DStyle & { shape?: string; params?: Record<string, any> }) =
      style.point.mesh3d ?? (style.mesh3d as any) ?? {};

    // If geometry definition is present (or mesh missing), (re)build it
    if ((m as any).shape || (m as any).params || !m.mesh) {
      const spec = {
        shape: (m as any).shape ?? "ellipsoid",
        params: (m as any).params ?? {},
        color: (m as any).color,
        scale: (m as any).scale,
        rotation: (m as any).rotation,
        translation: (m as any).translation,
        lightIntensity: (m as any).pbrSettings?.lightIntensity ?? 1.0,
        transparency: (m as any).transparency ?? false
      };
      const icon = buildMeshIconFromSpec(spec);

      style = {
        ...style,
        point: {
          ...style.point,
          symbol: "mesh3d",
          mesh3d: {
            ...m,
            mesh: icon.mesh,
            pbrSettings: icon.pbrSettings,
            color: m.color ?? icon.color,
            scale: m.scale ?? icon.scale,
            rotation: m.rotation ?? icon.rotation,
            translation: m.translation ?? icon.translation,
            transparency: typeof m.transparency === "boolean" ? m.transparency : icon.transparency,
            facetCulling: m.facetCulling ?? icon.facetCulling,
            // keep declarative bits for round-trip with editor
            shape: (m as any).shape ?? spec.shape,
            params: (m as any).params ?? spec.params
          }
        }
      };
    }
    return style;
  }
}
