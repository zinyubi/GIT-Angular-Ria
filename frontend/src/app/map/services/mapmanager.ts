// services/mapmanager.ts
import { Injectable } from '@angular/core';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';
import { createPoint, createBounds } from '@luciad/ria/shape/ShapeFactory.js';
import { createTransformation } from '@luciad/ria/transformation/TransformationFactory.js';
import { LocationMode } from '@luciad/ria/transformation/LocationMode.js';
import { OutOfBoundsError } from '@luciad/ria/error/OutOfBoundsError.js';

// Fit-to-bounds internals
import { ReferenceType } from '@luciad/ria/reference/ReferenceType.js';
import { Bounds } from '@luciad/ria/shape/Bounds.js';
import { FeatureLayer } from '@luciad/ria/view/feature/FeatureLayer.js';
import { Layer } from '@luciad/ria/view/Layer.js';
import { LayerGroup } from '@luciad/ria/view/LayerGroup.js';
import { LayerTreeNode } from '@luciad/ria/view/LayerTreeNode.js';
import { LayerTreeNodeType } from '@luciad/ria/view/LayerTreeNodeType.js';
import { LayerTreeVisitor } from '@luciad/ria/view/LayerTreeVisitor.js';
import { TileSet3DLayer } from '@luciad/ria/view/tileset/TileSet3DLayer.js';

type ProjectionConfig = {
  reference: string;       // e.g. 'EPSG:3857'
  use3D?: boolean;
  wrapAroundWorld?: boolean;
};

type CursorCb = (lon: number | null, lat: number | null) => void;
type ScaleCb  = (label: string, widthPx: number) => void;

@Injectable({ providedIn: 'root' })
export class MapManager {
  private map?: WebGLMap;

  // listeners
  private pickListener?: (e: MouseEvent) => void;
  private moveListener?: (e: MouseEvent) => void;

  // UI loops / callbacks
  private scaleRaf?: number;
  private scaleCb?: ScaleCb;
  private scaleMaxWidthPx = 200;

  // constants for scale bar
  private readonly INCH_TO_CM = 2.54;
  private readonly CM_TO_M    = 100;
  private readonly DPI        = 96;

  /** Create and initialize the map */
  async initializeMap(domNodeID: string, proj: ProjectionConfig): Promise<void> {
    this.destroy();
    const ref = getReference(proj.reference);

    this.map = new WebGLMap(domNodeID, {
      reference: ref,
      wrapAroundWorld: !!proj.wrapAroundWorld,
      autoAdjustDisplayScale: true
    });

    // 2D/3D look
    const cam = this.map.camera as any;
    if (proj.use3D && typeof cam?.setLook3D === 'function') cam.setLook3D();
    if (!proj.use3D && typeof cam?.setLook2D === 'function') cam.setLook2D();
  }

  /** Accessor */
  getMap(): WebGLMap | undefined { return this.map; }

  /** Resize */
  resize(): void { this.map?.resize(); }

  /** Destroy everything cleanly */
  destroy(): void {
    if (!this.map) return;
    this.stopPointPicking();
    this.stopMouseTracking();
    this.stopScaleUpdates();
    this.map.destroy();
    this.map = undefined;
  }

  /** Convert DOM position to lon/lat (EPSG:4326) */
  screenToLonLat(clientX: number, clientY: number, container: HTMLElement): { lon: number; lat: number } | null {
    const map = this.map;
    if (!map) return null;

    const mapRef = map.reference;
    const wgs84  = getReference('EPSG:4326');
    const viewPt = createPoint(null, []);
    const mapPt  = createPoint(mapRef, []);
    const wgsPt  = createPoint(wgs84, []);

    try {
      const rect = container.getBoundingClientRect();
      viewPt.move2D(clientX - rect.left, clientY - rect.top);

      map.getViewToMapTransformation(LocationMode.TERRAIN).transform(viewPt, mapPt);
      const mapToWgs = createTransformation(mapRef, wgs84, { normalizeWrapAround: map.wrapAroundWorld });
      mapToWgs.transform(mapPt, wgsPt);

      const lon = (wgsPt as any).x ?? (wgsPt as any)[0];
      const lat = (wgsPt as any).y ?? (wgsPt as any)[1];
      return Number.isFinite(lon) && Number.isFinite(lat) ? { lon, lat } : null;
    } catch (e) {
      if (e instanceof OutOfBoundsError) return null;
      throw e;
    }
  }

  /** One-shot or multi point picking */
  startPointPicking(container: HTMLElement, onPick: (lon: number, lat: number) => void, opts?: { multi?: boolean }): void {
    if (!this.map) return;
    this.stopPointPicking();

    this.pickListener = (e: MouseEvent) => {
      const c = this.screenToLonLat(e.clientX, e.clientY, container);
      if (c) onPick(+c.lon, +c.lat);
      if (!opts?.multi) this.stopPointPicking(container);
    };
    container.addEventListener('click', this.pickListener, { once: !opts?.multi });
  }
  stopPointPicking(container?: HTMLElement): void {
    if (!this.pickListener) return;
    (container ?? this.map?.domNode)?.removeEventListener('click', this.pickListener);
    this.pickListener = undefined;
  }

