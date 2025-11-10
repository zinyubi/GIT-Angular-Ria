import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import type { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import type { Feature } from "@luciad/ria/model/feature/Feature.js";

type Kind = "point" | "polyline" | "polygon";
type MeshMode = "none" | "mesh3d";
type MeshShape = "ellipsoid" | "ellipsoidalDome" | "cone" | "cylinder";

interface SelectedCtx {
  feature: Feature;
  featureId: string;
  layerId: string;
  layerLabel: string;
  kind: Kind;
  meshMode: MeshMode;
}

@Component({
  standalone: true,
  selector: "ria-style-editor",
  imports: [CommonModule, FormsModule],
  templateUrl: "./style-editor.component.html",
  styleUrls: ["./style-editor.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiaStyleEditorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) map!: WebGLMap;
  @Input({ required: true }) viz!: any;

  private _collapsed = false;
  @Input() set collapsed(v: boolean) { this._collapsed = !!v; }
  get collapsed() { return this._collapsed; }
  @Output() collapsedChange = new EventEmitter<boolean>();
  toggleCollapsed() { this._collapsed = !this._collapsed; this.collapsedChange.emit(this._collapsed); }

  sel = signal<SelectedCtx | null>(null);

  // —— 2D styles ——
  point   = { size: 14, fill: "#0078ff", fillA: 1, outline: "#ffffff", outlineA: 1, outlineWidth: 2, opacity: 1 };
  line    = { color: "#00b4ff", colorA: 1, width: 4, dash: "" };
  polygon = { fill: "#00c878", fillA: 0.3, outline: "#009688", outlineA: 1, outlineWidth: 2, opacity: 0.9 };

  // —— 3D mesh UI model ——
  mesh = {
    color: "#4db6ff",
    alpha: 1,
    transparency: true,
    lightIntensity: 1.0,
    shape: "ellipsoid" as MeshShape,

    // scale (uniform + per-axis)
    scale: 1,
    scaleX: 1, scaleY: 1, scaleZ: 1,

    // transforms
    rotationX: 0, rotationY: 0, rotationZ: 0,   // degrees
    transX: 0, transY: 0, transZ: 0,            // meters

    // shape params
    params: {
      radiusX: 60000, radiusY: 60000, radiusZ: 60000,
      verticalSlices: 12, horizontalSlices: 12,
      radius: 40000, height: 80000, slices: 12
    } as Record<string, any>
  };

  private offSel: { remove(): void } | null = null;

  ngOnInit() {
    // Listen to Luciad selection
    this.offSel = (this.map as any).on?.("SelectionChanged", (ev: any) => {
      const feat = ev?.selectionChanges?.[0]?.selected?.[0] as Feature | undefined;
      if (!feat) { this.sel.set(null); return; }
      const fid = (feat as any).id as string | undefined;
      if (fid && fid.startsWith("dbg-")) { this.sel.set(null); return; }

      const owner = this.viz?.lookupOwnerByFeature?.(feat);
      if (!owner) { this.sel.set(null); return; }

      const meshMode = this.detectMeshMode(feat);
      const ctx: SelectedCtx = {
        feature: feat,
        featureId: fid ?? (feat as any).properties?.id ?? "id",
        layerId: owner.layerId,
        layerLabel: owner.label,
        kind: owner.kind,
        meshMode
      };
      this.sel.set(ctx);
      this.populateFromFeature(ctx);
    });
  }

  ngOnDestroy() { this.offSel?.remove?.(); this.offSel = null; }

  // —— Apply ——
  applyFeature() {
    const s = this.sel(); if (!s) return;
    const patch = (s.kind === "point" && s.meshMode === "mesh3d") ? this.meshPatch() : this.stylePatch(s.kind);
    this.viz.updateFeatureStyle(s.layerId, s.featureId, patch);
  }
  applyLayer() {
    const s = this.sel(); if (!s) return;
    const patch = (s.kind === "point" && s.meshMode === "mesh3d") ? this.meshPatch() : this.stylePatch(s.kind);
    this.viz.updateLayerStyleByLabel(s.layerLabel, s.kind, patch);
  }

  // —— Populate ——
  private detectMeshMode(feat: Feature): MeshMode {
    const st = (feat as any).properties?.__style;
    const symbol = st?.point?.symbol || st?.symbol;
    return symbol === "mesh3d" ? "mesh3d" : "none";
  }

  private populateFromFeature(ctx: SelectedCtx) {
    const st = (ctx.feature as any).properties?.__style ?? {};

    if (ctx.kind === "point" && ctx.meshMode === "mesh3d") {
      const m = st.point?.mesh3d || st.mesh3d || {};

      // color/opacity
      const parsed = this.parseColor(m.color ?? this.mesh.color);
      this.mesh.color = parsed.hex; this.mesh.alpha = parsed.a ?? 1;

      // switches
      this.mesh.transparency = !!m.transparency;
      this.mesh.lightIntensity = m.pbrSettings?.lightIntensity ?? 1.0;

      // shape + params
      this.mesh.shape = (m.shape ?? "ellipsoid") as MeshShape;
      Object.assign(this.mesh.params, m.params ?? {});

      // scale
      if (typeof m.scale === "number") {
        this.mesh.scale = m.scale;
        this.mesh.scaleX = this.mesh.scaleY = this.mesh.scaleZ = m.scale;
      } else if (m.scale && typeof m.scale === "object") {
        this.mesh.scaleX = Number(m.scale.x ?? 1);
        this.mesh.scaleY = Number(m.scale.y ?? 1);
        this.mesh.scaleZ = Number(m.scale.z ?? 1);
        this.mesh.scale = (+this.mesh.scaleX + +this.mesh.scaleY + +this.mesh.scaleZ) / 3;
      } else {
        this.mesh.scale = 1;
        this.mesh.scaleX = this.mesh.scaleY = this.mesh.scaleZ = 1;
      }

      // transforms
      this.mesh.rotationX = Number(m.rotation?.x ?? 0);
      this.mesh.rotationY = Number(m.rotation?.y ?? 0);
      this.mesh.rotationZ = Number(m.rotation?.z ?? 0);
      this.mesh.transX    = Number(m.translation?.x ?? 0);
      this.mesh.transY    = Number(m.translation?.y ?? 0);
      this.mesh.transZ    = Number(m.translation?.z ?? 0);
      return;
    }

    // 2D styles
    if (ctx.kind === "point") {
      const s = st.point || st;
      if (s) {
        const pf = this.parseColor(s.fill ?? this.point.fill);
        const po = this.parseColor(s.outline ?? this.point.outline);
        this.point.fill = pf.hex; this.point.fillA = pf.a ?? 1;
        this.point.outline = po.hex; this.point.outlineA = po.a ?? 1;
        this.point.size = s.size ?? 14;
        this.point.outlineWidth = s.outlineWidth ?? 2;
        this.point.opacity = st.opacity ?? 1;
      }
    }
    if (ctx.kind === "polyline") {
      const s = st.line || st;
      if (s) {
        const c = this.parseColor(s.color ?? this.line.color);
        this.line.color = c.hex; this.line.colorA = c.a ?? 1;
        this.line.width = s.width ?? 4;
        this.line.dash = Array.isArray(s.dash) ? s.dash.join(",") : "";
      }
    }
    if (ctx.kind === "polygon") {
      const s = st.polygon || st;
      if (s) {
        const fc = this.parseColor(s.fill ?? this.polygon.fill);
        const oc = this.parseColor(s.outline ?? this.polygon.outline);
        this.polygon.fill = fc.hex; this.polygon.fillA = fc.a ?? 1;
        this.polygon.outline = oc.hex; this.polygon.outlineA = oc.a ?? 1;
        this.polygon.outlineWidth = s.outlineWidth ?? 2;
        this.polygon.opacity = st.opacity ?? 1;
      }
    }
  }

  // —— Patch builders ——
  private stylePatch(kind: Kind) {
    if (kind === "point") {
      return {
        point: {
          symbol: "circle",
          size: this.point.size,
          fill: this.withAlpha(this.point.fill, this.point.fillA),
          outline: this.withAlpha(this.point.outline, this.point.outlineA),
          outlineWidth: this.point.outlineWidth,
        },
        opacity: this.point.opacity,
      };
    }
    if (kind === "polyline") {
      return {
        line: {
          color: this.withAlpha(this.line.color, this.line.colorA),
          width: this.line.width,
          dash: this.parseDash(this.line.dash),
        }
      };
    }
    return {
      polygon: {
        fill: this.withAlpha(this.polygon.fill, this.polygon.fillA),
        outline: this.withAlpha(this.polygon.outline, this.polygon.outlineA),
        outlineWidth: this.polygon.outlineWidth,
      },
      opacity: this.polygon.opacity,
    };
  }

  private meshPatch() {
    const s = this.mesh.shape;
    const p = this.mesh.params;

    const params =
      s === "ellipsoid" || s === "ellipsoidalDome"
        ? { radiusX: p['radiusX'], radiusY: p['radiusY'], radiusZ: p['radiusZ'], verticalSlices: p['verticalSlices'], horizontalSlices: p['horizontalSlices'] }
        : { radius: p['radius'], height: p['height'], slices: p['slices'] };

    const uniform = this.mesh.scaleX === this.mesh.scaleY &&
                    this.mesh.scaleY === this.mesh.scaleZ &&
                    this.mesh.scaleX === this.mesh.scale;

    const scale = uniform ? this.mesh.scale : { x: this.mesh.scaleX, y: this.mesh.scaleY, z: this.mesh.scaleZ };

    return {
      point: {
        symbol: "mesh3d",
        mesh3d: {
          color: this.withAlpha(this.mesh.color, this.mesh.alpha),
          transparency: !!this.mesh.transparency,
          pbrSettings: { lightIntensity: this.mesh.lightIntensity },
          shape: s,
          params,
          scale,
          rotation: { x: this.mesh.rotationX, y: this.mesh.rotationY, z: this.mesh.rotationZ },
          translation: { x: this.mesh.transX, y: this.mesh.transY, z: this.mesh.transZ }
        }
      }
    };
  }

  // —— UI helpers ——
  private parseDash(s: string): number[] | undefined {
    if (!s) return undefined;
    const arr = s.split(",").map(v => +v.trim()).filter(Number.isFinite);
    return arr.length ? arr : undefined;
  }
  private parseColor(input: string): { hex: string; a: number } {
    if (!input) return { hex: "#000000", a: 1 };
    const m = input.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i);
    if (m) {
      const r = +m[1], g = +m[2], b = +m[3];
      const a = m[4] ? +m[4] : 1;
      return { hex: this.toHex(r, g, b), a };
    }
    const hex = input.startsWith("#") ? input.slice(1) : input;
    if (hex.length === 8) {
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return { hex: "#" + hex.slice(0, 6), a };
    }
    return { hex: input, a: 1 };
  }
  private withAlpha(color: string, a: number) {
    const { hex } = this.parseColor(color);
    const { r, g, b } = this.hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }
  private toHex(r: number, g: number, b: number) {
    const h = (v: number) => Math.round(v).toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
  }
  private hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }

  get selected(): SelectedCtx | null { return this.sel(); }
}
