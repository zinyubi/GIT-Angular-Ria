// src/app/luciadmaps/components/util/gizmo/GizmoOverlayLayer.ts
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { MemoryStore } from "@luciad/ria/model/store/MemoryStore.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { Shape } from "@luciad/ria/shape/Shape.js";
import { Map } from "@luciad/ria/view/Map.js";
import { ShapePainter2D } from "../Visualizer/ShapePainter2D";

export class GizmoOverlayLayer {
  private model = new FeatureModel(new MemoryStore({ data: [] }));
  private layer = new FeatureLayer(this.model, {
    label: "Gizmo",
    painter: new ShapePainter2D(),
    selectable: false,
    editable: false,
    hoverable: false
  });

  private featureIds: string[] = [];
  private attached = false;

  attach(map: Map) {
    if (this.attached) return;
    map.layerTree.addChild(this.layer, "top");
    this.attached = true;
  }

  clear() {
    const store: any = (this.model as any).store;
    if (store?.remove) {
      for (const id of this.featureIds) store.remove(id);
    }
    this.featureIds = [];
  }

  update(shapes: Shape[]) {
    this.clear();
    const store: any = (this.model as any).store;

    const gizmoProps = {
      color: "rgba(0,102,255,1)",  // blue handles
      width: 2,
      outlineColor: "rgba(255,255,255,0.9)",
      outlineWidth: 1
    };

    shapes.forEach((shape, i) => {
      const f = new Feature(shape, { gizmo: true, ...gizmoProps }, `gizmo-${Date.now()}-${i}`);
      const id =
        store?.add?.(f) ??
        (this.model as any).add?.(f) ??
        String(f.id);
      this.featureIds.push(id);
    });
  }
}
