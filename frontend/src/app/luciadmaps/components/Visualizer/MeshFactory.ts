import type { Mesh } from "@luciad/ria/geometry/mesh/Mesh.js";
import { create3DMesh } from "@luciad/ria/geometry/mesh/MeshFactory.js";
import { Icon3DStyle } from "@luciad/ria/view/style/Icon3DStyle.js";
import { FacetCullingType } from "@luciad/ria/view/style/FacetCullingType.js";
import type { MeshSpec, MeshScale } from "./types.js";

/* ---------- procedural builders ---------- */
function buildEllipsoid(rx=10, ry=10, rz=10, vSlices=24, hSlices=16): Mesh {
  const positions: number[] = [], indices: number[] = [];
  for (let y=0; y<=hSlices; y++) {
    const v = y / hSlices, phi = v * Math.PI;
    for (let x=0; x<=vSlices; x++) {
      const u = x / vSlices, th = u * Math.PI * 2;
      const sx = Math.cos(th) * Math.sin(phi);
      const sy = Math.sin(th) * Math.sin(phi);
      const sz = Math.cos(phi);
      positions.push(sx*rx, sy*ry, sz*rz);
    }
  }
  const row = (yy:number)=> yy*(vSlices+1);
  for (let y=0; y<hSlices; y++) for (let x=0; x<vSlices; x++) {
    const i0=row(y)+x, i1=i0+1, i2=row(y+1)+x, i3=i2+1;
    indices.push(i0,i2,i1, i1,i2,i3);
  }
  return create3DMesh(positions, indices, {});
}
function buildEllipsoidalDome(rx=10, ry=10, rz=10, vSlices=24, hSlices=16): Mesh {
  const positions: number[] = [], indices: number[] = [];
  for (let y=0; y<=hSlices; y++) {
    const v = y / hSlices, phi = v * (Math.PI/2); // upper hemisphere
    for (let x=0; x<=vSlices; x++) {
      const u = x / vSlices, th = u * Math.PI * 2;
      const sx = Math.cos(th) * Math.sin(phi);
      const sy = Math.sin(th) * Math.sin(phi);
      const sz = Math.cos(phi);
      positions.push(sx*rx, sy*ry, sz*rz);
    }
  }
  const row = (yy:number)=> yy*(vSlices+1);
  for (let y=0; y<hSlices; y++) for (let x=0; x<vSlices; x++) {
    const i0=row(y)+x, i1=i0+1, i2=row(y+1)+x, i3=i2+1;
    indices.push(i0,i2,i1, i1,i2,i3);
  }
  return create3DMesh(positions, indices, {});
}
function buildCone(radius=8, height=20, slices=48): Mesh {
  const positions:number[] = [], indices:number[] = [];
  positions.push(0,0,0);      // base center
  positions.push(0,0,height); // tip
  for (let i=0;i<slices;i++){
    const a=(i/slices)*Math.PI*2;
    positions.push(Math.cos(a)*radius, Math.sin(a)*radius, 0);
  }
  for (let i=0;i<slices;i++){
    const b=2+i, n=2+((i+1)%slices);
    indices.push(1,b,n); // sides
    indices.push(0,n,b); // base
  }
  return create3DMesh(positions, indices, {});
}
function buildCylinder(radius=8, height=20, slices=48): Mesh {
  const positions:number[] = [], indices:number[]=[];
  positions.push(0,0,0); // bottom center
  positions.push(0,0,height); // top center
  const b0=positions.length/3;
  for(let i=0;i<slices;i++){ const a=(i/slices)*Math.PI*2; positions.push(Math.cos(a)*radius, Math.sin(a)*radius, 0); }
  const t0=positions.length/3;
  for(let i=0;i<slices;i++){ const a=(i/slices)*Math.PI*2; positions.push(Math.cos(a)*radius, Math.sin(a)*radius, height); }
  for (let i=0;i<slices;i++){
    const b=b0+i, bn=b0+((i+1)%slices), t=t0+i, tn=t0+((i+1)%slices);
    indices.push(b,t,bn, bn,t,tn);
  }
  for (let i=0;i<slices;i++){ const b=b0+i, bn=b0+((i+1)%slices); indices.push(0,bn,b); }
  for (let i=0;i<slices;i++){ const t=t0+i, tn=t0+((i+1)%slices); indices.push(1,t,tn); }
  return create3DMesh(positions, indices, {});
}
function buildArrow(stickR=5, stickL=40, tipR=10, tipL=20, slices=48): Mesh {
  const shaft = buildCylinder(stickR, stickL, slices) as any;
  const tip   = buildCone(tipR, tipL, slices) as any;
  const positions:number[] = [], indices:number[]=[];
  const sPos = shaft.positions ?? shaft._positions ?? [], sIdx = shaft.indices ?? shaft._indices ?? [];
  positions.push(...sPos); indices.push(...sIdx);
  const tPos = tip.positions ?? tip._positions ?? [], tIdx = tip.indices ?? tip._indices ?? [];
  const off = positions.length/3;
  for(let i=0;i*tPos.length;i++){ /* keep ts happy */ }
  for(let i=0;i<tPos.length;i+=3){ positions.push(tPos[i], tPos[i+1], tPos[i+2]+stickL); }
  for(let i=0;i<tIdx.length;i++){ indices.push(tIdx[i]+off); }
  return create3DMesh(positions, indices, {});
}

