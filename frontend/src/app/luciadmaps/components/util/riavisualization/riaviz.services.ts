import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import type { CoordinateReference } from "@luciad/ria/reference/CoordinateReference.js";
import { MemoryStore } from "@luciad/ria/model/store/MemoryStore.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { createPoint, createPolyline, createPolygon, createExtrudedShape } from "@luciad/ria/shape/ShapeFactory.js";
import type { Shape } from "@luciad/ria/shape/Shape.js";
import type { Feature , FeatureId } from "@luciad/ria/model/feature/Feature.js";

import { GenericFeaturePainter } from "./riaviz.painter";
import {
  LayerDefinition, CreatedLayer, AddFeatureOptions, FeatureRef,
  StyleDefinition, MeshSpec, DebugConfig
} from "./riaviz.types";
import { assert, uid, toMapPoint, toMapPoint3D, toMapCoords, delay } from "./riaviz.utils";
import { buildMeshIconFromSpec } from "./riaviz.mesh";

type RegistryEntry = {
  id: string; kind: "point" | "polyline" | "polygon";
  layer: FeatureLayer; model: FeatureModel; store: MemoryStore<Feature>;
  reference: CoordinateReference; style?: StyleDefinition; debug?: DebugConfig; label: string;
};

function makeFeature(id: FeatureId, shape: Shape, properties: Record<string, any>): Feature {
  return {
    id, shape, properties,
    copy() {
      return {
        id: this.id as FeatureId,
        shape: this.shape,
        properties: { ...(this.properties || {}) },
        copy: this.copy
      } as Feature;
    }
  } as Feature;
}
// Simple numeric id generator for internal FeatureId
let _seq = 0;
const nextFeatureId = (): FeatureId => (++_seq as unknown as FeatureId);

export class MapContext {
  constructor(private _map: WebGLMap) {}
  get map(): WebGLMap { return this._map; }
  get reference(): CoordinateReference { return this._map.reference; }
  addLayer(layer: FeatureLayer) { this._map.layerTree.addChild(layer); }
  removeLayer(layer: FeatureLayer) { this._map.layerTree.removeChild(layer); }
}

function wireDebug(entry: RegistryEntry) {
  const dbg = entry.debug;
  if (!dbg?.enabled) return;

  if (dbg.storeLogs) {
    entry.store.on(
      "StoreChanged",
      (eventType: string, feature: Feature, id: FeatureId) => {
        console.debug(`[Store:${entry.layer.label}] ${eventType} id=${id}`, feature?.properties);
      },
      undefined,
      undefined
    );
  }

  if (dbg.outlineNew) {
    let inOutline = false;

    entry.store.on(
      "StoreChanged",
      (eventType: string, feature: Feature, _id: FeatureId) => {
        if (eventType !== "add" || !feature) return;
        if (inOutline) return;

        try {
          inOutline = true;

          const dbgId = nextFeatureId();
          const props =
            entry.kind === "polygon"
              ? { __debug: true, __style: { polygon: { fill: "rgba(0,0,0,0)", outline: "#ff00ff", outlineWidth: 3 } } }
              : entry.kind === "polyline"
              ? { __debug: true, __style: { line: { color: "#ff00ff", width: 5 } } }
              : { __debug: true, __style: { point: { symbol: "circle", size: 1, fill: "rgba(0,0,0,0)", outline: "#ff00ff", outlineWidth: 3 } } };

          entry.store.add(makeFeature(dbgId, feature.shape!, props));

          // Remove after a moment; avoid async fn to keep the exact signature
          setTimeout(() => {
            try { entry.store.remove(dbgId); }
            finally { inOutline = false; }
          }, 1200);
        } catch {
          inOutline = false;
        }
      },
      undefined,
      undefined
    );
  }
}



export class LayerRegistry {
  private entries = new Map<string, RegistryEntry>(); // key = id
  private _activeLayerId: string | null = null;

  constructor(private ctx: MapContext) {}

  get activeLayer(): RegistryEntry | null {
    return this._activeLayerId ? this.entries.get(this._activeLayerId) || null : null;
  }
  setActiveLayer(id: string) { assert(this.entries.has(id), `Layer '${id}' not found`); this._activeLayerId = id; }

