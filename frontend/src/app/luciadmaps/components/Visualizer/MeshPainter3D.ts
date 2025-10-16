import { FeaturePainter, PaintState } from "@luciad/ria/view/feature/FeaturePainter.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { GeoCanvas } from "@luciad/ria/view/style/GeoCanvas.js";
import { Layer } from "@luciad/ria/view/Layer.js";
import { Map } from "@luciad/ria/view/Map.js";
import { Point } from "@luciad/ria/shape/Point.js";
import { ShapeType } from "@luciad/ria/shape/ShapeType.js";
import type { Icon3DStyle } from "@luciad/ria/view/style/Icon3DStyle.js";

export class MeshPainter3D extends FeaturePainter {
  override paintBody(
    geoCanvas: GeoCanvas,
    feature: Feature,
    shape: any,
    layer: Layer,
    map: Map,
    paintState: PaintState
  ): void {
    if (!(shape instanceof Point) || shape.type !== ShapeType.POINT) return;
    const props: any = feature.properties || {};
    const base: Icon3DStyle | undefined = props.meshStyle;
    const selected: Icon3DStyle | undefined = props.meshStyleSelected;
    const style = paintState?.selected ? (selected ?? base) : base;
    if (!style) return;
    geoCanvas.drawIcon3D(shape, style);
  }
}
