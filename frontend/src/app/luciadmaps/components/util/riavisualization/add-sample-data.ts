import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import { RiaVizFacade } from "./index";
import {
  boundsFromLonLatRect, debugLogRoundtrip, makeCircleCanvas,
  setWrapNormalization, setWgsSource
} from "./riaviz.utils";
import type { DebugConfig } from "./riaviz.types";

/** Adds Ahmedabad sample in shared layers by label (2D + 3D). */
export async function addSampleData(
  map: WebGLMap,
  debug: DebugConfig = { enabled: true, storeLogs: true, paintLogs: false, outlineNew: true, fitAfterAdd: true }
) {
  setWrapNormalization((map as any).wrapAroundWorld ?? false);
  // We pass lon,lat everywhere → force source CRS with lon,lat axis order.
  setWgsSource("CRS:84");

  const viz = new RiaVizFacade(map);
  debugLogRoundtrip(map.reference, 72.5714, 23.0225, "Ahmedabad");

  /* ---------- Points (2D) ---------- */
  let lyr = viz.getOrCreateLayer({
    label: "Point",
    kind: "point",
    style: { point: { symbol: "circle", size: 14, fill: "#0078ff", outline: "#ffffff", outlineWidth: 2 }, opacity: 1 }
  }, debug);
  viz.setActiveLayer(lyr.id);
  viz.addPoint(72.5714, 23.0225, { name: "City Center" });
  viz.addPoint(72.5808, 23.0614, { name: "Sabarmati Ashram" },
    { point: { size: 18, fill: "#ff3d00", outline: "#000", outlineWidth: 3 } });
  viz.addPoint(72.5118, 23.0802, { name: "Science City" },
    { point: { size: 12, fill: "#f55a01ff", outline: "#fff", outlineWidth: 2 } });

  /* ---------- Lines (2D) ---------- */
  lyr = viz.getOrCreateLayer({
    label: "Line",
    kind: "polyline",
    style: { line: { color: "rgba(255, 255, 255, 1)", width: 18 } }
  }, debug);
  viz.setActiveLayer(lyr.id);
  viz.addPolyline([[72.55, 23.03],[72.56, 23.04],[72.57, 23.045],[72.58, 23.05],[72.59, 23.055]]);
  viz.updateLayerStyle(lyr.id, { line: { color: "rgba(0,180,255,1)", width: 12 } } as any);
  viz.addPolyline([[72.55, 23.00],[72.57, 23.02],[72.59, 23.04],[72.61, 23.06]]);

  /* ---------- Polygons (2D) ---------- */
  lyr = viz.getOrCreateLayer({
    label: "Polygon",
    kind: "polygon",
    style: { polygon: { fill: "rgba(0,200,120,0.30)", outline: "#009688", outlineWidth: 2 }, opacity: 0.95 }
  }, debug);
  viz.setActiveLayer(lyr.id);
  viz.addPolygon([[72.56,23.02],[72.58,23.02],[72.58,23.04],[72.56,23.04],[72.56,23.02]], { name: "Central AOI" });
  viz.addPolygon(
    [[72.52,23.015],[72.535,23.015],[72.535,23.03],[72.52,23.03],[72.52,23.015]],
    { name: "Blue AOI" },
    { polygon: { fill: "rgba(80,120,255,0.25)", outline: "#3355cc", outlineWidth: 1 }, opacity: 0.9 }
  );

  /* ---------- 3D Objects (EPSG:4979) ---------- */
  lyr = viz.getOrCreateLayer({
    label: "3D",
    kind: "point",
    reference: "EPSG:4979",
    style: { point: { symbol: "circle", size: 8, fill: "#90caf9" } }
  }, debug);
  viz.setActiveLayer(lyr.id);
  viz.addMeshIcon(74.565, 24.03, {
    shape: "ellipsoid", color: "rgba(80,160,255,0.9)",
    params: { radiusX: 60000, radiusY: 60000, radiusZ: 60000, verticalSlices: 12, horizontalSlices: 12 },
    scale: 1, transparency: true
  }, { name: "3D Ellipsoid" }, undefined, 3000);
  viz.addMeshIcon(72.985, 23.94, {
    shape: "ellipsoidalDome", color: "rgba(255,80,80,0.85)",
    params: { radiusX: 80000, radiusY: 80000, radiusZ: 50000, verticalSlices: 12, horizontalSlices: 12 },
    scale: 1, transparency: true
  }, { name: "3D Dome" }, undefined, 2000);
  viz.addMeshIcon(73.59, 22.03, {
    shape: "cone", color: "rgba(0, 255, 0, 0.9)", params: { radius: 40000, height: 80000, slices: 6 }, scale: 1, transparency: true
  }, { name: "3D Cone" }, undefined, 1500);
  viz.addMeshIcon(72.555, 23.115, {
    shape: "cylinder", color: "rgba(255, 193, 7, 0.9)", params: { radius: 35000, height: 140000, slices: 6 }, scale: 1, transparency: true
  }, { name: "3D Cylinder" }, undefined, 1800);

  /* ---------- 3D Lines (EPSG:4979) ---------- */
  lyr = viz.getOrCreateLayer({
    label: "3D Lines",
    kind: "polyline",
    reference: "EPSG:4979",
    style: { line: { color: "rgba(11, 65, 240, 1)", bloom: "10" , width: 1 } }
  }, debug);
  viz.setActiveLayer(lyr.id);
  viz.addLine3D([
    [72.56, 23.02, 10000],
    [71.58, 33.03, 20000],
    [82.60, 23.04, 15000]
  ], { name: "3D Flight Path" });

  /* ---------- 3D Icon (canvas) ---------- */
  const dot = makeCircleCanvas(8, "#e91e63", { color: "#fff", width: 2 });
  const threeD = viz.getOrCreateLayer({ label: "3D", kind: "point", reference: "EPSG:4979" }, debug);
  viz.setActiveLayer(threeD.id);
  viz.addPoint3D(73.565, 23.03, 1200, { name: "3D Icon" }, { point: { symbol: "icon", image: dot, width: 18, height: 18 } });

//   if (debug?.fitAfterAdd) {
//     const b = boundsFromLonLatRect(map.reference, , 0, 77.64, 32.09);
//     await map.mapNavigator.fit({ bounds: b, animate: true });
//   }

  console.info("[RiaViz] ✅ Ahmedabad sample added (single shared layers)");
  return viz;
}
