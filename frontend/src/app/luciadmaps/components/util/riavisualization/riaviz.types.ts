export type LayerKind = "point" | "polyline" | "polygon";
export type FieldType = "string" | "number" | "boolean" | "date";
export type HexColor = string;

export interface AttributeField { name: string; type: FieldType; nullable?: boolean; default?: any; }
export type AttributeSchema = AttributeField[];

export type PointSymbol = "circle" | "icon" | "mesh3d";

export interface LabelDef {
  text?: string;
  field?: string;
  color?: HexColor;
  haloColor?: HexColor;
  haloWidth?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  placement?: "auto" | "center" | "line" | "above" | "below" | "left" | "right";
  visible?: boolean;
}

export interface LineStyle {
  width?: number;
  color?: HexColor;
  dash?: number[];
  dashOffset?: number;
  beginMarker?: any;
  endMarker?: any;
  uom?: any;
  bloom?: any;
  label?: LabelDef;
}

export type MeshShape = "ellipsoid" | "ellipsoidalDome" | "cone" | "cylinder" | "arrow" | "glb";
export type MeshScale = number | { x?: number; y?: number; z?: number };

export interface MeshSpec {
  shape: MeshShape;
  url?: string;
  params?: Record<string, any>;
  color?: HexColor;
  scale?: MeshScale;
  rotation?: { x?: number; y?: number; z?: number };
  translation?: { x?: number; y?: number; z?: number };
  lightIntensity?: number;
  transparency?: boolean;
}

export interface Mesh3DDef {
  mesh: any;
  color?: HexColor;
  zOrder?: number;
  orientation?: { heading?: number; pitch?: number; roll?: number };
  rotation?: { x?: number; y?: number; z?: number };
  scale?: { x?: number; y?: number; z?: number };
  translation?: { x?: number; y?: number; z?: number };
  facetCulling?: any;
  pbrSettings?: any | null;
  transparency?: boolean;
}

export interface PointStyle {
  symbol?: PointSymbol;

  // vector circle
  size?: number;
  fill?: HexColor;
  outline?: HexColor;
  outlineWidth?: number;

  // raster icon
  image?: HTMLImageElement | HTMLCanvasElement;
  width?: number | string;
  height?: number | string;
  anchorX?: string;
  anchorY?: string;
  offsetX?: number | string;
  offsetY?: number | string;
  opacity?: number;
  rotation?: number;
  heading?: number;
  uom?: any;
  modulationColor?: HexColor;
  bloom?: any;
  drapeTarget?: any;
  occlusionMode?: any;
  stem?: any;
  zOrder?: number;

  // 3D mesh
  mesh3d?: Mesh3DDef;
}

export interface PolygonStyle {
  fill?: HexColor;
  outline?: HexColor;
  outlineWidth?: number;
  uom?: any;
  label?: LabelDef;
}

export interface StyleDefinition {
  point?: PointStyle;
  line?: LineStyle;
  polygon?: PolygonStyle;
  opacity?: number;   // painter multiplies alpha for all substyles
  label?: LabelDef;
}

export interface LayerDefinition {
  id?: string;
  label: string;
  kind: LayerKind;
  reference?: string; // e.g. "EPSG:4979" for 3D layers (with Z)
  schema?: AttributeSchema;
  style?: StyleDefinition;
  visible?: boolean;
  opacity?: number;
}

export interface AddFeatureOptions { attrs?: Record<string, any>; style?: Partial<StyleDefinition>; }
export interface CreatedLayer { id: string; label: string; kind: LayerKind; }
export interface FeatureRef { id: string; layerId: string; }

export interface DebugConfig {
  enabled?: boolean;
  paintLogs?: boolean;
  storeLogs?: boolean;
  fitAfterAdd?: boolean;
  outlineNew?: boolean;
}
