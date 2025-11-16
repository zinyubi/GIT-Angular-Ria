// scenario-layer.helper.ts
import type { WebGLMap } from "@luciad/ria/view/WebGLMap.js";

import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { MemoryStore } from "@luciad/ria/model/store/MemoryStore.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";

import {
  Scenario,
  DeployedAircraft,
  Waypoint,
} from "../../../../../../core/auth/services/scenario.service";

import { RiaVizFacade } from "../../../../../../luciadmaps/components/util/riavisualization/index";
import { makeCircleCanvas } from "../../../../../../luciadmaps/components/util/riavisualization/riaviz.utils";
import { MapComponentRia } from "../../../../../../luciadmaps/components/map/map.component.ria";

type AnyNode = any;

export class ScenarioLayerHelper {
  private currentScenarioKey: string | number | null = null;
  private currentLayer: FeatureLayer | null = null;

  /** Cached icon canvas for 3D points */
  private pointIconCanvas?: HTMLCanvasElement | null;

  // ✅ Do NOT change this constructor signature
  constructor(
    private map: WebGLMap,
    private viz: RiaVizFacade,
    private mapCmp?: MapComponentRia
  ) {}

  /**
   * Behavior:
   *  - s == null → remove current layer.
   *  - s != null → remove previous scenario layer, create a fresh layer named after scenario,
   *                then render aircraft for that scenario.
   */
  applyScenario(s: Scenario | null, aircrafts: DeployedAircraft[] = []): void {
    const mapAny: any = this.map as any;
    const lt: AnyNode = mapAny.layerTree;

    if (!s) {
      this.removeCurrentLayer();
      mapAny.repaint?.();
      this.mapCmp?.refreshLayerTree?.();
      return;
    }

    const scenarioKey: string | number = (s as any).id ?? s.name;
    const label: string = s.name || `Scenario ${scenarioKey}`;


    // Always remove previous scenario layer
    this.removeCurrentLayer();

    // Prepare icon canvas once
    if (!this.pointIconCanvas) {
      this.pointIconCanvas = makeCircleCanvas(8, "#e91e63", {
        color: "#fff",
        width: 2,
      });
    }

    // Create a brand-new, empty in-memory FeatureLayer for this scenario
    const store = new MemoryStore();
    const reference = getReference("EPSG:4979"); // 3D WGS84
    const model = new FeatureModel(store, { reference });

    const layer = new FeatureLayer(model as any, {
      label,
      style: {
        point: {
          symbol: "icon",
          image: this.pointIconCanvas,
          width: 18,
          height: 18,
        },
        line: {
          color: "rgba(11, 65, 240, 1)",
          bloom: "10",
          width: 1,
        },
      } as any,
    } as any);

    try {
      lt.addChild(layer);
    } catch (e) {
      console.warn(
        "[ScenarioLayerHelper] Could not add scenario layer to layerTree",
        e
      );
    }

    this.currentScenarioKey = scenarioKey;
    this.currentLayer = layer;

    // Render aircraft + waypoints + routes into this layer
    try {
      this.renderAircraftForScenario(aircrafts, s, layer);
    } catch (e) {
      console.warn(
        "[ScenarioLayerHelper] Failed to render aircraft for scenario",
        e
      );
    }

    // Debug: list top-level labels
    try {
      const labels = this.getChildren(lt).map((n: any) =>
        (
          n.label ??
          n.name ??
          n.layer?.label ??
          n.layer?.name ??
          ""
        ).toString()
      );

    } catch {
      /* best effort only */
    }

    mapAny.repaint?.();
    this.mapCmp?.refreshLayerTree?.();
  }

  // ──────────────────────────── Aircraft → 3D Shapes ────────────────────────────

