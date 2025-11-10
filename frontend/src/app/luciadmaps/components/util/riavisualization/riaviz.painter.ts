// src/app/luciadmaps/components/util/riavisualization/riaviz.painter.ts
import { FeaturePainter, PaintState } from "@luciad/ria/view/feature/FeaturePainter.js";
import { GeoCanvas } from "@luciad/ria/view/style/GeoCanvas.js";
import type { Feature } from "@luciad/ria/model/feature/Feature.js";
import { Point } from "@luciad/ria/shape/Point.js";

import type { MeshIcon3DStyle } from "@luciad/ria/view/style/Icon3DStyle.js";
import type { ImageIconStyle } from "@luciad/ria/view/style/IconStyle.js";
import type { LineStyle } from "@luciad/ria/view/style/LineStyle.js";
import type { ShapeStyle } from "@luciad/ria/view/style/ShapeStyle.js";
import { DrapeTarget } from "@luciad/ria/view/style/DrapeTarget.js";

import { LayerKind, StyleDefinition, PointStyle as PointDef, DebugConfig } from "./riaviz.types";
import { clamp01, mergeStyle, withAlpha, throttle } from "./riaviz.utils";

export interface PainterOptions {
  kind: LayerKind;
  layerStyle?: StyleDefinition;
  featureStyle?: (feature: Feature) => Partial<StyleDefinition> | undefined;
  debug?: DebugConfig;
}

const logPaint = throttle((msg:string, ...args:any[]) => console.debug(msg, ...args), 500);

function resolveStyle(base?: StyleDefinition, ov?: Partial<StyleDefinition>): StyleDefinition {
  return { opacity: ov?.opacity ?? base?.opacity, point: mergeStyle(base?.point, ov?.point),
           line: mergeStyle(base?.line, ov?.line), polygon: mergeStyle(base?.polygon, ov?.polygon),
           label: mergeStyle(base?.label, ov?.label) };
}

function shapeHasZ(shape: any): boolean {
  if (shape && typeof shape.z === "number" && Number.isFinite(shape.z)) return shape.z !== 0;
  const pts = shape?.points || shape?.coordinates || shape?._points;
  if (Array.isArray(pts)) {
    for (const p of pts) {
      const z = p?.z ?? (Array.isArray(p) ? p[2] : undefined);
      if (typeof z === "number" && Number.isFinite(z) && z !== 0) return true;
    }
  }
  return false;
}

export class GenericFeaturePainter extends FeaturePainter {
  private kind: LayerKind; private layerStyle?: StyleDefinition;
  private featureStyle?: (feature: Feature) => Partial<StyleDefinition> | undefined;
  private debug?: DebugConfig;
  constructor(opts: PainterOptions) { super(); this.kind = opts.kind; this.layerStyle = opts.layerStyle; this.featureStyle = opts.featureStyle; this.debug = opts.debug; }

  override paintBody(geoCanvas: GeoCanvas, feature: Feature, shape: any, layer: any, _map: any, paintState: PaintState): void {
    const selected = !!paintState?.selected;
    const style = resolveStyle(this.layerStyle, this.featureStyle?.(feature));
    const layerAlpha = clamp01(style.opacity, 1);
    if (this.debug?.paintLogs) logPaint(`[Painter:${layer?.label}] draw ${this.kind} id=${(feature as any).id}`);

    if (this.kind === "point") return paintPoint(geoCanvas, feature, shape, style.point, selected, layerAlpha);
    if (this.kind === "polyline") return paintLine(geoCanvas, shape, style.line, selected, layerAlpha);
    return paintPolygonOrVolume(geoCanvas, shape, style.polygon, selected, layerAlpha);
  }
}

function paintLine(geoCanvas: GeoCanvas, shape: any, l?: any, selected?: boolean, layerAlpha?: number) {
  const width = (l?.width ?? 2) + (selected ? 1 : 0);
  const baseColor = l?.color ?? (selected ? "#00D1FF" : "#1976D2");
  const color = withAlpha(baseColor, layerAlpha);

  const lineStyle: LineStyle = { color, width, dash: l?.dash, dashOffset: l?.dashOffset, beginMarker: l?.beginMarker, endMarker: l?.endMarker, uom: l?.uom, bloom: l?.bloom };

  const hasZ = shapeHasZ(shape);
  const shapeStyle: ShapeStyle = {
    stroke: lineStyle,
    drapeTarget: hasZ ? DrapeTarget.NOT_DRAPED : DrapeTarget.TERRAIN
  };
  geoCanvas.drawShape(shape, shapeStyle);
}

