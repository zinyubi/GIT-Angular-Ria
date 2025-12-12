// src/app/luciadmaps/components/util/riavisualization/sim-labels.painter.ts

import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { Shape } from "@luciad/ria/shape/Shape.js";
import { FeaturePainter, PaintState } from "@luciad/ria/view/feature/FeaturePainter.js";
import { Layer } from "@luciad/ria/view/Layer.js";
import { Map as LuciadMap } from "@luciad/ria/view/Map.js";
import { GeoCanvas } from "@luciad/ria/view/style/GeoCanvas.js";
import { LabelCanvas } from "@luciad/ria/view/style/LabelCanvas.js";

import { PointLabelStyle } from "@luciad/ria/view/style/PointLabelStyle.js";
import { PointLabelPosition } from "@luciad/ria/view/style/PointLabelPosition.js";
import { OnPathLabelStyle } from "@luciad/ria/view/style/OnPathLabelStyle.js";
import { PathLabelPosition } from "@luciad/ria/view/style/PathLabelPosition.js";
import { PathLabelRotation } from "@luciad/ria/view/style/PathLabelRotation.js";

import { SimStyleRegistry, SimFeatureKind } from "./simstyle.registry";

/** Tiny canvas icon – no luciad-toolbox dependency */
function createCircleCanvas(
  size: number,
  fill: string,
  outline: string,
  outlineWidth: number
): HTMLCanvasElement {
  const s = Math.max(2, Math.round(size));
  const ow = Math.max(0, Math.round(outlineWidth));
  const pad = ow + 1;

  const canvas = document.createElement("canvas");
  canvas.width = s + pad * 2;
  canvas.height = s + pad * 2;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = s / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();

  if (ow > 0) {
    ctx.lineWidth = ow;
    ctx.strokeStyle = outline;
    ctx.stroke();
  }

  return canvas;
}

export class SimLabelsPainter extends FeaturePainter {
  private readonly pointLabelStyle: PointLabelStyle;
  private readonly pathLabelStyle: OnPathLabelStyle;

  // cache icons so we don’t recreate every frame
  private readonly iconCache = new Map<string, HTMLCanvasElement>();

  constructor(private readonly registry: SimStyleRegistry) {
    super();

    this.pointLabelStyle = {
      positions:
        PointLabelPosition.NORTH_EAST |
        PointLabelPosition.NORTH_WEST |
        PointLabelPosition.SOUTH_EAST |
        PointLabelPosition.SOUTH_WEST,
      offset: 4,
      priority: 0,
    };

    const minimumGap = 400;
    const initialGap = minimumGap / 2;
    this.pathLabelStyle = {
      positions: PathLabelPosition.ABOVE,
      rotation: PathLabelRotation.FIXED_LINE_ANGLE,
      repeat: { minimumGap, initialGap },
      priority: 0,
    };
  }

  override getDetailLevelScales(): number[] {
    return [1 / 40000000];
  }

  // ───────────────────────── bodies ─────────────────────────

  override paintBody(
    geoCanvas: GeoCanvas,
    feature: Feature,
    shape: Shape,
    _layer: Layer,
    _map: LuciadMap,
    paintState: PaintState
  ): void {
    const props: any = (feature as any).properties ?? {};
    const kind: SimFeatureKind | undefined =
      props.kind === "sim-aircraft" ? "sim-aircraft" :
      props.kind === "sim-trail" ? "sim-trail" :
      undefined;

    if (!kind) return;

    const selected = !!paintState.selected;
    const aircraftId = String(props?.aircraftId ?? "");

    // TRAIL: use registry.getStyle() (returns ShapeStyle)
    if (kind === "sim-trail") {
      const resolved = this.registry.getStyle(kind, props, selected);
      if (!resolved?.bodyStyle) return;
      geoCanvas.drawShape(shape, resolved.bodyStyle as any);
      return;
    }

    // AIRCRAFT: draw ICON (prevents default Luciad dot)
    const st = this.registry.resolveAircraftPoint(aircraftId, props, selected);

    const size = Number(st?.size ?? 12);
    const fill = this.registry.rgba(st?.fill, st?.fillA) ?? "rgba(34,197,94,1)";
    const outline = this.registry.rgba(st?.outline, st?.outlineA) ?? "rgba(15,23,42,0.9)";
    const outlineWidth = Number(st?.outlineWidth ?? 2);

    const cacheKey = `${size}|${fill}|${outline}|${outlineWidth}`;
    let icon = this.iconCache.get(cacheKey);
    if (!icon) {
      icon = createCircleCanvas(size, fill, outline, outlineWidth);
      this.iconCache.set(cacheKey, icon);
    }

    geoCanvas.drawIcon(shape, {
      image: icon,
      width: `${size}px`,
      height: `${size}px`,
    } as any);
  }

  // ───────────────────────── labels ─────────────────────────

  override paintLabel(
    labelCanvas: LabelCanvas,
    feature: Feature,
    shape: Shape,
    _layer: Layer,
    _map: LuciadMap,
    paintState: PaintState
  ): void {
    const props: any = (feature as any).properties ?? {};
    const kind: SimFeatureKind | undefined =
      props.kind === "sim-aircraft" ? "sim-aircraft" :
      props.kind === "sim-trail" ? "sim-trail" :
      undefined;

    if (!kind) return;

    const selected = !!paintState.selected;
    const aircraftId = String(props?.aircraftId ?? "");

    if (kind === "sim-aircraft") {
      const { html, priority } = this.registry.resolveAircraftLabel(aircraftId, props, selected);
      if (!html) return;
      this.pointLabelStyle.priority = priority ?? 0;
      labelCanvas.drawLabel(html, shape, this.pointLabelStyle);
      return;
    }

    const { html, priority } = this.registry.resolveTrailLabel(aircraftId, props, selected);
    if (!html) return;
    this.pathLabelStyle.priority = priority ?? 0;
    labelCanvas.drawLabelOnPath(html, shape, this.pathLabelStyle);
  }
}