  /**
   * IMPORTANT: we pass the actual FeatureLayer so RiaViz can write directly
   * into that scenario layer, without relying on activeLayer.
   */
  private renderAircraftForScenario(
    aircrafts: DeployedAircraft[],
    scenario: Scenario,
    layer: FeatureLayer
  ): void {
    if (!aircrafts || aircrafts.length === 0) {
      console.info(
        "[ScenarioLayerHelper] No deployed aircraft to render for scenario (empty layer kept)"
      );
      return;
    }



    // Ensure icon canvas is available
    if (!this.pointIconCanvas) {
      this.pointIconCanvas = makeCircleCanvas(8, "#e91e63", {
        color: "#fff",
        width: 2,
      });
    }

    for (const ac of aircrafts) {
      const acId =
        ac.id ?? ac.name ?? `ac_${Math.random().toString(36).slice(2)}`;
      const typeObj = ac.aircraft_type as any;
      const typeName =
        typeObj && typeof typeObj === "object"
          ? typeObj.name
          : typeObj ?? "Type";

      const baseAlt =
        ac.position?.altitude_m ??
        ac.initial_altitude_m ??
        10000;

      const lat0 = ac.position?.latitude ?? ac.initial_latitude;
      const lon0 = ac.position?.longitude ?? ac.initial_longitude;

      const wps: Waypoint[] = ac.planned_waypoints ?? [];

      // 1) Initial position as 3D icon
      if (typeof lon0 === "number" && typeof lat0 === "number") {
        this.viz.addPoint3DForLayer(
          layer,
          lon0,
          lat0,
          baseAlt,
          {
            kind: "aircraft",
            aircraftId: acId,
            scenarioId: ac.scenario ?? (scenario as any).id ?? null,
            name: ac.name ?? "Aircraft",
            typeName,
            status: ac.status ?? null,
          },
          {
            point: {
              symbol: "icon",
              image: this.pointIconCanvas,
              width: 18,
              height: 18,
            },
          } as any
        );
      }

      if (!Array.isArray(wps) || wps.length === 0) {
        continue;
      }

      const routeCoords: [number, number, number][] = [];

      // First route point = initial position
      if (typeof lon0 === "number" && typeof lat0 === "number") {
        routeCoords.push([lon0, lat0, baseAlt]);
      }

      // 2) Waypoints icons + route
      wps.forEach((wp, idx) => {
        if (typeof wp.lon !== "number" || typeof wp.lat !== "number") return;
        const wpAlt = wp.alt ?? baseAlt;

        this.viz.addPoint3DForLayer(
          layer,
          wp.lon,
          wp.lat,
          wpAlt,
          {
            kind: "waypoint",
            aircraftId: acId,
            scenarioId: ac.scenario ?? (scenario as any).id ?? null,
            index: idx,
            alt_m: wpAlt,
          },
          {
            point: {
              symbol: "icon",
              image: this.pointIconCanvas,
              width: 18,
              height: 18,
            },
          } as any
        );

        routeCoords.push([wp.lon, wp.lat, wpAlt]);
      });

      if (routeCoords.length >= 2) {
        this.viz.addLine3DForLayer(
          layer,
          routeCoords,
          {
            kind: "route",
            aircraftId: acId,
            scenarioId: ac.scenario ?? (scenario as any).id ?? null,
            waypointCount: routeCoords.length - 1,
          }
        );
      }
    }
  }

  // ──────────────────────────── internals ────────────────────────────

  private removeCurrentLayer(): void {
    if (!this.currentLayer) return;

    const mapAny: any = this.map as any;
    const lt: AnyNode = mapAny.layerTree;
    const layer = this.currentLayer;

    try {
      const parent: AnyNode = (layer as any).parent ?? lt;
      if (parent && typeof parent.removeChild === "function") {
        parent.removeChild(layer);
      }
    } catch (e) {
      console.warn(
        "[ScenarioLayerHelper] Failed to remove previous scenario layer",
        e
      );
    }

    this.currentLayer = null;
    this.currentScenarioKey = null;
  }

  private getChildren(n: AnyNode): AnyNode[] {
    if (!n) return [];
    if (Array.isArray(n.children)) return n.children;
    if (n.children && typeof n.children[Symbol.iterator] === "function") {
      try {
        return Array.from(n.children);
      } catch {
        return [];
      }
    }
    if (typeof n.childCount === "number" && typeof n.child === "function") {
      const arr: AnyNode[] = [];
      for (let i = 0; i < n.childCount; i++) arr.push(n.child(i));
      return arr;
    }
    return [];
  }
}