function paintPolygonOrVolume(geoCanvas: GeoCanvas, shape: any, pg?: any, selected?: boolean, layerAlpha?: number) {
  const outlineWidth = (pg?.outlineWidth ?? 1) + (selected ? 1 : 0);
  const outline = pg?.outline ?? (selected ? "#00D1FF" : "#263238");
  const fill = pg?.fill ?? (selected ? "rgba(0,209,255,0.25)" : "rgba(255,87,34,0.25)");
  const hasZ = shapeHasZ(shape);

  const shapeStyle: ShapeStyle = {
    stroke: { color: outline, width: outlineWidth, uom: pg?.uom },
    fill:   { color: withAlpha(fill, layerAlpha) },
    drapeTarget: hasZ ? DrapeTarget.NOT_DRAPED : DrapeTarget.TERRAIN
  };
  geoCanvas.drawShape(shape, shapeStyle);
}

function paintPoint(geoCanvas: GeoCanvas, _feature: Feature, shape: any, p: PointDef | undefined, selected: boolean, layerAlpha: number) {
  const symbol = p?.symbol ?? "circle";

  if (symbol === "mesh3d" && p?.mesh3d?.mesh) {
    const icon3DStyle: MeshIcon3DStyle = {
      mesh: p.mesh3d.mesh, color: p.mesh3d.color, zOrder: p.mesh3d.zOrder, rotation: p.mesh3d.rotation,
      orientation: p.mesh3d.orientation, scale: p.mesh3d.scale, translation: p.mesh3d.translation,
      facetCulling: p.mesh3d.facetCulling, pbrSettings: p.mesh3d.pbrSettings ?? null, transparency: p.mesh3d.transparency ?? false
    };
    geoCanvas.drawIcon3D(shape, icon3DStyle);
    return;
  }

  if (symbol === "icon" && p?.image) {
    const hasZ = shapeHasZ(shape);
    const iconStyle: ImageIconStyle = {
      image: p.image,
      width: p.width ?? p.size ?? 20,
      height: p.height ?? p.size ?? 20,
      anchorX: p.anchorX ?? "50%",
      anchorY: p.anchorY ?? "50%",
      offsetX: p.offsetX, offsetY: p.offsetY,
      opacity: p.opacity ?? layerAlpha, rotation: p.rotation, heading: p.heading,
      modulationColor: p.modulationColor, uom: p.uom, bloom: p.bloom,
      drapeTarget: hasZ ? DrapeTarget.NOT_DRAPED : (p.drapeTarget ?? DrapeTarget.TERRAIN),
      occlusionMode: p.occlusionMode, stem: p.stem as any, zOrder: p.zOrder
    };
    geoCanvas.drawIcon(shape as Point, iconStyle);
    return;
  }

  const outlineWidth = p?.outlineWidth ?? (selected ? 2 : 1);
  const outline = p?.outline ?? (selected ? "#00D1FF" : "#000000");
  const fill = withAlpha(p?.fill ?? (selected ? "#3bd4ff" : "#ff5722"), layerAlpha);
  const size = p?.size ?? 12;

  const c = getCircleCanvas(size, fill, outlineWidth ? { color: outline, width: outlineWidth } : undefined);
  const iconStyle: ImageIconStyle = { image: c, width: c.width, height: c.height, anchorX: "50%", anchorY: "50%", drapeTarget: DrapeTarget.TERRAIN };
  geoCanvas.drawIcon(shape as Point, iconStyle);
}

const _circleCache = new Map<string, HTMLCanvasElement>();
function getCircleCanvas(size: number, fillColor: string, stroke?: { color: string; width?: number }) {
  const key = `${size}|${fillColor}|${stroke?.color}|${stroke?.width}`;
  const cached = _circleCache.get(key); if (cached) return cached;
  const r = Math.max(1, size), pad = Math.max(1, stroke?.width ?? 0) + 1, w = (r * 2) + pad * 2;
  const c = document.createElement("canvas"); c.width = w; c.height = w;
  const ctx = c.getContext("2d")!; ctx.translate(w/2, w/2);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.closePath(); ctx.fillStyle = fillColor; ctx.fill();
  if (stroke?.color && (stroke.width ?? 0) > 0) { ctx.lineWidth = stroke.width!; ctx.strokeStyle = stroke.color!; ctx.stroke(); }
  _circleCache.set(key, c); return c;
}
