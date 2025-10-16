import type { Icon3DStyle } from "@luciad/ria/view/style/Icon3DStyle.js";

export type MeshType =
  | "glb"
  | "ellipsoid"
  | "ellipsoidalDome"
  | "cone"
  | "cylinder"
  | "arrow";

export type MeshScale = number | { x: number; y: number; z: number };

export interface MeshStyleOverrides {
  color?: string;
  scale?: MeshScale;
  rotation?: { x?: number; y?: number; z?: number };
  translation?: { x?: number; y?: number; z?: number };
  lightIntensity?: number; // pbrSettings.lightIntensity
  transparency?: boolean;
}

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

  // shared across cone/cylinder/arrow
  slices?: number;

  // arrow
  stickRadius?: number;
  stickLength?: number;
  tipBaseRadius?: number;
  tipLength?: number;
}


export interface MeshSpec extends MeshStyleOverrides {
  type: MeshType;
  lon: number;
  lat: number;
  alt?: number;              // meters
  url?: string;              // for GLB only
  params?: MeshParams;       // for procedural shapes
  selectedStyle?: Partial<Icon3DStyle> & MeshStyleOverrides;
  id?: string;
}

export interface VisualizerOptions {
  map: import("@luciad/ria/view/WebGLMap.js").WebGLMap;
  label?: string;
}

export interface VisualizerAPI {
  add(spec: MeshSpec): string;
  update(id: string, partial: Partial<MeshSpec>): boolean;
  remove(id: string): boolean;
  clear(): void;
  getLayer(): import("@luciad/ria/view/feature/FeatureLayer.js").FeatureLayer;
  getModel(): import("@luciad/ria/model/feature/FeatureModel.js").FeatureModel;
}