/* ---------- style builder ---------- */
const toScale = (s?: MeshScale) => (typeof s === "number" ? { x: s, y: s, z: s } : (s ?? { x:1, y:1, z:1 }));

export function buildIcon3DStyle(spec: MeshSpec): Icon3DStyle {
  if (spec.type === "glb") {
    if (!spec.url) throw new Error("GLB mesh requires 'url'");
    return {
      meshUrl: spec.url,
      color: spec.color,
      scale: toScale(spec.scale),
      rotation: spec.rotation,
      translation: spec.translation,
      pbrSettings: { lightIntensity: spec.lightIntensity ?? 1.0 },
      transparency: spec.transparency ?? false,
      // facet culling + legacyAxis are safe defaults
      legacyAxis: false
    };
  }

  let mesh: Mesh;
  const p = spec.params ?? {};
  switch (spec.type) {
    case "ellipsoid":
      mesh = buildEllipsoid(p.radiusX??10, p.radiusY??10, p.radiusZ??10, p.verticalSlices??24, p.horizontalSlices??16);
      break;
    case "ellipsoidalDome":
      mesh = buildEllipsoidalDome(p.radiusX??10, p.radiusY??10, p.radiusZ??10, p.verticalSlices??24, p.horizontalSlices??16);
      break;
    case "cone":
      mesh = buildCone(p.radius??8, p.height??20, p.slices??48);
      break;
    case "cylinder":
      mesh = buildCylinder(p.radius??8, p.height??20, p.slices??48);
      break;
    case "arrow":
      mesh = buildArrow(p.stickRadius??5, p.stickLength??40, p.tipBaseRadius??10, p.tipLength??20, p.slices??48);
      break;
    default:
      throw new Error(`Unsupported mesh type: ${spec.type}`);
  }

  return {
    mesh,
    color: spec.color,
    scale: toScale(spec.scale),
    rotation: spec.rotation,
    translation: spec.translation,
    pbrSettings: { lightIntensity: spec.lightIntensity ?? 1.0 },
    transparency: spec.transparency ?? false,
    legacyAxis: false
  };
}

export function buildSelectedStyle(base: Icon3DStyle, spec: MeshSpec): Icon3DStyle {
  return {
    ...base,
    pbrSettings: { lightIntensity: (spec.lightIntensity ?? 1.0) * 1.25 }
  };
}
