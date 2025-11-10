import { Injectable } from "@angular/core";
import type { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import type { Feature } from "@luciad/ria/model/feature/Feature.js";
import type { RiaVizFacade } from "../index";

export type SelectedContext = {
  layerId: string;
  layerLabel: string;
  kind: "point" | "polyline" | "polygon";
  featureId: string;
  feature: Feature;
};

@Injectable({ providedIn: "root" })
export class StyleEditorService {
  private map!: WebGLMap;
  private viz!: RiaVizFacade;
  private off: (() => void) | null = null;
  private current: SelectedContext | null = null;

  init(map: WebGLMap, viz: RiaVizFacade) {
    this.map = map;
    this.viz = viz;
    this.off?.();
    const h = (this.map as any).on?.("SelectionChanged", (ev: any) => this.onSelection(ev));
    this.off = () => (h?.remove ? h.remove() : undefined);
  }

  dispose() { this.off?.(); this.off = null; }
  getCurrent(): SelectedContext | null { return this.current; }

  patchSelectedFeature(stylePatch: any) {
    if (!this.current) return;
    this.viz.updateFeatureStyle(this.current.layerId, this.current.featureId, stylePatch);
  }

  patchLayerByLabel(stylePatch: any) {
    if (!this.current) return;
    this.viz.updateLayerStyleByLabel(this.current.layerLabel, this.current.kind, stylePatch);
  }

  // ---- internals ----
  private onSelection(ev: any) {
    const sel = ev?.selectionChanges?.[0]?.selected ?? [];
    const f = sel[0] as Feature | undefined;
    if (!f) { this.current = null; return; }

    const hit = this.findLayerForFeature(f);
    if (!hit) { this.current = null; return; }

    const featureId = (f as any).id ?? (f as any).properties?.id ?? "unknown";
    this.current = {
      layerId: hit.layerId,
      layerLabel: hit.label,
      kind: hit.kind,
      featureId,
      feature: f
    };
  }

  private findLayerForFeature(feature: Feature) {
    const tree = (this.map as any).layerTree;
    const layers: FeatureLayer[] = [];
    tree.traverse((n: any) => { if (n.layer instanceof FeatureLayer) layers.push(n.layer); });

    for (const fl of layers) {
      const store = (fl.model as any)?.store;
      if (!store) continue;
      const id = (feature as any).id;
      if (id && store.get(id)) {
        return {
          layer: fl,
          layerId: (fl as any).id ?? ((fl as any).label ?? "Layer"),
          label: (fl as any).label ?? "Layer",
          kind: this.inferKind(fl)
        };
      }
    }
    return null;
  }

  private inferKind(fl: FeatureLayer): "point"|"polyline"|"polygon" {
    const p: any = fl.painter;
    return (p?.cfg?.kind as any) ?? "point";
  }
}
