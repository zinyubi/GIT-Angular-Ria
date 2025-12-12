// src/app/luciadmaps/components/util/riavisualization/sim-labels.painter.ts
import { Feature } from '@luciad/ria/model/feature/Feature.js';
import { Shape } from '@luciad/ria/shape/Shape.js';
import {
  FeaturePainter,
  PaintState,
} from '@luciad/ria/view/feature/FeaturePainter.js';
import { Layer } from '@luciad/ria/view/Layer.js';
import { Map } from '@luciad/ria/view/Map.js';
import { GeoCanvas } from '@luciad/ria/view/style/GeoCanvas.js';
import { LabelCanvas } from '@luciad/ria/view/style/LabelCanvas.js';

import { ShapeStyle } from '@luciad/ria/view/style/ShapeStyle.js';
import { PointLabelStyle } from '@luciad/ria/view/style/PointLabelStyle.js';
import { PointLabelPosition } from '@luciad/ria/view/style/PointLabelPosition.js';
import { OnPathLabelStyle } from '@luciad/ria/view/style/OnPathLabelStyle.js';
import { PathLabelPosition } from '@luciad/ria/view/style/PathLabelPosition.js';
import { PathLabelRotation } from '@luciad/ria/view/style/PathLabelRotation.js';

/**
 * Painter for simulation layers:
 *  - Bodies: aircraft points + trail lines
 *  - Labels: aircraft name near point, name along line
 *
 * Expects feature.properties like:
 *   kind: 'sim-aircraft' | 'sim-trail'
 *   label / name / callsign / aircraftId for the label text.
 */
export class SimLabelsPainter extends FeaturePainter {
  private readonly pointStyle: ShapeStyle;
  private readonly pointSelectedStyle: ShapeStyle;
  private readonly lineStyle: ShapeStyle;
  private readonly lineSelectedStyle: ShapeStyle;

  private readonly pointLabelStyle: PointLabelStyle;
  private readonly pathLabelStyle: OnPathLabelStyle;

  constructor() {
    super();

    // Point body styles (aircraft icons)
    this.pointStyle = {
      stroke: {
        color: 'rgba(15, 23, 42, 0.9)',
        width: 2,
      },
      fill: {
        color: 'rgba(34, 197, 94, 1)', // green
      },
    };

    this.pointSelectedStyle = {
      stroke: {
        color: 'rgba(251, 113, 133, 1)', // rose
        width: 3,
      },
      fill: {
        color: 'rgba(34, 197, 94, 1)',
      },
    };

    // Trail body styles (lines)
    this.lineStyle = {
      stroke: {
        color: 'rgba(56, 189, 248, 0.9)', // cyan
        width: 2,
      },
    };

    this.lineSelectedStyle = {
      stroke: {
        color: 'rgba(251, 191, 36, 0.9)', // amber
        width: 3,
      },
    };

    // Point labels (aircraft names)
    this.pointLabelStyle = {
      positions:
        PointLabelPosition.NORTH_EAST |
        PointLabelPosition.NORTH_WEST |
        PointLabelPosition.SOUTH_EAST |
        PointLabelPosition.SOUTH_WEST,
      offset: 4,
    };

    // On-path labels (trail names)
    const minimumGap = 400;
    const initialGap = minimumGap / 2;
    this.pathLabelStyle = {
      positions: PathLabelPosition.ABOVE,
      rotation: PathLabelRotation.FIXED_LINE_ANGLE,
      repeat: {
        minimumGap,
        initialGap,
      },
    };
  }

  override getDetailLevelScales(): number[] {
    // Keep labels visible pretty much always; tweak if needed
    return [1 / 40000000];
  }

  // ───────────────────────── bodies ─────────────────────────

  override paintBody(
    geoCanvas: GeoCanvas,
    feature: Feature,
    shape: Shape,
    layer: Layer,
    map: Map,
    paintState: PaintState,
  ): void {
    const kind = (feature.properties as any)?.kind;
    if (!kind) return;

    if (kind === 'sim-aircraft') {
      geoCanvas.drawShape(
        shape,
        paintState.selected ? this.pointSelectedStyle : this.pointStyle,
      );
    } else if (kind === 'sim-trail') {
      geoCanvas.drawShape(
        shape,
        paintState.selected ? this.lineSelectedStyle : this.lineStyle,
      );
    }
  }

  // ───────────────────────── labels ─────────────────────────

  override paintLabel(
    labelCanvas: LabelCanvas,
    feature: Feature,
    shape: Shape,
    layer: Layer,
    map: Map,
    paintState: PaintState,
  ): void {
    const props: any = feature.properties || {};
    const kind = props.kind;
    const name: string =
      props.label || props.name || props.callsign || props.aircraftId || '';

    if (!kind || !name) return;

    if (kind === 'sim-aircraft') {
      // Selected aircraft labels = highest priority
      this.pointLabelStyle.priority = paintState.selected ? -Infinity : -1;

      const labelHtml = `<div class="sim-aircraft-label">${name}</div>`;
      labelCanvas.drawLabel(labelHtml, shape, this.pointLabelStyle);
    } else if (kind === 'sim-trail') {
      const labelHtml = `<span class="sim-trail-label">${name}</span>`;
      labelCanvas.drawLabelOnPath(labelHtml, shape, this.pathLabelStyle);
    }
  }
}
