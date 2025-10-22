// src/app/luciadmaps/components/util/ShapePainter2D.ts
import { FeaturePainter, PaintState } from "@luciad/ria/view/feature/FeaturePainter.js";
import { GeoCanvas } from "@luciad/ria/view/style/GeoCanvas.js";
import { ShapeType } from "@luciad/ria/shape/ShapeType.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { Point } from "@luciad/ria/shape/Point.js";
import { DrapeTarget } from "@luciad/ria/view/style/DrapeTarget.js";

const circleCache = new Map<string, HTMLCanvasElement>();

function parseRgbToRgba(color: string, alpha: number | undefined): string {
  if (alpha === undefined || alpha === null) return color;
  const m = color.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(",").map(v => Number(String(v).trim()));
    const [r, g, b] = parts;
    const a = Number.isFinite(parts[3]) ? parts[3] : 1;
    const outA = Math.max(0, Math.min(1, alpha * a));
    return `rgba(${r},${g},${b},${outA})`;
  }
  return `rgba(0,0,0,${Math.max(0, Math.min(1, alpha))})`;
}

function getCircleCanvas(size: number, fill?: string, stroke?: { color: string; width: number }): HTMLCanvasElement {
  const key = `${size}|${fill ?? ""}|${stroke?.color ?? ""}|${stroke?.width ?? 0}`;
  const hit = circleCache.get(key);
  if (hit) return hit;

  const d = Math.max(2, Math.floor(size));
  const pad = stroke ? Math.ceil(stroke.width) : 0;
  const s = d + pad * 2;

  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, s, s);

  ctx.beginPath();
  ctx.arc(s / 2, s / 2, d / 2, 0, Math.PI * 2);

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = stroke.width;
    ctx.strokeStyle = stroke.color;
    ctx.stroke();
  }

  circleCache.set(key, c);
  return c;
}

export class ShapePainter2D extends FeaturePainter {
  override paintBody(
    geoCanvas: GeoCanvas,
    feature: Feature,
    shape: any,
    _layer?: any,
    _map?: any,
    paintState?: PaintState
  ): void {
    const p: any = feature.properties ?? {};

    const defaultColor = "rgba(0,102,255,1)"; // blue
    const selectedColor = "rgba(255,0,0,1)";  // red

    const baseColor = (p.color as string) ?? defaultColor;
    const selColor  = (p.selectedColor as string) ?? selectedColor;
    const current = paintState?.selected ? selColor : baseColor;

    switch (shape.type) {
      case ShapeType.POINT: {
        const size = p.size ?? 10;
        const fillColor = parseRgbToRgba(current, p.opacity ?? 1);
        const stroke = p.outlineColor
          ? { color: p.outlineColor as string, width: p.outlineWidth ?? 1 }
          : undefined;

        const canvas = getCircleCanvas(size, fillColor, stroke);
        geoCanvas.drawIcon(shape as Point, {
          image: canvas,
          width: `${canvas.width}px`,
          height: `${canvas.height}px`,
          anchorX: "50%",
          anchorY: "50%"
        });
        break;
      }

      case ShapeType.POLYLINE: {
        const lineColor = parseRgbToRgba(current, p.opacity ?? 1);
        geoCanvas.drawShape(shape, {
          stroke: { color: lineColor, width: p.width ?? 2 },
          drapeTarget: p.drapeTarget as DrapeTarget | undefined
        });
        break;
      }

      case ShapeType.POLYGON: {
        const fillColor = parseRgbToRgba(current, p.fillOpacity ?? 0.35);
        const strokeColor = p.outlineColor ?? current;
        geoCanvas.drawShape(shape, {
          fill: { color: fillColor },
          stroke: (p.outlineColor || p.outlineWidth)
            ? { color: strokeColor, width: p.outlineWidth ?? 1 }
            : undefined
        });
        break;
      }
    }
  }
}
