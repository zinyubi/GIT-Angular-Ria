import { ReferenceType } from '@luciad/ria/reference/ReferenceType.js';
import { Bounds } from '@luciad/ria/shape/Bounds.js';
import { createTransformation } from '@luciad/ria/transformation/TransformationFactory.js';
import { FeatureLayer } from '@luciad/ria/view/feature/FeatureLayer.js';
import { Layer } from '@luciad/ria/view/Layer.js';
import { LayerGroup } from '@luciad/ria/view/LayerGroup.js';
import { LayerTreeNode } from '@luciad/ria/view/LayerTreeNode.js';
import { LayerTreeNodeType } from '@luciad/ria/view/LayerTreeNodeType.js';
import { LayerTreeVisitor } from '@luciad/ria/view/LayerTreeVisitor.js';
import { TileSet3DLayer } from '@luciad/ria/view/tileset/TileSet3DLayer.js';

export async function getFitBounds(node: LayerTreeNode): Promise<Bounds | null> {
  if (node.treeNodeType === LayerTreeNodeType.LAYER) {
    if (node instanceof FeatureLayer) {
      if (node.bounds) return node.bounds;
      return new Promise((resolve) => {
        const done = node.workingSet.on('QueryFinished', () => { done?.remove(); err?.remove(); resolve(node.bounds || null); });
        const err = node.workingSet.on('QueryError', () => { done?.remove(); err?.remove(); resolve(node.bounds || null); });
      });
    }
    if (node instanceof TileSet3DLayer &&
        node.model.reference.referenceType === ReferenceType.CARTESIAN &&
        node.transformation) {
      return node.bounds;
    }
    return ((node as any).model?.bounds) || (node as any).bounds || null;
  }

  if (node.treeNodeType === LayerTreeNodeType.LAYER_GROUP) {
    const layers: Layer[] = [];
    const visitor: LayerTreeVisitor = {
      visitLayer: (l) => { layers.push(l); return LayerTreeVisitor.ReturnValue.CONTINUE; },
      visitLayerGroup: (g: LayerGroup) => { g.visitChildren(visitor, LayerTreeNode.VisitOrder.TOP_DOWN); return LayerTreeVisitor.ReturnValue.CONTINUE; }
    };
    node.accept(visitor);

    const parts = await Promise.all(layers.map(l => getFitBounds(l)));
    let acc: Bounds | null = null;
    for (const b of parts) {
      if (!b) continue;
      if (!acc) { acc = b; continue; }
      const toAcc = createTransformation(b.reference!, acc.reference!);
      const bInAcc = toAcc.transformBounds(b);
      acc.setTo2DUnion(bInAcc);
    }
    return acc;
  }

  return null;
}
