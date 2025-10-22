// Adjust this import if your FeatureSpec type lives elsewhere
import type { FeatureSpec } from "../util/Visualizer/types";

export interface TempObjectConfig {
  visualizerOptions?: Record<string, unknown>;
  layers?: {
    layer2D?: { label?: string; selectable?: boolean; editable?: boolean; hoverable?: boolean };
    layer3D?: { label?: string; selectable?: boolean; editable?: boolean; hoverable?: boolean };
  };
  gizmo?: { handleSizeMeters?: number; snapMeters?: number };
  objects: FeatureSpec[];
}

export const TEMP_OBJECT_CONFIG: TempObjectConfig = {
  visualizerOptions: {},

  layers: {
    layer2D: { label: "2D Features", selectable: true, editable: true, hoverable: true },
    layer3D: { label: "3D Objects",  selectable: true, editable: true, hoverable: true }
  },

  gizmo: { handleSizeMeters: 80, snapMeters: 1 },

  // ---- demo objects you had in the component ----
  objects: [
    {
      type: "ellipsoid",
      lon: 77.5900, lat: 12.9720, alt: 30000,
      params: { radiusX: 15000, radiusY: 15000, radiusZ: 15000, verticalSlices: 48, horizontalSlices: 32 },
      color: "rgba(80,160,255,0.35)",
      lightIntensity: 1.1
    },
    {
      type: "ellipsoidalDome",
      lon: 77.6000, lat: 12.9750, alt: 50000,
      params: { radiusX: 25000, radiusY: 25000, radiusZ: 12000, verticalSlices: 48, horizontalSlices: 24 },
      color: "rgba(255,80,80,0.45)",
      lightIntensity: 1.2
    },
    {
      type: "cone",
      lon: 77.61, lat: 12.98, alt: 12000,
      params: { radius: 6000, height: 20000, slices: 64 },
      color: "rgba(201,253,201,0.35)"
    },
    {
      type: "point",
      lon: 77.59, lat: 12.965, alt: 0,
      color: "rgba(0,150,255,1)",
      size: 12, outlineColor: "white", outlineWidth: 2
    },
    { type: "point", lon: 77.60, lat: 12.972, alt: 0, color: "rgba(39,114,32,1)" },
    {
      type: "line",
      positions: [77.585,12.968, 77.595,12.972, 77.605,12.976, 77.615,12.980],
      color: "rgba(255,215,0,1)", width: 3, opacity: 0.9
    },
    {
      type: "line3D",
      positions: [77.59,12.965,2000, 77.61,12.975,2000, 77.63,12.985,2000],
      color: "rgba(18,51,235,0.97)", width: 6
    },
    {
      type: "polygon",
      positions: [77.588,12.968, 77.610,12.968, 77.610,12.982, 77.588,12.982],
      color: "rgba(0,200,120,1)", fillOpacity: 0.35, outlineColor: "#00A070", outlineWidth: 2
    },
    {
      type: "polygon",
      positions: [77.585,12.965, 77.615,12.965, 77.615,12.985, 77.585,12.985],
      color: "rgba(80,120,255,1)", fillOpacity: 0.18, outlineColor: "rgba(80,120,255,0.8)", outlineWidth: 1
    },
    {
      type: "polygon",
      positions: [78.585,12.965,2000, 78.615,12.965,2000, 78.615,12.985,2000, 78.585,12.985,2000],
      color: "rgba(80,255,80,1)", fillOpacity: 0.18, outlineColor: "rgba(218,231,32,0.8)", outlineWidth: 1
    },
    { type: "point3D", lon: 77.60, lat: 12.972, alt: 2000, color: "rgba(255,83,30,1)", sizeMeters: 20 },
    {
      type: "point3D", mode: "billboard", lon: 77.60, lat: 12.972, alt: 3000,
      billboardDiameterMeters: 12000, color: "rgba(0,180,255,0.9)", outlineColor: "white", outlineWidth: 2, opacity: 1
    },
    {
      type: "line",
      positions: [77.58,12.97,2000, 77.60,12.98,4000, 77.62,12.99,3000],
      color: "rgba(71,214,14,0.95)", width: 4
    }
  ]
};
