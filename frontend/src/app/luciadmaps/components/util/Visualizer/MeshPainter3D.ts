// src/app/luciadmaps/components/util/MeshPainter3D.ts
import { FeaturePainter, PaintState } from "@luciad/ria/view/feature/FeaturePainter.js";
import { GeoCanvas } from "@luciad/ria/view/style/GeoCanvas.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { Point } from "@luciad/ria/shape/Point.js";
import { ShapeType } from "@luciad/ria/shape/ShapeType.js";
import type { Icon3DStyle } from "@luciad/ria/view/style/Icon3DStyle.js";

export class MeshPainter3D extends FeaturePainter {
  override paintBody(
    geoCanvas: GeoCanvas,
    feature: Feature,
    shape: any,
    _layer: any,
    _map: any,
    paintState: PaintState
  ): void {
    if (!(shape instanceof Point) || shape.type !== ShapeType.POINT) return;
    const props: any = feature.properties ?? {};
    const base: Icon3DStyle | undefined = props.meshStyle;
    const sel:  Icon3DStyle | undefined = props.meshStyleSelected;
    const style = paintState?.selected ? (sel ?? base) : base;
    if (!style) return;
    geoCanvas.drawIcon3D(shape, style);
  }
}