  /** Mouse cursor tracking (EPSG:4326) */
  startMouseTracking(container: HTMLElement, onMove: CursorCb): void {
    if (!this.map) return;
    this.stopMouseTracking();

    this.moveListener = (e: MouseEvent) => {
      const c = this.screenToLonLat(e.clientX, e.clientY, container);
      if (c) onMove(+c.lon, +c.lat);
      else onMove(null, null);
    };
    container.addEventListener('mousemove', this.moveListener);
  }
  stopMouseTracking(container?: HTMLElement): void {
    if (!this.moveListener) return;
    (container ?? this.map?.domNode)?.removeEventListener('mousemove', this.moveListener);
    this.moveListener = undefined;
  }

  /** Scale bar updates via rAF; calls back with (label, widthPx) */
  startScaleUpdates(maxWidthPx: number, cb: ScaleCb): void {
    this.scaleMaxWidthPx = Math.max(50, maxWidthPx);
    this.scaleCb = cb;
    this.tickScale();
  }
  stopScaleUpdates(): void {
    if (this.scaleRaf) cancelAnimationFrame(this.scaleRaf);
    this.scaleRaf = undefined;
    this.scaleCb = undefined;
  }

  /** Pan by view-size ratios (e.g., 0.3 right, -0.3 up) */
  panByRatio(xRatio: number, yRatio: number): void {
    const map = this.map;
    if (!map) return;
    const [vw, vh] = map.viewSize;
    map.mapNavigator.pan({
      targetLocation: createPoint(null, [vw * xRatio, vh * yRatio]),
      animate: { duration: 250 }
    });
  }

  /** Fit to all data present under the map.layerTree (layers & groups) */
  async fitAll(): Promise<void> {
    const map = this.map;
    if (!map) return;
    const node = (map as any).layerTree as LayerTreeNode;
    if (!node) return;

    const b = await this.getFitBounds(node);
    if (b && (map as any).viewFit) {
      (map as any).viewFit(b, { animate: true, padding: 24 });
    }
  }

  /** Optional helpers */
  getDisplayScale(): number { return this.map?.displayScale ?? 1; }
  setDisplayScale(autoAdjust: boolean, fixedScale?: number): void {
    if (!this.map) return;
    this.map.autoAdjustDisplayScale = autoAdjust;
    if (!autoAdjust && fixedScale !== undefined) this.map.displayScale = fixedScale;
  }
  restrictBounds(bounds: { minX: number; minY: number; maxX: number; maxY: number }): void {
    if (!this.map) return;
    const ref = this.map.reference;
    const navBounds = createBounds(ref, [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY]);
    this.map.restrictNavigationToBounds(navBounds);
  }

  // ----------------- internals -----------------

  private tickScale = (): void => {
    if (!this.scaleCb) return;

    const displayScale = this.getDisplayScale(); // px per meter factor will use this
    const pxPerMeter = displayScale * (this.DPI / this.INCH_TO_CM) * this.CM_TO_M; // px/m
    const maxWidthPx = this.scaleMaxWidthPx;
    const metersAtMax = maxWidthPx / pxPerMeter;

    const niceMeters = this.lower125(metersAtMax);

    let label = '';
    if (niceMeters >= 1000) label = `${(niceMeters / 1000).toLocaleString()} km`;
    else if (niceMeters >= 1) label = `${niceMeters.toLocaleString()} m`;
    else label = `${Math.round(niceMeters * 100)} cm`;

    const widthPx = pxPerMeter * niceMeters;
    this.scaleCb(label, widthPx);

    this.scaleRaf = requestAnimationFrame(this.tickScale);
  };

  private lower125(x: number): number {
    if (x <= 0) return 0;
    const exp = Math.floor(Math.log10(x));
    const frac = x / Math.pow(10, exp);
    const base = frac >= 5 ? 5 : frac >= 2 ? 2 : 1;
    return base * Math.pow(10, exp);
  }

  private async getFitBounds(node: LayerTreeNode): Promise<Bounds | null> {
    if (node.treeNodeType === LayerTreeNodeType.LAYER) {
      if (node instanceof FeatureLayer) {
        if (node.bounds) return node.bounds;
        return new Promise((resolve) => {
          const ok  = node.workingSet.on('QueryFinished', () => { ok?.remove(); err?.remove(); resolve(node.bounds || null); });
          const err = node.workingSet.on('QueryError',    () => { ok?.remove(); err?.remove(); resolve(node.bounds || null); });
        });
      }
      if (node instanceof TileSet3DLayer &&
          node.model.reference.referenceType === ReferenceType.CARTESIAN &&
          node.transformation) {
        return node.bounds;
      }
      return ((node as any).model?.bounds) || (node as any).bounds || null;
    }

    if (node.treeNodeType === LayerTreeNodeType.LAYER_GROUP) {
      const layers: Layer[] = [];
      const visitor: LayerTreeVisitor = {
        visitLayer: (l) => { layers.push(l); return LayerTreeVisitor.ReturnValue.CONTINUE; },
        visitLayerGroup: (g: LayerGroup) => {
          g.visitChildren(visitor, LayerTreeNode.VisitOrder.TOP_DOWN);
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        }
      };
      node.accept(visitor);

      const parts = await Promise.all(layers.map(l => this.getFitBounds(l)));
      let acc: Bounds | null = null;
      for (const b of parts) {
        if (!b) continue;
        if (!acc) { acc = b; continue; }
        const toAcc = createTransformation(b.reference!, acc.reference!);
        const bInAcc = toAcc.transformBounds(b);
        acc.setTo2DUnion(bInAcc);
      }
      return acc;
    }
    return null;
  }
}
