import type { ShapeStyle } from '@luciad/ria/view/style/ShapeStyle.js';

export type SimFeatureKind = 'sim-aircraft' | 'sim-trail';

export interface SimUiSnapshot {
  aircraftPoint: any;
  trailLine: any;
  aircraftLabel: any;
  trailLabel: any;
  aircraftOverrides: Record<string, { point?: any; line?: any }>;
}

export class SimStyleRegistry {
  private defaults = {
    aircraftPoint: {
      size: 12,
      fill: '#22c55e',
      fillA: 1,
      outline: '#0f172a',
      outlineA: 1,
      outlineWidth: 2,
    },
    trailLine: {
      color: '#38bdf8',
      colorA: 0.9,
      width: 2,
      dash: '',
    },
    aircraftLabel: {
      cssClass: 'sim-aircraft-label',
      priority: -1,
      showName: true,
      showAltitude: true,
      showSpeed: false,
      showHeading: false,
    },
    trailLabel: {
      cssClass: 'sim-trail-label',
      priority: 0,
      showName: true,
      showPointCount: false,
    },
  };

  private aircraftOverrides: Record<string, { point?: any; line?: any }> = {};

  resetAll(): void {
    this.defaults = {
      aircraftPoint: {
        size: 12,
        fill: '#22c55e',
        fillA: 1,
        outline: '#0f172a',
        outlineA: 1,
        outlineWidth: 2,
      },
      trailLine: {
        color: '#38bdf8',
        colorA: 0.9,
        width: 2,
        dash: '',
      },
      aircraftLabel: {
        cssClass: 'sim-aircraft-label',
        priority: -1,
        showName: true,
        showAltitude: true,
        showSpeed: false,
        showHeading: false,
      },
      trailLabel: {
        cssClass: 'sim-trail-label',
        priority: 0,
        showName: true,
        showPointCount: false,
      },
    };
    this.aircraftOverrides = {};
  }

  getUiSnapshot(): SimUiSnapshot {
    return JSON.parse(JSON.stringify({
      aircraftPoint: this.defaults.aircraftPoint,
      trailLine: this.defaults.trailLine,
      aircraftLabel: this.defaults.aircraftLabel,
      trailLabel: this.defaults.trailLabel,
      aircraftOverrides: this.aircraftOverrides,
    }));
  }

  exportScenarioSnapshot(): SimUiSnapshot {
    return this.getUiSnapshot();
  }

  importScenarioSnapshot(snap: SimUiSnapshot): void {
    if (!snap) return;
    if (snap.aircraftPoint) this.defaults.aircraftPoint = { ...this.defaults.aircraftPoint, ...snap.aircraftPoint };
    if (snap.trailLine) this.defaults.trailLine = { ...this.defaults.trailLine, ...snap.trailLine };
    if (snap.aircraftLabel) this.defaults.aircraftLabel = { ...this.defaults.aircraftLabel, ...snap.aircraftLabel };
    if (snap.trailLabel) this.defaults.trailLabel = { ...this.defaults.trailLabel, ...snap.trailLabel };
    if (snap.aircraftOverrides && typeof snap.aircraftOverrides === 'object') {
      this.aircraftOverrides = { ...snap.aircraftOverrides };
    }
  }

  updateDefaultsFromUi(patch: Partial<SimUiSnapshot>): void {
    if (patch.aircraftPoint) this.defaults.aircraftPoint = { ...this.defaults.aircraftPoint, ...patch.aircraftPoint };
    if (patch.trailLine) this.defaults.trailLine = { ...this.defaults.trailLine, ...patch.trailLine };
    if (patch.aircraftLabel) this.defaults.aircraftLabel = { ...this.defaults.aircraftLabel, ...patch.aircraftLabel };
    if (patch.trailLabel) this.defaults.trailLabel = { ...this.defaults.trailLabel, ...patch.trailLabel };
  }

  emptyPointOverride(): any {
    return {
      size: 12,
      fill: '#000000',
      fillA: 1,
      outline: '#000000',
      outlineA: 1,
      outlineWidth: 2,
    };
  }

  emptyLineOverride(): any {
    return {
      color: '#000000',
      colorA: 1,
      width: 2,
      dash: '',
    };
  }

  cleanPointOverride(p: any): any {
    // allow user to keep defaults by leaving values blank: treat "" as undefined
    const out: any = { ...p };
    if (out.fill === '') delete out.fill;
    if (out.outline === '') delete out.outline;
    return out;
  }

  cleanLineOverride(p: any): any {
    const out: any = { ...p };
    if (out.color === '') delete out.color;
    if (out.dash === '') delete out.dash;
    return out;
  }

  setAircraftOverride(aircraftId: string, overrides: { point?: any; line?: any }): void {
    const cur = this.aircraftOverrides[aircraftId] ?? {};
    this.aircraftOverrides[aircraftId] = {
      ...cur,
      ...overrides,
      point: { ...(cur.point ?? {}), ...(overrides.point ?? {}) },
      line: { ...(cur.line ?? {}), ...(overrides.line ?? {}) },
    };
  }

