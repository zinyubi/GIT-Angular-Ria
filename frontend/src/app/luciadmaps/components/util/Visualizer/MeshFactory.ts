// Visualizer/MeshFactory.ts
import type { Mesh } from "@luciad/ria/geometry/mesh/Mesh.js";
import { create3DMesh } from "@luciad/ria/geometry/mesh/MeshFactory.js";
import { Icon3DStyle } from "@luciad/ria/view/style/Icon3DStyle.js";
import { FacetCullingType } from "@luciad/ria/view/style/FacetCullingType.js";
import type { MeshSpec, MeshScale } from "./types.js";

/* -------------------------------
   Procedural mesh builders
-------------------------------- */
function ellipsoid(rx=10, ry=10, rz=10, vSlices=24, hSlices=16): Mesh {
  const positions:number[] = [], indices:number[]=[];
  for (let y=0; y<=hSlices; y++) {
    const v = y / hSlices, phi = v * Math.PI;
    for (let x=0; x<=vSlices; x++) {
      const u = x / vSlices, th = u * Math.PI * 2;
      const sx=Math.cos(th)*Math.sin(phi), sy=Math.sin(th)*Math.sin(phi), sz=Math.cos(phi);
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
function dome(rx=10, ry=10, rz=10, vSlices=24, hSlices=16): Mesh {
  const positions:number[] = [], indices:number[]=[];
  for (let y=0; y<=hSlices; y++) {
    const v = y / hSlices, phi = v * (Math.PI/2);
    for (let x=0; x<=vSlices; x++) {
      const u = x / vSlices, th = u * Math.PI * 2;
      const sx=Math.cos(th)*Math.sin(phi), sy=Math.sin(th)*Math.sin(phi), sz=Math.cos(phi);
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
function cone(radius=8, height=20, slices=48): Mesh {
  const positions:number[] = [], indices:number[]=[];
  positions.push(0,0,0); positions.push(0,0,height);
  for (let i=0;i<slices;i++){ const a=(i/slices)*Math.PI*2; positions.push(Math.cos(a)*radius, Math.sin(a)*radius, 0); }
  for (let i=0;i<slices;i++){ const b=2+i, n=2+((i+1)%slices); indices.push(1,b,n); indices.push(0,n,b); }
  return create3DMesh(positions, indices, {});
}
function cylinder(radius=8, height=20, slices=48): Mesh {
  const positions:number[] = [], indices:number[]=[];
  positions.push(0,0,0); positions.push(0,0,height);
  const b0=positions.length/3;
  for(let i=0;i<slices;i++){ const a=(i/slices)*Math.PI*2; positions.push(Math.cos(a)*radius, Math.sin(a)*radius, 0); }
  const t0=positions.length/3;
  for(let i=0;i*slices;i++){ /* noop */ }
  for(let i=0;i<slices;i++){ const a=(i/slices)*Math.PI*2; positions.push(Math.cos(a)*radius, Math.sin(a)*radius, height); }
  for (let i=0;i<slices;i++){ const b=b0+i, bn=b0+((i+1)%slices), t=t0+i, tn=t0+((i+1)%slices); indices.push(b,t,bn, bn,t,tn); }
  for (let i=0;i*slices;i++){ /* noop */ }
  for (let i=0;i<slices;i++){ const b=b0+i, bn=b0+((i+1)%slices); indices.push(0,bn,b); }
  for (let i=0;i<slices;i++){ const t=t0+i, tn=t0+((i+1)%slices); indices.push(1,t,tn); }
  return create3DMesh(positions, indices, {});
}
function arrow(stickR=5, stickL=40, tipR=10, tipL=20, slices=48): Mesh {
  const shaft = cylinder(stickR, stickL, slices) as any;
  const tip   = cone(tipR, tipL, slices) as any;
  const positions:number[]=[], indices:number[]=[];
  const sPos = shaft.positions ?? shaft._positions ?? [], sIdx = shaft.indices ?? shaft._indices ?? [];
  positions.push(...sPos); indices.push(...sIdx);
  const tPos = tip.positions ?? tip._positions ?? [], tIdx = tip.indices ?? tip._indices ?? [];
  const off = positions.length/3;
  for(let i=0;i<tPos.length;i+=3){ positions.push(tPos[i], tPos[i+1], tPos[i+2]+stickL); }
  for(let i=0;i<tIdx.length;i++){ indices.push(tIdx[i]+off); }
  return create3DMesh(positions, indices, {});
}

/* -------------------------------
   Icon3DStyle builders
-------------------------------- */
const toScale = (s?: MeshScale) => (typeof s === "number" ? { x: s, y: s, z: s } : (s ?? { x:1, y:1, z:1 }));

export function buildIcon3DStyle(spec: MeshSpec): Icon3DStyle {
  if (spec.shape === "glb") {
    if (!spec.url) throw new Error("GLB mesh requires 'url'");
    return {
      meshUrl: spec.url,
      color: spec.color,
      scale: toScale(spec.scale),
      rotation: spec.rotation,
      translation: spec.translation,
      pbrSettings: { lightIntensity: spec.lightIntensity ?? 1.0 },
      transparency: spec.transparency ?? false,
      facetCulling: FacetCullingType.BACKFACE_CULLING,
      legacyAxis: false
    };
  }

  const p = spec.params ?? {};
  let mesh: Mesh;
  switch (spec.shape) {
    case "ellipsoid":       mesh = ellipsoid(p.radiusX??10,p.radiusY??10,p.radiusZ??10,p.verticalSlices??24,p.horizontalSlices??16); break;
    case "ellipsoidalDome": mesh = dome     (p.radiusX??10,p.radiusY??10,p.radiusZ??10,p.verticalSlices??24,p.horizontalSlices??16); break;
    case "cone":            mesh = cone     (p.radius??8,p.height??20,p.slices??48); break;
    case "cylinder":        mesh = cylinder (p.radius??8,p.height??20,p.slices??48); break;
    case "arrow":           mesh = arrow    (p.stickRadius??5,p.stickLength??40,p.tipBaseRadius??10,p.tipLength??20,p.slices??48); break;
    default: throw new Error(`Unsupported mesh shape: ${spec.shape}`);
  }

  return {
    mesh,
    color: spec.color,
    scale: toScale(spec.scale),
    rotation: spec.rotation,
    translation: spec.translation,
    pbrSettings: { lightIntensity: spec.lightIntensity ?? 1.0 },
    transparency: spec.transparency ?? false,
    facetCulling: FacetCullingType.BACKFACE_CULLING,
    legacyAxis: false
  };
}

export function buildSelectedStyle(base: Icon3DStyle, spec: MeshSpec): Icon3DStyle {
  return { ...base, pbrSettings: { lightIntensity: (spec.lightIntensity ?? 1.0) * 1.25 } };
}
