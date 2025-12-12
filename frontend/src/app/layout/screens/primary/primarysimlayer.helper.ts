// src/app/layout/screens/primary/primary-sim-layer.helper.ts
import type { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { FeatureLayer } from '@luciad/ria/view/feature/FeatureLayer.js';
import { FeatureModel } from '@luciad/ria/model/feature/FeatureModel.js';
import { MemoryStore } from '@luciad/ria/model/store/MemoryStore.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';

import { RiaVizFacade } from '../../../luciadmaps/components/util/riavisualization';
import { MapComponentRia } from '../../../luciadmaps/components/map/map.component.ria';
import { SimLabelsPainter } from '../../../luciadmaps/components/util/riavisualization/labels.painter';

export interface PrimaryTrailPoint {
  lon: number;
  lat: number;
  alt: number;
}

export interface PrimaryTrailAircraft {
  id: string | number;
  name: string;
  scenarioId: number;
  current: PrimaryTrailPoint;
  /** Oldest → newest trail points (current is NOT included here) */
  trail: PrimaryTrailPoint[];
}

type AnyNode = any;

export class PrimarySimLayerHelper {
  private currentLayer: FeatureLayer | null = null;
  private store?: MemoryStore;
  private currentScenarioId: number | null = null;

  private basePointStyle: any;
  private lineStyle: any;

  constructor(
    private map: WebGLMap,
    private viz: RiaVizFacade,
    private mapCmp?: MapComponentRia,
  ) {
    // Aircraft icon style
    this.basePointStyle = {
      symbol: 'circle',
      size: 12,
      fill: '#14b8a6', // teal
      outline: '#ffffff',
      outlineWidth: 2,
    };

    // Trail line style
    this.lineStyle = {
      color: 'rgba(56, 189, 248, 1)', // cyan-ish
      width: 2,
      bloom: 4,
    };
  }

  // ───────────────────────── clear / remove layer ─────────────────────────

  clear(): void {
    if (!this.currentLayer) return;

    const mapAny: any = this.map as any;
    const lt: AnyNode = mapAny.layerTree;
    const layer = this.currentLayer;

    try {
      const parent: AnyNode = (layer as any).parent ?? lt ?? lt?.rootNode;
      if (parent && typeof parent.removeChild === 'function') {
        parent.removeChild(layer);
      }
    } catch (e) {
      console.warn('[PrimarySimLayerHelper] Failed to remove sim layer', e);
    }

    this.currentLayer = null;
    this.store = undefined;
    this.currentScenarioId = null;

    mapAny.repaint?.();
    this.mapCmp?.refreshLayerTree?.();
  }

  // ───────────────────── render snapshot as icons + trails ─────────────────────

  renderScenarioTrail(
    scenarioId: number,
    scenarioName: string,
    aircrafts: PrimaryTrailAircraft[],
  ): void {
    const mapAny: any = this.map as any;
    const lt: AnyNode = mapAny.layerTree;

    if (!aircrafts || aircrafts.length === 0) {
      this.clear();
      return;
    }

    // Simple: rebuild the layer every snapshot
    this.clear();

    const store = new MemoryStore();
    const reference = getReference('EPSG:4979'); // 3D WGS84
    const model = new FeatureModel(store, { reference });

    const layerLabel = `${scenarioName} (Live)`;

    const layer = new FeatureLayer(model as any, {
      label: layerLabel,
      selectable: true,
      editable: false,
      visible: true,
      style: {
        point: this.basePointStyle,
        line: this.lineStyle,
      } as any,
    } as any);

    (layer as any).__isPrimarySimLayer = true;
    (layer as any).__scenarioId = scenarioId;
    (layer as any).kind = 'point';

    // Attach to layer tree
    try {
      if (lt && typeof lt.addChild === 'function') {
        lt.addChild(layer);
      } else if (lt?.rootNode && typeof lt.rootNode.addChild === 'function') {
        lt.rootNode.addChild(layer);
      } else {
        console.warn(
          '[PrimarySimLayerHelper] layerTree has no addChild; primary sim layer not attached',
        );
      }
    } catch (e) {
      console.warn(
        '[PrimarySimLayerHelper] Could not add primary sim layer to layerTree',
        e,
      );
    }

    this.currentLayer = layer;
    this.store = store;
    this.currentScenarioId = scenarioId;

    // Hook into Style/Location editor ecosystem
    try {
      this.viz.setActiveLayer(layer);
    } catch (e) {
      console.warn('[PrimarySimLayerHelper] setActiveLayer failed', e);
    }

    // Attach label painter (for point + trail labels)
    try {
      (layer as any).painter = new SimLabelsPainter();
    } catch (e) {
      console.warn('[PrimarySimLayerHelper] attaching SimLabelsPainter failed', e);
    }

    // Draw one icon + one polyline (trail) per aircraft
    for (const ac of aircrafts) {
      const cur = ac.current;

      // 1) Aircraft icon at current position
      if (
        Number.isFinite(cur.lon) &&
        Number.isFinite(cur.lat) &&
        Number.isFinite(cur.alt)
      ) {
        this.viz.addPoint3DForLayer(
          layer,
          cur.lon,
          cur.lat,
          cur.alt,
          {
            kind: 'sim-aircraft',
            trail: true,
            aircraftId: ac.id,
            scenarioId,
            name: ac.name,
            label: ac.name,
          },
          undefined,
        );
      }

      // 2) Trail line: trail points + current
      const coords: [number, number, number][] = [];

      ac.trail.forEach((p: PrimaryTrailPoint) => {
        if (
          Number.isFinite(p.lon) &&
          Number.isFinite(p.lat) &&
          Number.isFinite(p.alt)
        ) {
          coords.push([p.lon, p.lat, p.alt]);
        }
      });

      if (
        Number.isFinite(cur.lon) &&
        Number.isFinite(cur.lat) &&
        Number.isFinite(cur.alt)
      ) {
        coords.push([cur.lon, cur.lat, cur.alt]);
      }

      if (coords.length >= 2) {
        this.viz.addLine3DForLayer(
          layer,
          coords,
          {
            kind: 'sim-trail',
            aircraftId: ac.id,
            scenarioId,
            name: ac.name,
            label: ac.name,
            pointCount: coords.length,
          },
          undefined,
        );
      }
    }

    mapAny.repaint?.();
    this.mapCmp?.refreshLayerTree?.();
  }
}