  /** Find a layer by label (and optionally by kind/reference). */
  findByLabel(label: string, kind?: RegistryEntry["kind"], refName?: string): RegistryEntry | null {
    for (const e of this.entries.values()) {
      const sameLabel = e.label === label;
      const sameKind = kind ? e.kind === kind : true;
      const sameRef = refName ? (e.reference as any).identifier === refName : true;
      if (sameLabel && sameKind && sameRef) return e;
    }
    return null;
  }

  /** Create a fresh layer. */
  createLayer(def: LayerDefinition, debug?: DebugConfig): CreatedLayer {
    const id = def.id || uid("lyr");
    assert(!this.entries.has(id), `Layer with id '${id}' already exists`);

    const reference = def.reference ? getReference(def.reference) : this.ctx.reference;
    const store = new MemoryStore<Feature>({ data: [] });
    const model = new FeatureModel(store, { reference });

    const painter = new GenericFeaturePainter({
      kind: def.kind, layerStyle: def.style,
      featureStyle: (f) => ((f as any).properties?.__style as Partial<StyleDefinition> | undefined),
      debug
    });

    const layer = new FeatureLayer(model, { label: def.label, selectable: true, editable: true, painter });
    if (def.visible === false) layer.visible = false;

    this.ctx.addLayer(layer);
    const entry: RegistryEntry = { id, kind: def.kind, layer, model, store, reference, style: def.style, debug, label: def.label };
    this.entries.set(id, entry);
    this._activeLayerId = id;
    wireDebug(entry);
    return { id, label: def.label, kind: def.kind };
  }

  /** Get existing by label/kind/ref or create when missing. */
  getOrCreateLayer(def: LayerDefinition, debug?: DebugConfig): CreatedLayer {
    const existing = this.findByLabel(def.label, def.kind, def.reference);
    if (existing) {
      this._activeLayerId = existing.id;
      if (def.style) this.updateLayerStyle(existing.id, def.style); // optional style refresh
      return { id: existing.id, label: existing.label, kind: existing.kind };
    }
    return this.createLayer(def, debug);
  }

  get(id: string): RegistryEntry { const e = this.entries.get(id); assert(e, `Layer '${id}' not found`); return e!; }
  setVisibility(id: string, visible: boolean) { this.get(id).layer.visible = visible; }
  setOpacity(id: string, opacity: number) {
    const e = this.get(id);
    const nextStyle: StyleDefinition = { ...(e.style || {}), opacity: Math.max(0, Math.min(1, opacity)) };
    this.updateLayerStyleInternal(e, nextStyle);
  }
  remove(id: string) {
    const e = this.get(id);
    this.ctx.removeLayer(e.layer);
    this.entries.delete(id);
    if (this._activeLayerId === id) this._activeLayerId = null;
  }
  updateLayerStyle(id: string, style: any) {
    const e = this.get(id);
    this.updateLayerStyleInternal(e, style);
  }
  private updateLayerStyleInternal(e: RegistryEntry, style: StyleDefinition) {
    e.style = style;
    e.layer.painter = new GenericFeaturePainter({
      kind: e.kind, layerStyle: style,
      featureStyle: (f) => ((f as any).properties?.__style as Partial<StyleDefinition> | undefined),
      debug: e.debug
    });
  }
}

export class FeatureStore {
  constructor(private reg: LayerRegistry) {}

  addPoint(layerId: string, lon: number, lat: number, opts?: AddFeatureOptions): FeatureRef {
    const e = this.reg.get(layerId);
    const shape = toMapPoint(e.reference, lon, lat);
    return this.addShape(e, shape, opts);
  }
  addPoint3D(layerId: string, lon: number, lat: number, alt: number, opts?: AddFeatureOptions): FeatureRef {
    const e = this.reg.get(layerId);
    const shape = toMapPoint3D(e.reference, lon, lat, alt);
    return this.addShape(e, shape, opts);
  }

