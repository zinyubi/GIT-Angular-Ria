import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import { createTransformation } from "@luciad/ria/transformation/TransformationFactory.js";
import type { CoordinateReference } from "@luciad/ria/reference/CoordinateReference.js";
import { createPoint, createBounds } from "@luciad/ria/shape/ShapeFactory.js";

export function assert(cond: any, msg: string) { if (!cond) throw new Error(msg); }
let _uid = 0; export function uid(prefix="id"){ _uid+=1; return `${prefix}-${_uid.toString(36)}`; }

export function clamp01(v:any,fallback=1){ const n=typeof v==="number"?v:fallback; return Math.max(0,Math.min(1,n)); }
export function withAlpha(color:string, layerAlpha?:number){
  if (layerAlpha==null) return color;
  const m = color.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(",").map(s=>s.trim());
    const r=+parts[0], g=+parts[1], b=+parts[2], a = parts[3]!=null?+parts[3]:1;
    return `rgba(${r},${g},${b},${Math.max(0,Math.min(1,a*layerAlpha))})`;
  }
  return color;
}
export function mergeStyle<T extends object|undefined>(base:T, patch:Partial<T>|undefined):T|undefined{
  if (!base && !patch) return undefined as any;
  return { ...(base as any), ...(patch as any) };
}

/* ----------- Transform cache + CRS:84 / EPSG:4326 pick ----------- */
const REF_CRS84 = getReference("CRS:84");       // lon,lat
const REF_EPSG4326 = getReference("EPSG:4326"); // lat,lon

type SrcName = "CRS:84" | "EPSG:4326";
type SrcRefChoice = { src: CoordinateReference; name: SrcName };

/** If set, overrides auto source selection. */
let _forcedSrc: SrcName | null = null;
/** Configure which WGS source to use for incoming lon/lat coordinates. */
export function setWgsSource(mode: SrcName | "auto") { _forcedSrc = (mode === "auto") ? null : mode; }

let _normalizeWrapAround = false;
export function setWrapNormalization(enable:boolean){ _normalizeWrapAround = !!enable; }

function getXYZ(p: any): [number, number, number] {
  const x = typeof p?.x === "number" ? p.x : NaN;
  const y = typeof p?.y === "number" ? p.y : NaN;
  const z = typeof p?.z === "number" ? p.z : 0;
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error(`Invalid point from transform`);
  return [x, y, z];
}
function rtErr(aLon:number,aLat:number,bLon:number,bLat:number){ return Math.abs(aLon-bLon)+Math.abs(aLat-bLat); }

const _srcPickCache = new WeakMap<CoordinateReference, SrcRefChoice>();
type TxKey = string;
type TxRec = { tx: ReturnType<typeof createTransformation>, srcName: SrcName };
const _txCache = new Map<TxKey, TxRec>();

function txKey(src:CoordinateReference, trg:CoordinateReference, wrap:boolean){
  const s = (src as any).identifier ?? "src";
  const t = (trg as any).identifier ?? "trg";
  return `${s}__${t}__wrap:${wrap ? "1":"0"}`;
}

function pickSourceRef(target: CoordinateReference): SrcRefChoice {
  if (_forcedSrc === "CRS:84") return { src: REF_CRS84, name: "CRS:84" };
  if (_forcedSrc === "EPSG:4326") return { src: REF_EPSG4326, name: "EPSG:4326" };

  const cached = _srcPickCache.get(target);
  if (cached) return cached;

  const T_LON=72.5714, T_LAT=23.0225;
  let e84=Number.POSITIVE_INFINITY, e4326=Number.POSITIVE_INFINITY;

  try{
    const fwd = createTransformation(REF_CRS84, target, { normalizeWrapAround: _normalizeWrapAround });
    const inv = fwd.inverseTransformation;
    const mapPt = fwd.transform(createPoint(REF_CRS84,[T_LON,T_LAT]));
    const [rlon, rlat] = getXYZ(inv.transform(mapPt));
    e84 = rtErr(T_LON,T_LAT, rlon, rlat);
  }catch{}

  try{
    const fwd = createTransformation(REF_EPSG4326, target, { normalizeWrapAround: _normalizeWrapAround });
    const inv = fwd.inverseTransformation;
    // EPSG:4326 input order is [lat, lon]
    const mapPt = fwd.transform(createPoint(REF_EPSG4326,[T_LAT,T_LON]));
    const [rlon, rlat] = getXYZ(inv.transform(mapPt));
    e4326 = rtErr(T_LON,T_LAT, rlon, rlat);
  }catch{}

  const choice: SrcRefChoice =
    e84 <= e4326 ? { src: REF_CRS84, name: "CRS:84" } : { src: REF_EPSG4326, name: "EPSG:4326" };
  _srcPickCache.set(target, choice);
  return choice;
}

/** Returns the forward transform AND the chosen source name (stable). */
function getForwardTx(target: CoordinateReference): TxRec {
  const { src, name } = pickSourceRef(target);
  const key = txKey(src, target, _normalizeWrapAround);
  let rec = _txCache.get(key);
  if (!rec){
    const tx = createTransformation(src, target, { normalizeWrapAround: _normalizeWrapAround });
    rec = { tx, srcName: name };
    _txCache.set(key, rec);
  }
  return rec!;
}

function srcWantsLatLon(srcName: SrcName){ return srcName === "EPSG:4326"; }

