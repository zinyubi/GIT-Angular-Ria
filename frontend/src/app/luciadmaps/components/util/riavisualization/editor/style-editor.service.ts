// src/app/luciadmaps/components/util/riavisualization/editor/style-editor.service.ts
import { Injectable } from "@angular/core";
import type { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
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

    // (re)wire SelectionChanged listener
    this.off?.();
    const h = (this.map as any).on?.("SelectionChanged", (ev: any) =>
      this.onSelection(ev)
    );
    this.off = () => (h?.remove ? h.remove() : undefined);

    console.info("[StyleEditorService] init done");
  }

  dispose() {
    this.off?.();
    this.off = null;
    this.current = null;
    console.info("[StyleEditorService] disposed");
  }

  getCurrent(): SelectedContext | null {
    return this.current;
  }

  /**
   * Apply style patch to the currently selected feature AND its layer.
   *
   * 1) Feature-level: props.__style (used by ScenarioLayerHelper.styleProvider)
   * 2) Layer-level:   merge patch into entry.style and call updateLayerStyle(id,…)
   */
  patchSelectedFeature(stylePatch: any) {
    if (!this.current) {
      console.warn("[StyleEditorService] patchSelectedFeature → no current selection");
      return;
    }

    const { layerId, layerLabel, kind, featureId } = this.current;

    console.group("[StyleEditorService] patchSelectedFeature");
    console.log("→ selection:", { layerId, layerLabel, kind, featureId });
    console.log("→ stylePatch:", stylePatch);

    // 1) Feature-level styling
    try {
      this.viz.updateFeatureStyle(layerId, featureId, stylePatch);
    } catch (e) {
      console.warn("[StyleEditorService] updateFeatureStyle failed", e);
    }

    // 2) Also patch the owning layer style (by layerId, not label)
    try {
      const entry: any = (this.viz as any).registry?.get?.(layerId);
      const baseStyle = entry?.style || entry?.layer?.style || {};
      const merged = this.mergeDeep(baseStyle, stylePatch);
      console.log("→ patching layer style (merged):", merged);
      this.viz.updateLayerStyle(layerId, merged);
    } catch (e) {
      console.warn("[StyleEditorService] updateLayerStyle(layerId) failed", e);
    }

    console.groupEnd();
  }

  /** Apply style patch to entire layer (using layerId from current selection) */
  patchLayer(stylePatch: any) {
    if (!this.current) {
      console.warn("[StyleEditorService] patchLayer → no current selection");
      return;
    }

    const { layerId, layerLabel, kind } = this.current;

    console.group("[StyleEditorService] patchLayer");
    console.log("→ selection:", { layerId, layerLabel, kind });
    console.log("→ stylePatch:", stylePatch);

    try {
      const entry: any = (this.viz as any).registry?.get?.(layerId);
      const baseStyle = entry?.style || entry?.layer?.style || {};
      const merged = this.mergeDeep(baseStyle, stylePatch);
      console.log("→ merged layer style:", merged);
      this.viz.updateLayerStyle(layerId, merged);
    } catch (e) {
      console.warn("[StyleEditorService] patchLayer/updateLayerStyle failed", e);
    }

    console.groupEnd();
  }

  // ───────────────────────────── Selection handling ─────────────────────────────

  private onSelection(ev: any) {
    console.group("👆 [StyleEditor] onSelection");
    console.log("→ event:", ev);

    const changes = ev?.selectionChanges ?? [];

    // Try to find a *newly selected* feature in this event
    let f: Feature | undefined;
    for (let i = changes.length - 1; i >= 0 && !f; i--) {
      const added = changes[i]?.selected;
      if (Array.isArray(added) && added.length > 0) {
        f = added[0] as Feature;
      }
    }

    // Fallback: global selection on the map
    if (!f) {
      const sel = (this.map as any).selection;
      if (sel && Array.isArray(sel) && sel.length > 0) {
        f = sel[0] as Feature;
        console.log("→ using map.selection[0] as fallback:", f);
      }
    }

    // IMPORTANT:
    // Luciad may send SelectionChanged events with only "deselected" items
    // (e.g., after a feature is updated), while the user still has something
    // visually selected. In that case, we *do not* clear the current context
    // if map.selection is still populated.
    if (!f) {
      const sel = (this.map as any).selection;
      if (sel && Array.isArray(sel) && sel.length > 0) {
        console.log(
          "→ no new selected feature in event, but map.selection still non-empty; keeping current selection"
        );
        console.groupEnd();
        return;
      }

      // Real clear: nothing in event AND nothing in map.selection
      this.current = null;
      console.info("❌ [StyleEditor] selection really cleared (no selection left)");
      console.groupEnd();
      return;
    }

    console.log("→ feature selected:", f);

    // 🔑 Ask RiaViz which layer owns this feature
    const owner = this.viz.lookupOwnerByFeature(f);
    console.log("→ lookupOwnerByFeature:", owner);

    if (!owner) {
      console.warn("[StyleEditor] onSelection → no owner for feature, keeping previous selection");
      console.groupEnd();
      return;
    }

    const featureId =
      (f as any).id ??
      (f as any).properties?.id ??
      "unknown";

    this.current = {
      layerId: owner.layerId,
      layerLabel: owner.label,
      kind: owner.kind,
      featureId,
      feature: f,
    };

    console.log("→ updated current selection:", this.current);
    console.groupEnd();
  }

  // ───────────────────────────── helpers ─────────────────────────────

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
}
