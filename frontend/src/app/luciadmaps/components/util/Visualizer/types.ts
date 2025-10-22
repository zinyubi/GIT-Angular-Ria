// Visualizer/types.ts
import type { Icon3DStyle } from "@luciad/ria/view/style/Icon3DStyle.js";

/* -------------------------------
   Base kinds
-------------------------------- */
export type GeometryType = "point" | "line" | "polygon" | "mesh" | "point3D" | "line3D";
export type MeshShape =
  | "glb"
  | "ellipsoid"
  | "ellipsoidalDome"
  | "cone"
  | "cylinder"
  | "arrow";

/**
 * We allow:
 *  - GeometryType ("point" | "line" | "polygon" | "mesh")
 *  - Short mesh shape as type (e.g. "ellipsoid") which we normalize to { type:"mesh", shape:"ellipsoid" }
 */
export interface BaseSpec {
  id?: string;
  type: GeometryType | MeshShape;
  label?: string;
  color?: string;
}

/* -------------------------------
   Mesh params & specs
-------------------------------- */
export type MeshScale = number | { x: number; y: number; z: number };

export interface MeshParams {
  // ellipsoid / dome
  radiusX?: number;
  radiusY?: number;
  radiusZ?: number;
  verticalSlices?: number;
  horizontalSlices?: number;

  // cone / cylinder
  radius?: number;
  height?: number;

  // shared
  slices?: number;

  // arrow
  stickRadius?: number;
  stickLength?: number;
  tipBaseRadius?: number;
  tipLength?: number;
}

/** Long form */
export interface MeshSpec extends BaseSpec {
  type: "mesh";
  shape: MeshShape;
  lon: number;
  lat: number;
  alt?: number;
  url?: string; // GLB
  params?: MeshParams;
  scale?: MeshScale;
  rotation?: { x?: number; y?: number; z?: number };
  translation?: { x?: number; y?: number; z?: number };
  lightIntensity?: number;
  transparency?: boolean;
  selectedStyle?: Partial<Icon3DStyle>;
}

/** Short form: { type: "ellipsoid" | "cone" | ..., ... } */
export interface MeshSpecShort extends BaseSpec {
  type: MeshShape;
  lon: number;
  lat: number;
  alt?: number;
  url?: string;
  params?: MeshParams;
  scale?: MeshScale;
  rotation?: { x?: number; y?: number; z?: number };
  translation?: { x?: number; y?: number; z?: number };
  lightIntensity?: number;
  transparency?: boolean;
  selectedStyle?: Partial<Icon3DStyle>;
}

/* -------------------------------
   2D features
-------------------------------- */
export interface PointSpec extends BaseSpec {
  type: "point";
  lon: number;
  lat: number;
  alt?: number;
  size?: number;
  outlineColor?: string;
  outlineWidth?: number;
  opacity?: number;
}

export interface LineSpec extends BaseSpec {
  type: "line";
  positions: number[];   // flat [lon,lat, lon,lat, ...]
  width?: number;
  opacity?: number;
}

export interface PolygonSpec extends BaseSpec {
  type: "polygon";
  positions: number[];   // flat [lon,lat, ...] (closed automatically)
  outlineColor?: string;
  outlineWidth?: number;
  fillOpacity?: number;
}

/* -------------------------------
   3D point & 3D line (integrated)
-------------------------------- */
export interface Point3DSpec extends BaseSpec {
  type: "point3D";
  lon: number;
  lat: number;
  alt: number;             // meters
  sizeMeters?: number;     // sphere diameter (default 100)
  color?: string;
  /** NEW: render a flat circle instead of a sphere */
  mode?: "sphere" | "billboard";
  /** NEW: for billboard mode, draw circle on a quad of this diameter (meters).
      If omitted, we’ll fallback to sizeMeters or 100. */
  billboardDiameterMeters?: number;
  outlineColor?: string;
  outlineWidth?: number;
  opacity?: number;        // 0..1
}

export interface Line3DSpec extends BaseSpec {
  type: "line3D";
  /**
   * Flat array:
   *  - triples: [lon,lat,alt, lon,lat,alt, ...]  OR
   *  - pairs:   [lon,lat, lon,lat, ...]          (alt defaults via defaultAlt)
   */
  positions: number[];
  defaultAlt?: number;
  width?: number;        // px
}

/* -------------------------------
   Visualizer options & union
-------------------------------- */
export interface VisualizerOptions {
  map: import("@luciad/ria/view/WebGLMap.js").WebGLMap;
  label2D?: string;
  label3D?: string;
}

export type FeatureSpec =
  | MeshSpec
  | MeshSpecShort
  | PointSpec
  | LineSpec
  | PolygonSpec
  | Point3DSpec
  | Line3DSpec;