  addPolyline(layerId: string, wgs: Array<[number, number] | [number, number, number]>, opts?: AddFeatureOptions): FeatureRef {
    const e = this.reg.get(layerId);
    const pts = toMapCoords(e.reference, wgs);
    const shape = createPolyline(e.reference, pts as any);
    return this.addShape(e, shape, opts);
  }
  addPolyline3D(layerId: string, wgs3D: Array<[number, number, number]>, opts?: AddFeatureOptions): FeatureRef {
    const e = this.reg.get(layerId);
    const pts = toMapCoords(e.reference, wgs3D);
    const shape = createPolyline(e.reference, pts as any);
    return this.addShape(e, shape, opts);
  }
  addLine3D(layerId: string, wgs3D: Array<[number, number, number]>, opts?: AddFeatureOptions): FeatureRef {
    return this.addPolyline3D(layerId, wgs3D, opts);
  }

  addPolygon(layerId: string, wgsRing: Array<[number, number] | [number, number, number]>, opts?: AddFeatureOptions): FeatureRef {
    const e = this.reg.get(layerId);
    const pts = toMapCoords(e.reference, wgsRing).map(c => createPoint(e.reference, c as number[]));
    const shape = createPolygon(e.reference, pts as any);
    return this.addShape(e, shape, opts);
  }
  addExtrudedPolygon(layerId: string, wgsRing: Array<[number, number] | [number, number, number]>, minH: number, maxH: number, opts?: AddFeatureOptions): FeatureRef {
    const e = this.reg.get(layerId);
    const pts = toMapCoords(e.reference, wgsRing).map(c => createPoint(e.reference, c as number[]));
    const base = createPolygon(e.reference, pts as any);
    const shape = createExtrudedShape(e.reference, base, minH, maxH);
    return this.addShape(e, shape, opts);
  }
  addExtrudedPolyline(layerId: string, wgs: Array<[number, number] | [number, number, number]>, minH: number, maxH: number, opts?: AddFeatureOptions): FeatureRef {
    const e = this.reg.get(layerId);
    const pts = toMapCoords(e.reference, wgs);
    const base = createPolyline(e.reference, pts as any);
    const shape = createExtrudedShape(e.reference, base, minH, maxH);
    return this.addShape(e, shape, opts);
  }

  addMeshIcon(layerId: string, lon: number, lat: number, meshSpec: MeshSpec, extra?: AddFeatureOptions & { alt?: number }): FeatureRef {
    const e = this.reg.get(layerId);
    const shape = (typeof extra?.alt === "number")
      ? toMapPoint3D(e.reference, lon, lat, extra!.alt!)
      : toMapPoint(e.reference, lon, lat);

    const icon3D = buildMeshIconFromSpec(meshSpec);
    const stylePatch: Partial<StyleDefinition> = {
      point: { symbol: "mesh3d", mesh3d: {
        mesh: icon3D.mesh, color: icon3D.color, rotation: icon3D.rotation, orientation: icon3D.orientation,
        scale: icon3D.scale, translation: icon3D.translation, pbrSettings: icon3D.pbrSettings,
        transparency: icon3D.transparency, facetCulling: icon3D.facetCulling
      } }
    };
    const merged = extra?.style ? { ...stylePatch, ...extra.style } : stylePatch;
    return this.addShape(e, shape, { attrs: extra?.attrs, style: merged });
  }

  updateAttributes(layerId: string, featureId: string, attrs: Record<string, any>) {
    const e = this.reg.get(layerId);
    const f = e.store.get(featureId); assert(f, `Feature '${featureId}' not found`);
    const next = makeFeature(featureId, f!.shape!, { ...(f as any).properties, ...attrs });
    e.store.put(next);
  }

  deleteFeatures(layerId: string, ids: string[]) {
    const e = this.reg.get(layerId);
    ids.forEach((id) => e.store.remove(id));
  }

  private addShape(e: RegistryEntry, shape: Shape, opts?: AddFeatureOptions): FeatureRef {
    const id = uid("f");
    const baseProps = (opts?.attrs || {});
    const props = opts?.style ? { ...baseProps, __style: opts.style } : baseProps;
    const feature = makeFeature(id, shape, props);
    e.store.add(feature);
    return { id, layerId: e.id };
  }
}