  clearAircraftOverride(aircraftId: string): void {
    delete this.aircraftOverrides[aircraftId];
  }

  private parseDash(s: any): number[] | undefined {
    if (!s) return undefined;
    if (Array.isArray(s)) return s.filter(Number.isFinite);
    if (typeof s !== 'string') return undefined;
    const arr = s.split(',').map(v => +v.trim()).filter(Number.isFinite);
    return arr.length ? arr : undefined;
  }

  rgba(color: string | undefined, alpha: number | undefined): string | undefined {
    if (!color) return undefined;
    const a = (alpha == null || !Number.isFinite(alpha)) ? undefined : Math.max(0, Math.min(1, alpha));
    const m = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if (m) {
      const r = +m[1], g = +m[2], b = +m[3];
      const aa = a ?? (m[4] ? +m[4] : 1);
      return `rgba(${r},${g},${b},${aa})`;
    }
    const hex = color.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const aa = a ?? 1;
      return `rgba(${r},${g},${b},${aa})`;
    }
    return color;
  }

  resolveAircraftPoint(aircraftId: string, _props: any, selected: boolean): any {
    const base = { ...this.defaults.aircraftPoint };
    const ov = this.aircraftOverrides[aircraftId]?.point ?? {};
    const merged = { ...base, ...ov };
    if (selected) merged.outlineWidth = (merged.outlineWidth ?? 2) + 1;
    return merged;
  }

  resolveTrailLine(aircraftId: string, _props: any, selected: boolean): any {
    const base = { ...this.defaults.trailLine };
    const ov = this.aircraftOverrides[aircraftId]?.line ?? {};
    const merged = { ...base, ...ov };
    if (selected) merged.width = (merged.width ?? 2) + 1;
    return merged;
  }

  resolveAircraftLabel(_aircraftId: string, props: any, selected: boolean): { html: string | null; priority: number } {
    const cfg = this.defaults.aircraftLabel;
    const parts: string[] = [];

    if (cfg.showName) parts.push(String(props?.name ?? props?.label ?? props?.aircraftId ?? 'Aircraft'));
    if (cfg.showAltitude && props?.alt_m != null) parts.push(`${Math.round(props.alt_m)} m`);
    if (cfg.showSpeed && props?.speed_mps != null) parts.push(`${Math.round(props.speed_mps)} m/s`);
    if (cfg.showHeading && props?.heading_deg != null) parts.push(`${Math.round(props.heading_deg)}°`);

    const text = parts.join(' | ');
    const html = text ? `<div class="${cfg.cssClass ?? 'sim-aircraft-label'}">${text}</div>` : null;
    const priority = selected ? -Infinity : (cfg.priority ?? 0);

    return { html, priority };
  }

  resolveTrailLabel(_aircraftId: string, props: any, selected: boolean): { html: string | null; priority: number } {
    const cfg = this.defaults.trailLabel;
    const parts: string[] = [];

    if (cfg.showName) parts.push(String(props?.name ?? props?.label ?? 'Trail'));
    if (cfg.showPointCount && props?.pointCount != null) parts.push(`${props.pointCount} pts`);

    const text = parts.join(' | ');
    const html = text ? `<span class="${cfg.cssClass ?? 'sim-trail-label'}">${text}</span>` : null;
    const priority = selected ? -Infinity : (cfg.priority ?? 0);

    return { html, priority };
  }

  getStyle(
    kind: SimFeatureKind,
    props: any,
    selected: boolean,
  ): { bodyStyle: ShapeStyle | null; labelHtml: string | null; labelPriority: number | undefined } {
    const aircraftId = String(props?.aircraftId ?? '');

    if (kind === 'sim-aircraft') {
      const st = this.resolveAircraftPoint(aircraftId, props, selected);
      const fill = this.rgba(st.fill, st.fillA) ?? 'rgba(34,197,94,1)';
      const outline = this.rgba(st.outline, st.outlineA) ?? 'rgba(15,23,42,0.9)';
      const w = Number.isFinite(st.outlineWidth) ? st.outlineWidth : 2;

      const bodyStyle: ShapeStyle = {
        fill: { color: fill },
        stroke: { color: outline, width: w },
      };

      const label = this.resolveAircraftLabel(aircraftId, props, selected);
      return { bodyStyle, labelHtml: label.html, labelPriority: label.priority };
    }

    const st = this.resolveTrailLine(aircraftId, props, selected);
    const color = this.rgba(st.color, st.colorA) ?? 'rgba(56,189,248,0.9)';
    const width = Number.isFinite(st.width) ? st.width : 2;

    const dash = this.parseDash(st.dash);

    const bodyStyle: ShapeStyle = {
      stroke: {
        color,
        width,
        dashPattern: dash as any,
      } as any,
    };

    const label = this.resolveTrailLabel(aircraftId, props, selected);
    return { bodyStyle, labelHtml: label.html, labelPriority: label.priority };
  }
}
