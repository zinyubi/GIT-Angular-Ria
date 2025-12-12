import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import type { Feature } from "@luciad/ria/model/feature/Feature.js";
import type { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";

import type {
  LayerDefinition,
  CreatedLayer,
  MeshSpec,
  DebugConfig,
} from "./riaviz.types";

import { MapContext, LayerRegistry, FeatureStore } from "./riaviz.services";
import { buildMeshIconFromSpec } from "./riaviz.mesh";

type Kind = "point" | "polyline" | "polygon";

export class RiaVizFacade {
  private map: WebGLMap;
  private ctx: MapContext;
  private reg: LayerRegistry;
  private storeImpl: FeatureStore;

  // Cache: featureId → { layerId, kind, label }
  private featureOwner = new Map<
    string,
    { layerId: string; kind: Kind; label: string }
  >();

  constructor(map: WebGLMap) {
    this.map = map;
    this.ctx = new MapContext(map);
    this.reg = new LayerRegistry(this.ctx);
    this.storeImpl = new FeatureStore(this.reg);

    console.info("[RiaVizFacade] constructed", { map });
  }

  /* ------------------------------------------------------------------
   * Layers
   * ------------------------------------------------------------------ */

  createLayer(def: LayerDefinition, debug?: DebugConfig): CreatedLayer {
    const lyr = this.reg.createLayer(def, debug);
    console.info("[RiaVizFacade] createLayer", { def, created: lyr });
    return lyr;
  }

  getOrCreateLayer(def: LayerDefinition, debug?: DebugConfig): CreatedLayer {
    const lyr = this.reg.getOrCreateLayer(def, debug);
    console.info("[RiaVizFacade] getOrCreateLayer", { def, created: lyr });
    return lyr;
  }

  setActiveLayer(target: string | FeatureLayer | { id: string }) {
    console.info("[RiaVizFacade] setActiveLayer", { target });

    if (typeof target === "string") {
      this.reg.setActiveLayer(target);
      console.info("[RiaVizFacade] setActiveLayer by id", { id: target });
      return;
    }

    // FeatureLayer instance or {id}
    if ((target as any).layer && (target as any).id) {
      // already registry-like entry
      this.reg.setActiveLayer((target as any).id);
      console.info("[RiaVizFacade] setActiveLayer by entry object", {
        id: (target as any).id,
      });
      return;
    }

    // Plain FeatureLayer
    const layerObj = target as FeatureLayer;
    const { id } = this.ensureEntryForLayer(layerObj);
    this.reg.setActiveLayer(id);
    console.info("[RiaVizFacade] setActiveLayer for existing FeatureLayer", {
      id,
      label: (layerObj as any).label,
    });
  }

  getActiveLayerMeta():
    | { id: string; label: string; kind: Kind; style: any }
    | null {
    const a: any = (this.reg as any).activeLayer;
    if (!a) return null;
    return {
      id: a.id,
      label: a.label,
      kind: a.kind as Kind,
      style: a.style,
    };
  }

  setLayerVisibility(id: string, visible: boolean) {
    console.info("[RiaVizFacade] setLayerVisibility", { id, visible });
    this.reg.setVisibility(id, visible);
    (this.map as any).repaint?.();
  }

  setLayerOpacity(id: string, opacity: number) {
    console.info("[RiaVizFacade] setLayerOpacity", { id, opacity });
    this.reg.setOpacity(id, opacity);
    (this.map as any).repaint?.();
  }

  /**
   * Mesh-aware layer style update.
   *
   * We treat `stylePatch` as a **patch** and merge it with
   * the current style so that callers (StyleEditor) can send partial updates.
   */
  updateLayerStyle(id: string, stylePatch: any) {
    console.group("[RiaVizFacade] updateLayerStyle");
    console.log("→ id:", id);
    console.log("→ stylePatch:", stylePatch);

    const entry: any =
      (this.reg as any).get?.(id) ??
      (this.reg as any).get(id as any);
    console.log("→ registry entry:", entry);

    const current = entry?.style || entry?.layer?.style || {};
    console.log("→ current style:", current);

    let merged = this.mergeDeep(current, stylePatch || {});
    merged = this.ensureMesh3D(merged);
    console.log("→ merged style:", merged);

    this.reg.updateLayerStyle(id, merged);

    const fullEntry: any = (this.reg as any).get?.(id) ?? entry;
    if (fullEntry?.layer) {
      fullEntry.layer.style = merged;
      console.log("→ synced style to FeatureLayer.style");
    }

    (this.map as any).repaint?.();
    console.groupEnd();
  }

  /** Mesh-aware layer style update by label (patch merge) */
  updateLayerStyleByLabel(label: string, kind: Kind, stylePatch: any) {
    console.group("[RiaVizFacade] updateLayerStyleByLabel");
    console.log("→ label:", label, "kind:", kind);
    console.log("→ stylePatch:", stylePatch);

    const anyReg: any = this.reg as any;
    let hit: any = null;

    // 1) Try registry’s findByLabel
    if (typeof anyReg.findByLabel === "function") {
      hit = anyReg.findByLabel(label, kind, undefined);
      if (!hit) {
        // fallback: any kind with same label
        hit = anyReg.findByLabel(label, undefined, undefined);
      }
    }

    // 2) Fallback: scan entries by label
    if (!hit) {
      for (const entry of this.iterRegistry()) {
        if (entry.label === label) {
          hit = anyReg.get?.(entry.id) ?? entry;
          break;
        }
      }
    }

    if (!hit) {
      console.warn(
        "[RiaVizFacade] updateLayerStyleByLabel → no entry for",
        { label, kind }
      );
      console.groupEnd();
      return;
    }

    const current = hit.style || hit.layer?.style || {};
    console.log("→ current style:", current);

    let merged = this.mergeDeep(current, stylePatch || {});
    merged = this.ensureMesh3D(merged);
    console.log("→ merged style:", merged);

    this.reg.updateLayerStyle(hit.id, merged);

    const fullEntry = anyReg.get?.(hit.id) ?? hit;
    if (fullEntry?.layer) {
      fullEntry.layer.style = merged;
      console.log("→ synced style to FeatureLayer.style");
    }

    (this.map as any).repaint?.();
    console.groupEnd();
  }

  removeLayer(id: string) {
    console.info("[RiaVizFacade] removeLayer", { id });
    this.reg.remove(id);
    (this.map as any).repaint?.();
  }

  /* ------------------------------------------------------------------
   * Editor hooks
   * ------------------------------------------------------------------ */

  /** Which RiaViz layer owns this feature? (used by editors) */
  lookupOwnerByFeature(feature: Feature) {
    console.group("[RiaVizFacade] lookupOwnerByFeature");
    console.log("→ feature:", feature);

    const fid = (feature as any)?.id as string | undefined;
    console.log("→ feature id:", fid);

    if (fid && this.featureOwner.has(fid)) {
      const cached = this.featureOwner.get(fid)!;
      console.log("→ hit featureOwner cache:", cached);
      console.groupEnd();
      return cached;
    }

    for (const entry of this.iterRegistry()) {
      const store: any = entry.store;
      if (!store) continue;

      // Fast path: direct get
      if (
        fid &&
        typeof store.get === "function" &&
        (store.get(fid) ?? store.get(Number(fid)))
      ) {
        const info = {
          layerId: entry.id,
          kind: entry.kind as Kind,
          label: entry.label,
        };
        console.log("→ found by store.get:", info);
        if (fid) this.featureOwner.set(fid, info);
        console.groupEnd();
        return info;
      }

      // Slow path: scan cursor
      const cursor = store.query ? store.query() : entry.model?.query?.();
      if (cursor) {
        let found = false;
        this.iterCursor(cursor, (f: Feature) => {
          if (found) return;
          const id = (f as any).id;
          if (f === feature || (fid && id === fid)) {
            found = true;
          }
        });

        if (found) {
          const info = {
            layerId: entry.id,
            kind: entry.kind as Kind,
            label: entry.label,
          };
          console.log("→ found by cursor scan:", info);
          if (fid) this.featureOwner.set(fid, info);
          console.groupEnd();
          return info;
        }
      }
    }

    console.warn("[RiaVizFacade] lookupOwnerByFeature → not found");
    console.groupEnd();
    return null;
  }

  /**
   * Mesh-aware feature style update (per-feature).
   *
   * IMPORTANT:
   *   1) We patch props.__style on the feature (used by ScenarioLayerHelper.styleProvider)
   *   2) We ALSO call updateLayerStyle(layerId, stylePatch) as a fallback so
   *      the layer’s own style is updated if the styleProvider isn’t used.
   */
  updateFeatureStyle(layerId: string, featureId: string, stylePatch: any) {
    console.group("[RiaVizFacade] updateFeatureStyle");
    console.log("→ layerId:", layerId, "featureId:", featureId);
    console.log("→ stylePatch:", stylePatch);

    const e: any =
      (this.reg as any).get?.(layerId) ??
      this.reg.get(layerId as any);
    console.log("→ registry entry:", e);

    const store: any = e?.store;
    if (!store) {
      console.warn("[RiaVizFacade] updateFeatureStyle → no store for layer", {
        layerId,
      });
      console.groupEnd();
      return;
    }

    let f: any =
      typeof store.get === "function"
        ? store.get(featureId) ?? store.get(Number(featureId))
        : null;

    if (!f) {
      console.log("→ feature not found by store.get, scanning cursor");
      const cursor = store.query ? store.query() : e.model?.query?.();
      if (cursor) {
        this.iterCursor(cursor, (fx: any) => {
          if (f) return;
          const id = fx?.id;
          if (id === featureId || id === Number(featureId)) f = fx;
        });
      }
    }

    if (!f) {
      console.warn("[RiaVizFacade] updateFeatureStyle → feature not found", {
        layerId,
        featureId,
      });
      console.groupEnd();
      return;
    }

    console.log("→ found feature:", f);

    const props = f.properties || {};
    let nextStyle = this.mergeDeep(props.__style || {}, stylePatch || {});
    nextStyle = this.ensureMesh3D(nextStyle);

    console.log("→ existing props.__style:", props.__style);
    console.log("→ nextStyle:", nextStyle);

    const next = { ...f, properties: { ...props, __style: nextStyle } };

    if (typeof store.put === "function") {
      store.put(next);
      console.log("→ store.put(next) done");
    } else if (typeof store.reload === "function") {
      const items: Feature[] = [];
      const cursor = store.query ? store.query() : e.model?.query?.();
      this.iterCursor(cursor, (fx: any) => {
        const id = (fx as any)?.id;
        items.push(id === featureId || id === Number(featureId) ? next : fx);
      });
      store.reload(items);
      console.log("→ store.reload(items) done");
    } else {
      console.warn("[RiaVizFacade] store has no put/reload, nothing updated");
    }

    // 🔥 Fallback: also patch the layer’s style so visuals ALWAYS change,
    // even if a custom styleProvider does not read props.__style.
    try {
      console.log("→ also patching layer style via updateLayerStyle");
      this.updateLayerStyle(layerId, stylePatch);
    } catch (err) {
      console.warn(
        "[RiaVizFacade] updateFeatureStyle → updateLayerStyle fallback failed",
        err
      );
    }

    (this.map as any).repaint?.();
    console.groupEnd();
  }

  /* ------------------------------------------------------------------
   * Features – active layer
   * ------------------------------------------------------------------ */

  addPoint(
    lon: number,
    lat: number,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const a = (this.reg as any).activeLayer;
    if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPoint(a.id, lon, lat, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "point");
    (this.map as any).repaint?.();
    return ref;
  }

  addPoint3D(
    lon: number,
    lat: number,
    alt: number,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const a = (this.reg as any).activeLayer;
    if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPoint3D(a.id, lon, lat, alt, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "point");
    (this.map as any).repaint?.();
    return ref;
  }

  addPolyline(
    coords: Array<[number, number] | [number, number, number]>,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const a = (this.reg as any).activeLayer;
    if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPolyline(a.id, coords, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "polyline");
    (this.map as any).repaint?.();
    return ref;
  }

  addPolyline3D(
    coordsWithZ: Array<[number, number, number]>,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const a = (this.reg as any).activeLayer;
    if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPolyline3D(a.id, coordsWithZ, {
      attrs,
      style,
    });
    this.rememberOwner(ref?.id, a.id, "polyline");
    (this.map as any).repaint?.();
    return ref;
  }

  addLine3D(
    coordsWithZ: Array<[number, number, number]>,
    attrs?: Record<string, any>,
    style?: any
  ) {
    return this.addPolyline3D(coordsWithZ, attrs, style);
  }

  addPolygon(
    ring: Array<[number, number] | [number, number, number]>,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const a = (this.reg as any).activeLayer;
    if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addPolygon(a.id, ring, { attrs, style });
    this.rememberOwner(ref?.id, a.id, "polygon");
    (this.map as any).repaint?.();
    return ref;
  }

  addExtrudedPolygon(
    ring: Array<[number, number] | [number, number, number]>,
    minH: number,
    maxH: number,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const a = (this.reg as any).activeLayer;
    if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addExtrudedPolygon(a.id, ring, minH, maxH, {
      attrs,
      style,
    });
    this.rememberOwner(ref?.id, a.id, "polygon");
    (this.map as any).repaint?.();
    return ref;
  }

  addExtrudedPolyline(
    coords: Array<[number, number] | [number, number, number]>,
    minH: number,
    maxH: number,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const a = (this.reg as any).activeLayer;
    if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addExtrudedPolyline(a.id, coords, minH, maxH, {
      attrs,
      style,
    });
    this.rememberOwner(ref?.id, a.id, "polyline");
    (this.map as any).repaint?.();
    return ref;
  }

  addMeshIcon(
    lon: number,
    lat: number,
    mesh: MeshSpec,
    attrs?: Record<string, any>,
    style?: any,
    alt?: number
  ) {
    const a = (this.reg as any).activeLayer;
    if (!a) throw new Error("No active layer");
    const ref = this.storeImpl.addMeshIcon(a.id, lon, lat, mesh, {
      attrs,
      style,
      alt,
    });
    this.rememberOwner(ref?.id, a.id, "point");
    (this.map as any).repaint?.();
    return ref;
  }

  /* ------------------------------------------------------------------
   * Features for a specific FeatureLayer (scenario helper)
   * ------------------------------------------------------------------ */

  private ensureEntryForLayer(layer: FeatureLayer): { id: string; entry: any } {
    const layerObj: any = layer as any;
    const idFromLayer =
      layerObj && typeof layerObj.id !== "undefined"
        ? String(layerObj.id)
        : undefined;

    if (!idFromLayer) {
      throw new Error("ensureEntryForLayer: layer must have an 'id' property");
    }

    const anyReg: any = this.reg as any;
    const entries: Map<string, any> =
      anyReg.entries || anyReg._entries || anyReg._entryMap;

    if (!entries) {
      throw new Error(
        "ensureEntryForLayer: LayerRegistry has no internal entries map"
      );
    }

    // Try to reuse existing entry
    for (const [key, value] of entries.entries()) {
      const v = value as any;
      if (v.layer === layerObj) {
        console.info("[RiaVizFacade] ensureEntryForLayer → reuse by layer", {
          key,
          entry: v,
        });
        return { id: key, entry: v };
      }
      if (String(v.id) === idFromLayer) {
        console.info("[RiaVizFacade] ensureEntryForLayer → reuse by id", {
          key,
          entry: v,
        });
        return { id: key, entry: v };
      }
    }

    // Not found → create new entry
    const model = layerObj.model;
    const store = model?.store;
    const reference =
      model?.reference ?? (this.ctx as any).mapRef ?? (this.ctx as any).reference;

    const entryId = idFromLayer;
    const entry = {
      id: entryId,
      layer: layerObj,
      label: layerObj.label ?? "Layer",
      kind: (layerObj as any).kind ?? ("point" as Kind),
      store,
      model,
      reference,
      style: layerObj.style,
    };

    entries.set(entryId, entry);
    console.info("[RiaVizFacade] ensureEntryForLayer → new registry entry", {
      id: entryId,
      entry,
    });

    return { id: entryId, entry };
  }

  addPoint3DForLayer(
    layer: FeatureLayer,
    lon: number,
    lat: number,
    alt: number,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const { id } = this.ensureEntryForLayer(layer);
    const ref = this.storeImpl.addPoint3D(id, lon, lat, alt, { attrs, style });
    this.rememberOwner(ref?.id, id, "point");
    (this.map as any).repaint?.();
    return ref;
  }

  addLine3DForLayer(
    layer: FeatureLayer,
    coordsWithZ: Array<[number, number, number]>,
    attrs?: Record<string, any>,
    style?: any
  ) {
    const { id } = this.ensureEntryForLayer(layer);
    const ref = this.storeImpl.addPolyline3D(id, coordsWithZ, { attrs, style });
    this.rememberOwner(ref?.id, id, "polyline");
    (this.map as any).repaint?.();
    return ref;
  }

  get registry() {
    return this.reg;
  }

  /* ------------------------------------------------------------------
   * Internals
   * ------------------------------------------------------------------ */

  private rememberOwner(id?: string, layerId?: string, kind?: Kind) {
    if (!id || !layerId) return;
    try {
      const entry: any =
        (this.reg as any).get?.(layerId) ??
        this.reg.get(layerId as any);
      const label =
        entry?.layer?.label ?? entry?.label ?? "Layer";
      this.featureOwner.set(id, {
        layerId,
        kind: (kind || entry?.kind || "point") as Kind,
        label,
      });
      console.info("[RiaVizFacade] rememberOwner", {
        featureId: id,
        layerId,
        kind,
        label,
      });
    } catch (err) {
      console.warn("[RiaVizFacade] rememberOwner failed", err);
    }
  }

  private *iterRegistry(): Iterable<{
    id: string;
    kind: Kind;
    label: string;
    store: any;
    model: any;
  }> {
    const anyReg: any = this.reg as any;

    if (typeof anyReg.iterEntries === "function") {
      yield* anyReg.iterEntries();
      return;
    }

    const mapLike: Map<string, any> =
      anyReg.entries || anyReg._entries || anyReg._entryMap;

    if (mapLike?.forEach) {
      const out: any[] = [];
      mapLike.forEach((v: any, k: string) =>
        out.push({
          id: k,
          kind: v.kind as Kind,
          label: v.label ?? v.layer?.label ?? "Layer",
          store: v.store,
          model: v.model,
        })
      );
      for (const e of out) yield e;
    }
  }

  private iterCursor(cursor: any, cb: (f: Feature) => void) {
    if (!cursor) return;
    if (typeof cursor.forEach === "function") {
      cursor.forEach(cb);
      return;
    }
    if (typeof cursor.hasNext === "function" && typeof cursor.next === "function") {
      while (cursor.hasNext()) cb(cursor.next());
      return;
    }
    if (Array.isArray(cursor)) cursor.forEach(cb);
  }

  private mergeDeep<T extends object>(a: T, b: any): T {
    const out: any = Array.isArray(a) ? [...(a as any)] : { ...(a as any) };
    if (b && typeof b === "object") {
      Object.keys(b).forEach((k) => {
        const v = (b as any)[k];
        if (v && typeof v === "object" && !Array.isArray(v)) {
          out[k] = this.mergeDeep(out[k] || {}, v);
        } else {
          out[k] = v;
        }
      });
    }
    return out as T;
  }

  private ensureMesh3D(style: any): any {
    if (!style?.point || style.point.symbol !== "mesh3d") {
      return style;
    }

    const m: any = style.point.mesh3d ?? (style.mesh3d as any) ?? {};

    if (m.shape || m.params || !m.mesh) {
      const spec = {
        shape: m.shape ?? "ellipsoid",
        params: m.params ?? {},
        color: m.color,
        scale: m.scale,
        rotation: m.rotation,
        translation: m.translation,
        lightIntensity: m.pbrSettings?.lightIntensity ?? 1.0,
        transparency: m.transparency ?? false,
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
            transparency:
              typeof m.transparency === "boolean"
                ? m.transparency
                : icon.transparency,
            facetCulling: m.facetCulling ?? icon.facetCulling,
            shape: m.shape ?? spec.shape,
            params: m.params ?? spec.params,
          },
        },
      };
    }
    return style;
  }
}