/* ------------------- Public helpers (2D/3D) ------------------- */
export function toMapPoint(reference: CoordinateReference, lon:number, lat:number){
  const { tx, srcName } = getForwardTx(reference);
  // You give lon,lat; swap only when EPSG:4326 is the source (lat,lon axis order)
  const wantsLatLon = srcWantsLatLon(srcName);
  const srcRef = wantsLatLon ? REF_EPSG4326 : REF_CRS84;
  const arr = wantsLatLon ? [lat, lon] : [lon, lat];

  const out = tx.transform(createPoint(srcRef, arr as number[]));
  const [x,y,z] = getXYZ(out);

  // IMPORTANT: if the target reference is 3D (e.g. geocentric), keep Z.
  const is3D = (reference as any)?.is3D === true || typeof z === "number";
  return is3D ? createPoint(reference,[x,y,z]) : createPoint(reference,[x,y]);
}



export function toMapPoint3D(reference: CoordinateReference, lon:number, lat:number, alt:number){
  const { tx, srcName } = getForwardTx(reference);
  const wantsLatLon = srcWantsLatLon(srcName);
  const srcRef = wantsLatLon ? REF_EPSG4326 : REF_CRS84;
  const arr = wantsLatLon ? [lat, lon, alt] : [lon, lat, alt];

  const out = tx.transform(createPoint(srcRef, arr as number[]));
  const [x,y,z] = getXYZ(out);
  return createPoint(reference,[x,y,z]);
}

export function toMapCoords(
  reference: CoordinateReference,
  coords: Array<[number, number] | [number, number, number]>
){
  const { tx, srcName } = getForwardTx(reference);
  const wantsLatLon = srcWantsLatLon(srcName);
  const srcRef = wantsLatLon ? REF_EPSG4326 : REF_CRS84;

  return coords.map(c => {
    const hasZ = c.length === 3;
    const arr = wantsLatLon
      ? (hasZ ? [c[1], c[0], c[2]] : [c[1], c[0]])
      : (hasZ ? [c[0], c[1], c[2]] : [c[0], c[1]]);
    const out = tx.transform(createPoint(srcRef, arr as number[]));
    const [x, y, z] = getXYZ(out);
    // Keep Z for 3D references to avoid “equator” artifacts
    const is3D = (reference as any)?.is3D === true || typeof z === "number";
    return (is3D ? [x, y, z] : [x, y, 0]) as [number, number, number];
  });
}


export function boundsFromLonLatRect(reference: CoordinateReference, minLon:number,minLat:number,maxLon:number,maxLat:number){
  const { tx, srcName } = getForwardTx(reference);
  const srcRef = srcWantsLatLon(srcName) ? REF_EPSG4326 : REF_CRS84;
  const a = srcWantsLatLon(srcName) ? [minLat, minLon] : [minLon, minLat];
  const b = srcWantsLatLon(srcName) ? [maxLat, maxLon] : [maxLon, maxLat];
  const out0 = tx.transform(createPoint(srcRef, a as number[]));
  const out1 = tx.transform(createPoint(srcRef, b as number[]));
  const [x0,y0] = getXYZ(out0);
  const [x1,y1] = getXYZ(out1);
  const x=Math.min(x0,x1), y=Math.min(y0,y1), w=Math.abs(x1-x0), h=Math.abs(y1-y0);
  return createBounds(reference,[x,w,y,h]);
}

/* --------------------------- Debug --------------------------- */
export function debugLogRoundtrip(reference: CoordinateReference, lon:number, lat:number, tag="dbg"){
  try{
    const { tx, srcName } = getForwardTx(reference);
    const srcRef = srcWantsLatLon(srcName) ? REF_EPSG4326 : REF_CRS84;
    const arr = srcWantsLatLon(srcName) ? [lat, lon] : [lon, lat];
    const mapPt = tx.transform(createPoint(srcRef, arr as number[]));
    const inv = tx.inverseTransformation;
    const [mx,my] = getXYZ(mapPt);
    const [rlon, rlat] = getXYZ(inv.transform(mapPt));
    console.info(`[RiaViz:${tag}] in {${lon},${lat}} -> map {${mx},${my}} -> back {${rlon},${rlat}} via ${srcName}`);
  }catch(e){ console.warn(`[RiaViz:${tag}] roundtrip failed`, e); }
}

export function delay(ms:number){ return new Promise(r=>setTimeout(r,ms)); }
export function throttle<T extends (...a:any[])=>void>(fn:T, ms:number):T{
  let last=0, t:any; return ((...a:any[])=>{
    const now=Date.now(); if (now-last>=ms){ last=now; fn(...a); }
    else{ clearTimeout(t); t=setTimeout(()=>{ last=Date.now(); fn(...a); }, ms-(now-last)); }
  }) as T;
}

export function makeCircleCanvas(size:number, fill:string, stroke?:{color:string;width?:number}){
  const r=Math.max(1,size), pad=Math.max(1,stroke?.width??0)+1, w=(r*2)+pad*2;
  const c=document.createElement("canvas"); c.width=w; c.height=w;
  const ctx=c.getContext("2d")!; ctx.translate(w/2,w/2);
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
  if (stroke?.color && (stroke.width??0)>0){ ctx.lineWidth=stroke.width!; ctx.strokeStyle=stroke.color!; ctx.stroke(); }
  return c;
}
