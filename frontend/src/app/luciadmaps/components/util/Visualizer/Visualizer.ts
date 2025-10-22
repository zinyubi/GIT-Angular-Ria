// Visualizer/Visualizer.ts
import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { MemoryStore } from "@luciad/ria/model/store/MemoryStore.js";
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import { createPoint, createPolyline, createPolygon } from "@luciad/ria/shape/ShapeFactory.js";
import { DrapeTarget } from "@luciad/ria/view/style/DrapeTarget.js";

import { MeshPainter3D } from "./MeshPainter3D.js";
import { ShapePainter2D } from "./ShapePainter2D.js";
import { buildIcon3DStyle, buildSelectedStyle } from "./MeshFactory.js";
import type { Mesh } from "@luciad/ria/geometry/mesh/Mesh.js";
import { create3DMesh , } from "@luciad/ria/geometry/mesh/MeshFactory.js";


import type {
  FeatureSpec,
  MeshSpec,
  MeshSpecShort,
  MeshShape,
  PointSpec,
  LineSpec,
  PolygonSpec,
  Point3DSpec,
  Line3DSpec,
  VisualizerOptions
} from "./types.js";

function addOrPut(model: FeatureModel, feature: Feature): string {
  if (typeof (model as any).add === "function") return (model as any).add(feature) as string;
  if (typeof (model as any).put === "function") return (model as any).put(feature) as string;
  const store: any = (model as any).store;
  if (store?.add) return store.add(feature);
  return String(feature.id);
}

function makeCircleCanvas(
  diameterPx: number,
  fill: string,
  outline?: { color: string; widthPx: number }
): HTMLCanvasElement {
  const d = Math.max(2, Math.round(diameterPx));
  const pad = outline ? Math.ceil(outline.widthPx) : 0;
  const s = d + pad * 2;
  const c = document.createElement("canvas");
  c.width = s; c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, s, s);

  ctx.beginPath();
  ctx.arc(s/2, s/2, d/2, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();

  if (outline) {
    ctx.lineWidth = outline.widthPx;
    ctx.strokeStyle = outline.color;
    ctx.stroke();
  }
  return c;
}

function makeUnitQuadMesh(): Mesh {
  // 1x1 square in YZ-plane, centered at origin (X is "normal" axis)
  const half = 0.5;
  const positions = [
    0, -half,  half, // v0
    0,  half, -half, // v1
    0, -half, -half, // v2
    0,  half,  half  // v3
  ];
  const indices = [0,1,2, 0,3,1];
  const texCoords = [
    0,0,  1,1,  0,1,  1,0
  ];
  return create3DMesh(positions, indices, { texCoords });
}

function ensureClosedRingFlat(pos: number[]): number[] {
  if (pos.length < 4) return pos;
  const lngA = pos[0], latA = pos[1];
  const lngB = pos[pos.length - 2], latB = pos[pos.length - 1];
  if (lngA === lngB && latA === latB) return pos;
  return [...pos, lngA, latA];
}

// Luciad's createPolyline / createPolygon (pointCoordinates overload) expects [lon,lat,alt] triples.
type Triple = [number, number, number];
function toTriples(flat: number[], defaultAlt = 0): Triple[] {
  const out: Triple[] = [];
  if (flat.length % 3 === 0) {
    for (let i = 0; i < flat.length; i += 3) {
      out.push([flat[i], flat[i + 1], flat[i + 2]]);
    }
  } else {
    for (let i = 0; i < flat.length; i += 2) {
      out.push([flat[i], flat[i + 1], defaultAlt]);
    }
  }
  return out;
}

const MESH_SHAPES = new Set<MeshShape>([
  "glb",
  "ellipsoid",
  "ellipsoidalDome",
  "cone",
  "cylinder",
  "arrow"
]);
function isMeshShape(x: any): x is MeshShape {
  return typeof x === "string" && MESH_SHAPES.has(x as MeshShape);
}

export class Visualizer {
  private map: WebGLMap;
  private model2D: FeatureModel;
  private model3D: FeatureModel;
  private layer2D: FeatureLayer;
  private layer3D: FeatureLayer;

