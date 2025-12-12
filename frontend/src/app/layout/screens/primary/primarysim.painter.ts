import { Feature } from '@luciad/ria/model/feature/Feature.js';
import { Shape } from '@luciad/ria/shape/Shape.js';
import { FeaturePainter, PaintState } from '@luciad/ria/view/feature/FeaturePainter.js';
import { Layer } from '@luciad/ria/view/Layer.js';
import { Map } from '@luciad/ria/view/Map.js';
import { GeoCanvas } from '@luciad/ria/view/style/GeoCanvas.js';
import { LabelCanvas } from '@luciad/ria/view/style/LabelCanvas.js';
import { PointLabelPosition } from '@luciad/ria/view/style/PointLabelPosition.js';
import { PointLabelStyle } from '@luciad/ria/view/style/PointLabelStyle.js';
import { OnPathLabelStyle } from '@luciad/ria/view/style/OnPathLabelStyle.js';
import { PathLabelPosition } from '@luciad/ria/view/style/PathLabelPosition.js';
import { PathLabelRotation } from '@luciad/ria/view/style/PathLabelRotation.js';

import { SimStyleRegistry } from '../../../luciadmaps/components/util/riavisualization/simstyle.registry';

function makeCircleCanvas(px: number, fill: string, stroke: string, strokeWidth: number): HTMLCanvasElement {
  const size = Math.max(2, Math.round(px));
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const r = size / 2;

  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(r, r, Math.max(0, r - strokeWidth / 2), 0, Math.PI * 2);

  ctx.fillStyle = fill;
  ctx.fill();

  if (strokeWidth > 0) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  return c;
}

export class PrimarySimPainter extends FeaturePainter {
  private readonly pointLabelStyle: PointLabelStyle;
  private readonly pathLabelStyle: OnPathLabelStyle;

  constructor(private registry: SimStyleRegistry) {
    super();

    this.pointLabelStyle = {
      positions:
        PointLabelPosition.NORTH_EAST |
        PointLabelPosition.NORTH_WEST |
        PointLabelPosition.SOUTH_EAST |
        PointLabelPosition.SOUTH_WEST,
      offset: 2,
      priority: 0,
    };

    this.pathLabelStyle = {
      positions: PathLabelPosition.ABOVE,
      rotation: PathLabelRotation.FIXED_LINE_ANGLE,
      repeat: { minimumGap: 260, initialGap: 120 },
      priority: 0,
    };
  }

  override paintBody(
    geoCanvas: GeoCanvas,
    feature: Feature,
    shape: Shape,
    _layer: Layer,
    map: Map,
    paintState: PaintState,
  ): void {
    const props: any = (feature as any).properties ?? {};
    const kind: 'sim-aircraft' | 'sim-trail' =
      props.kind === 'sim-trail' ? 'sim-trail' : 'sim-aircraft';

    const resolved = this.registry.getStyle(kind, props, !!paintState.selected);

    if (!resolved.bodyStyle) return;

    if (kind === 'sim-aircraft') {
      // Render as icon (circle) so "size" works
      const st = this.registry.resolveAircraftPoint(String(props.aircraftId ?? ''), props, !!paintState.selected);
      const fill = this.registry.rgba(st.fill, st.fillA) ?? 'rgba(34,197,94,1)';
      const outline = this.registry.rgba(st.outline, st.outlineA) ?? 'rgba(15,23,42,0.9)';
      const outlineW = Number.isFinite(st.outlineWidth) ? st.outlineWidth : 2;
      const sizePx = Math.max(6, Number(st.size ?? 12)) * map.displayScale;

      const icon = makeCircleCanvas(sizePx, fill, outline, outlineW * map.displayScale);

      geoCanvas.drawIcon(shape, {
        image: icon,
        width: `${Math.round(sizePx)}px`,
        height: `${Math.round(sizePx)}px`,
      } as any);
      return;
    }

    // Trail line
    geoCanvas.drawShape(shape, resolved.bodyStyle as any);
  }

  override paintLabel(
    labelCanvas: LabelCanvas,
    feature: Feature,
    shape: Shape,
    _layer: Layer,
    _map: Map,
    paintState: PaintState,
  ): void {
    const props: any = (feature as any).properties ?? {};
    const kind: 'sim-aircraft' | 'sim-trail' =
      props.kind === 'sim-trail' ? 'sim-trail' : 'sim-aircraft';

    const resolved = this.registry.getStyle(kind, props, !!paintState.selected);
    if (!resolved.labelHtml) return;

    if (kind === 'sim-aircraft') {
      this.pointLabelStyle.priority = resolved.labelPriority ?? 0;
      labelCanvas.drawLabel(resolved.labelHtml, shape, this.pointLabelStyle);
      return;
    }

    this.pathLabelStyle.priority = resolved.labelPriority ?? 0;
    labelCanvas.drawLabelOnPath(resolved.labelHtml, shape, this.pathLabelStyle);
  }
}
