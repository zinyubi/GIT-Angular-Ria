import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { MemoryStore } from "@luciad/ria/model/store/MemoryStore.js";
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { MeshPainter3D } from "./MeshPainter3D.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { createPoint } from "@luciad/ria/shape/ShapeFactory.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import { buildIcon3DStyle, buildSelectedStyle } from "./MeshFactory.js";
import type { MeshSpec, VisualizerAPI, VisualizerOptions } from "./types.js";

/**
 * Visualizer keeps its *model* in CRS:84 on purpose, matching LuciadRIA 3D icon samples.
 * Works on any WebGLMap reference (EPSG:4978 or 2D projections).
 */
export class Visualizer implements VisualizerAPI {
  private map: WebGLMap;
  private model: FeatureModel;
  private layer: FeatureLayer;

  constructor(opts: VisualizerOptions) {
    this.map = opts.map;

    // ✔ Keep model in CRS:84 (lon/lat[/alt])
    this.model = new FeatureModel(new MemoryStore({ data: [] }), {
      reference: getReference("CRS:84")
    });

    this.layer = new FeatureLayer(this.model, {
      label: opts.label ?? "Visualizer 3D",
      painter: new MeshPainter3D(),
      selectable: true,
      hoverable: true
    });

    this.map.layerTree.addChild(this.layer);
  }

  getLayer() { return this.layer; }
  getModel() { return this.model; }

  add(spec: MeshSpec): string {
    const id = spec.id ?? `viz-${Date.now()}-${Math.floor(Math.random()*1e6)}`;

    // Build CRS:84 point (lon,lat,alt)
    const p = createPoint(this.model.reference, [spec.lon, spec.lat, spec.alt ?? 0]);

    const base = buildIcon3DStyle(spec);
    const selected = buildSelectedStyle(base, spec);

    const f = new Feature(p, { meshStyle: base, meshStyleSelected: selected }, id);

    // Add to model (call available method as per docs)
    if (typeof (this.model as any).add === "function") {
      (this.model as any).add(f);
    } else if (typeof (this.model as any).put === "function") {
      (this.model as any).put(f);
    } else {
      const store: any = (this.model as any).store;
      store?.add?.(f);
    }

    return id;
  }

  update(id: string, partial: Partial<MeshSpec>): boolean {
    const getFn = (this.model as any).get ?? (this.model as any).store?.get;
    const existing = getFn?.call(this.model, id) as Feature | undefined;
    if (!existing) return false;

    const props: any = existing.properties ?? {};
    const base = props.meshStyle;

    const mergedSpec: MeshSpec = { type: "ellipsoid", lon: 0, lat: 0, ...partial } as any;
    const newBase = partial.type ? buildIcon3DStyle(mergedSpec) : { ...base, ...partial };
    const newSel  = buildSelectedStyle(newBase, mergedSpec);

    existing.properties = { ...props, meshStyle: newBase, meshStyleSelected: newSel };

    if (typeof (this.model as any).put === "function") {
      (this.model as any).put(existing);
    } else {
      const store: any = (this.model as any).store;
      store?.put?.(existing);
    }
    return true;
  }

  remove(id: string): boolean {
    if (typeof (this.model as any).remove === "function") {
      return !!(this.model as any).remove(id);
    }
    const store: any = (this.model as any).store;
    return !!store?.remove?.(id);
  }

  clear(): void {
    const store: any = (this.model as any).store;
    if (store?.query) {
      const cursor = store.query();
      const ids: string[] = [];
      for (const f of cursor) ids.push(f.id as string);
      ids.forEach((i) => this.remove(i));
    }
  }
}
