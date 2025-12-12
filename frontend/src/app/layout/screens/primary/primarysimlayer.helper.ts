import type { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { FeatureLayer } from '@luciad/ria/view/feature/FeatureLayer.js';
import { FeatureModel } from '@luciad/ria/model/feature/FeatureModel.js';
import { MemoryStore } from '@luciad/ria/model/store/MemoryStore.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';

import { RiaVizFacade } from '../../../luciadmaps/components/util/riavisualization';
import { MapComponentRia } from '../../../luciadmaps/components/map/map.component.ria';

import { SimStyleRegistry } from '../../../luciadmaps/components/util/riavisualization/simstyle.registry';
import { PrimarySimPainter } from './primarysim.painter';

export interface PrimaryTrailPoint {
  lon: number;
  lat: number;
  alt: number;
}

export interface PrimaryTrailAircraft {
  id: string;
  name: string;
  scenarioId: number;
  current: PrimaryTrailPoint;
  trail: PrimaryTrailPoint[];

  alt_m?: number | null;
  speed_mps?: number | null;
  heading_deg?: number | null;
}

type AnyNode = any;

export class PrimarySimLayerHelper {
  private currentLayer: FeatureLayer | null = null;
  private store?: MemoryStore;

  constructor(
    private map: WebGLMap,
    private viz: RiaVizFacade,
    private mapCmp?: MapComponentRia,
    private styleRegistry: SimStyleRegistry = new SimStyleRegistry(),
  ) {}

  getStyleRegistry(): SimStyleRegistry {
    return this.styleRegistry;
  }

  clear(): void {
    if (!this.currentLayer) return;

    const mapAny: any = this.map as any;
    const lt: AnyNode = mapAny.layerTree;
    const layer = this.currentLayer;

    try {
      const parent: AnyNode = (layer as any).parent ?? lt ?? lt?.rootNode;
      if (parent && typeof parent.removeChild === 'function') parent.removeChild(layer);
    } catch (e) {
      console.warn('[PrimarySimLayerHelper] Failed to remove sim layer', e);
    }

    this.currentLayer = null;
    this.store = undefined;

    mapAny.repaint?.();
    this.mapCmp?.refreshLayerTree?.();
  }

  renderScenarioTrail(scenarioId: number, scenarioName: string, aircrafts: PrimaryTrailAircraft[]): void {
    const mapAny: any = this.map as any;
    const lt: AnyNode = mapAny.layerTree;

    if (!aircrafts || aircrafts.length === 0) {
      this.clear();
      return;
    }

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
    } as any);

    (layer as any).__isPrimarySimLayer = true;
    (layer as any).__scenarioId = scenarioId;

    try {
      if (lt && typeof lt.addChild === 'function') lt.addChild(layer);
      else if (lt?.rootNode && typeof lt.rootNode.addChild === 'function') lt.rootNode.addChild(layer);
    } catch (e) {
      console.warn('[PrimarySimLayerHelper] Could not add primary sim layer', e);
    }

    this.currentLayer = layer;
    this.store = store;

    try { this.viz.setActiveLayer(layer); } catch {}

    // ✅ real painter: point + line + labels
    try {
      (layer as any).painter = new PrimarySimPainter(this.styleRegistry);
    } catch (e) {
      console.warn('[PrimarySimLayerHelper] attaching PrimarySimPainter failed', e);
    }

    for (const ac of aircrafts) {
      const cur = ac.current;

      if (Number.isFinite(cur.lon) && Number.isFinite(cur.lat) && Number.isFinite(cur.alt)) {
        this.viz.addPoint3DForLayer(
          layer,
          cur.lon,
          cur.lat,
          cur.alt,
          {
            kind: 'sim-aircraft',
            aircraftId: ac.id,
            scenarioId,
            name: ac.name,
            label: ac.name,
            alt_m: ac.alt_m ?? cur.alt,
            speed_mps: ac.speed_mps ?? null,
            heading_deg: ac.heading_deg ?? null,
          },
          undefined,
        );
      }

      const coords: [number, number, number][] = [];

      for (const p of ac.trail) {
        if (Number.isFinite(p.lon) && Number.isFinite(p.lat) && Number.isFinite(p.alt)) {
          coords.push([p.lon, p.lat, p.alt]);
        }
      }

      if (Number.isFinite(cur.lon) && Number.isFinite(cur.lat) && Number.isFinite(cur.alt)) {
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