  constructor(opts: VisualizerOptions) {
    this.map = opts.map;

    // keep models in CRS:84 (lon/lat[/alt]) — works with both 2D and 3D map references
    const ref = getReference("CRS:84");
    this.model2D = new FeatureModel(new MemoryStore({ data: [] }), { reference: ref });
    this.model3D = new FeatureModel(new MemoryStore({ data: [] }), { reference: ref });

    this.layer2D = new FeatureLayer(this.model2D, {
      label: opts.label2D ?? "2D Features",
      painter: new ShapePainter2D(),
      selectable: true,
      editable: true,
      hoverable: true
    });

    this.layer3D = new FeatureLayer(this.model3D, {
      label: opts.label3D ?? "3D Objects",
      painter: new MeshPainter3D(),
      selectable: true,
      editable: true,
      hoverable: true
    });

    this.map.layerTree.addChild(this.layer2D);
    this.map.layerTree.addChild(this.layer3D);
  }

  add(spec: FeatureSpec): string {
    // normalize short-form mesh (e.g. { type:"ellipsoid", ... })
    if (isMeshShape(spec.type)) {
      const normalized: MeshSpec = { ...(spec as MeshSpecShort), type: "mesh", shape: spec.type };
      return this.addMesh(normalized);
    }

    switch (spec.type) {
      case "mesh":    return this.addMesh(spec as MeshSpec);
      case "point":   return this.addPoint(spec as PointSpec);
      case "line":    return this.addLine(spec as LineSpec);
      case "polygon": return this.addPolygon(spec as PolygonSpec);
      case "point3D": return this.addPoint3D(spec as Point3DSpec);
      case "line3D":  return this.addLine3D(spec as Line3DSpec);
    }
  }

  addMany(specs: FeatureSpec[]): string[] { return specs.map((s) => this.add(s)); }

  remove(id: string): boolean {
    const r3 = typeof (this.model3D as any).remove === "function"
      ? (this.model3D as any).remove(id)
      : (this.model3D as any).store?.remove?.(id);
    if (r3) return !!r3;
    const r2 = typeof (this.model2D as any).remove === "function"
      ? (this.model2D as any).remove(id)
      : (this.model2D as any).store?.remove?.(id);
    return !!r2;
  }

  clear(): void {
    const clearModel = (m: FeatureModel) => {
      const store: any = (m as any).store;
      if (store?.query) {
        const cur = store.query();
        const ids: string[] = [];
        for (const f of cur) ids.push(f.id as string);
        ids.forEach((i) => store.remove?.(i));
      }
    };
    clearModel(this.model2D);
    clearModel(this.model3D);
  }

  get2DLayer() { return this.layer2D; }
  get3DLayer() { return this.layer3D; }
  get2DModel() { return this.model2D; }
  get3DModel() { return this.model3D; }

  // ---------- internals ----------

  private addMesh(spec: MeshSpec): string {
    const id = spec.id ?? `mesh-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
    const shape = createPoint(this.model3D.reference, [spec.lon, spec.lat, spec.alt ?? 0]);
    const base = buildIcon3DStyle(spec);
    const sel  = buildSelectedStyle(base, spec);
    const f = new Feature(shape, { meshStyle: base, meshStyleSelected: sel }, id);
    return addOrPut(this.model3D, f);
  }

  private addPoint(spec: PointSpec): string {
    const id = spec.id ?? `pt-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
    const shape = createPoint(this.model2D.reference, [spec.lon, spec.lat]);
    const f = new Feature(shape, { ...spec }, id);
    return addOrPut(this.model2D, f);
  }

  private addLine(spec: LineSpec): string {
    if (!Array.isArray(spec.positions) || spec.positions.length < 4 || spec.positions.length % 2 !== 0) {
      throw new Error("LineSpec.positions must be [lon,lat,lon,lat,...] with length >= 4 and even.");
    }
    const id = spec.id ?? `ln-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
    const triples = toTriples(spec.positions, 0); // z=0
    const shape = createPolyline(this.model2D.reference, triples);
    const f = new Feature(shape, { ...spec }, id);
    return addOrPut(this.model2D, f);
  }

  private addPolygon(spec: PolygonSpec): string {
    if (!Array.isArray(spec.positions) || spec.positions.length < 6 || spec.positions.length % 2 !== 0) {
      throw new Error("PolygonSpec.positions must be [lon,lat,lon,lat,...] with length >= 6 and even.");
    }
    const closedFlat = ensureClosedRingFlat(spec.positions);
    const triples = toTriples(closedFlat, 0); // z=0
    const id = spec.id ?? `pg-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
    const shape = createPolygon(this.model2D.reference, triples);
    const f = new Feature(shape, { ...spec }, id);
    return addOrPut(this.model2D, f);
  }

  // --- 3D POINT: tiny sphere mesh at altitude (integrated via mesh pipeline) ---
// --- 3D POINT: bright, visible sphere at altitude ---
// --- 3D POINT: sphere OR billboard circle at altitude ---
private addPoint3D(spec: Point3DSpec): string {
  const mode = spec.mode ?? "sphere";

  if (mode === "sphere") {
    // your existing bright sphere (kept from previous answer)
    const diameter = Math.max(25, spec.sizeMeters ?? 100);
    const sphere: MeshSpec = {
      type: "mesh",
      shape: "ellipsoid",
      lon: spec.lon,
      lat: spec.lat,
      alt: Math.max(30, spec.alt),
      params: {
        radiusX: diameter / 2,
        radiusY: diameter / 2,
        radiusZ: diameter / 2,
        verticalSlices: 32,
        horizontalSlices: 24
      },
      color: spec.color ?? "rgba(255, 215, 0, 1)",
      lightIntensity: 1.7,
      transparency: false,
      selectedStyle: {
        pbrSettings: { lightIntensity: 2.0 },
        color: "rgba(255,255,0,1)"
      }
    };
    return this.addMesh(sphere);
  }

  // ---- billboard: flat circle on a camera-facing quad (at altitude) ----
  const diameterMeters = Math.max(
    10,
    spec.billboardDiameterMeters ?? spec.sizeMeters ?? 100
  );

  // draw the circle once (texture)
  const alpha = (spec.opacity ?? 1);


  const rgba = (spec.color ?? "rgba(30,200,255,1)").replace(
    /^rgba?\(([^)]+)\)$/i,
    (_m: string, inner: string) => {
      const [r, g, b, a] = inner
        .split(",")
        .map((v: string) => Number(String(v).trim()));
      const outA = Math.max(0, Math.min(1, (Number.isFinite(a) ? a : 1) * alpha));
      return `rgba(${r},${g},${b},${outA})`;
    }
  );


  const outline =
    spec.outlineColor || spec.outlineWidth
      ? { color: spec.outlineColor ?? "white", widthPx: Math.max(1, spec.outlineWidth ?? 1) }
      : undefined;

  const texCanvas = makeCircleCanvas(128, rgba, outline); // 128px texture looks crisp
  const mesh = makeUnitQuadMesh();

  // Build an Icon3DStyle that uses our texture on the quad.
  // NOTE: There’s no built-in “auto billboard” flag; to keep it simple,
  // we orient the quad so it’s visible from most angles (facing +X),
  // and rely on the circle look. If you want perfect camera-facing,
  // we can add a tiny Animation that updates rotation to camera each frame.
  const style = {
    mesh,
    // PBR off-ish: keep it bright/flat
    pbrSettings: { lightIntensity: 1.2 },
    transparency: true,
    legacyAxis: false,
    // scale Y/Z in METERS to the requested diameter; X (thickness) stays 1
    scale: { x: 1, y: diameterMeters, z: diameterMeters },
    // rotate so the quad is roughly vertical
    rotation: { x: 0, y: 0, z: 0 },
    // apply texture
    image: texCanvas
  } as unknown as import("@luciad/ria/view/style/Icon3DStyle.js").Icon3DStyle;

  const id = spec.id ?? `pt3dbb-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
  const shape = createPoint(this.model3D.reference, [spec.lon, spec.lat, Math.max(5, spec.alt)]);
  const selected = { ...style, pbrSettings: { lightIntensity: 1.6 } };

  const f = new Feature(shape, { meshStyle: style, meshStyleSelected: selected }, id);
  return addOrPut(this.model3D, f);
}


  // --- 3D LINE: polyline with altitudes, NOT_DRAPED (rendered in space) ---
  private addLine3D(spec: Line3DSpec): string {
    if (!Array.isArray(spec.positions) || spec.positions.length < 4) {
      throw new Error("Line3DSpec.positions must be flat lon/lat[/alt] with at least two vertices.");
    }
    const id = spec.id ?? `ln3d-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
    const triples = toTriples(spec.positions, spec.defaultAlt ?? 0);
    const shape = createPolyline(this.model2D.reference, triples);
    const f = new Feature(
      shape,
      {
        ...spec,
        drapeTarget: DrapeTarget.NOT_DRAPED  // painter will render in 3D, not draped on terrain
      },
      id
    );
    return addOrPut(this.model2D, f);
  }
}
