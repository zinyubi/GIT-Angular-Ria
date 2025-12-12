// src/app/layout/screens/planner/plannercomponents/map/helper/scenario-layer.helper.ts
import type { WebGLMap } from "@luciad/ria/view/WebGLMap.js";

import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { MemoryStore } from "@luciad/ria/model/store/MemoryStore.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import { createPoint } from "@luciad/ria/shape/ShapeFactory.js";

import {
  Scenario,
  DeployedAircraft,
  Waypoint,
} from "../../../../../../core/auth/services/scenario.service";

import { RiaVizFacade } from "../../../../../../luciadmaps/components/util/riavisualization";
import { makeCircleCanvas } from "../../../../../../luciadmaps/components/util/riavisualization/riaviz.utils";
import { MapComponentRia } from "../../../../../../luciadmaps/components/map/map.component.ria";

type AnyNode = any;

const PICK_PREVIEW_ID = "__pick_preview__";
const PICK_PREVIEW_KIND = "pick-preview";

export class ScenarioLayerHelper {
  private currentScenarioKey: string | number | null = null;
  private currentLayer: FeatureLayer | null = null;

  /** Underlying MemoryStore used by the scenario FeatureModel */
  private scenarioStore?: MemoryStore;

  /** Cached icon canvas (kept if you want to use icons later) */
  private pointIconCanvas?: HTMLCanvasElement | null;

  /** Cached icon canvas for pick-preview (orange) */
  private pickPreviewIconCanvas?: HTMLCanvasElement | null;

  // Cached style objects for initial styling
  private basePointStyle: any;
  private previewPointStyle: any;
  private lineStyle: any;

  // ✅ Do NOT change this constructor signature
  constructor(
    private map: WebGLMap,
    private viz: RiaVizFacade,
    private mapCmp?: MapComponentRia
  ) {}

  // ──────────────────────────── Public API ────────────────────────────

  applyScenario(s: Scenario | null, aircrafts: DeployedAircraft[] = []): void {
    const mapAny: any = this.map as any;
    const lt: AnyNode = mapAny.layerTree;

    if (!s) {
      this.log("applyScenario(null) → removing scenario layer");
      this.removeCurrentLayer();
      mapAny.repaint?.();
      this.mapCmp?.refreshLayerTree?.();
      return;
    }

    const scenarioKey: string | number = (s as any).id ?? s.name;
    const label: string = s.name || `Scenario ${scenarioKey}`;

    this.log("applyScenario → creating layer", {
      scenarioKey,
      label,
      aircraftCount: aircrafts?.length ?? 0,
    });

    // Always remove previous scenario layer
    this.removeCurrentLayer();

    // Prepare icon canvases once (even though we now use circle style for editability)
    if (!this.pointIconCanvas) {
      this.pointIconCanvas = makeCircleCanvas(8, "#e91e63", {
        color: "#fff",
        width: 2,
      });
    }
    if (!this.pickPreviewIconCanvas) {
      this.pickPreviewIconCanvas = makeCircleCanvas(11, "#ff9800", {
        color: "#ffffff",
        width: 2,
      });
    }

    // Create a brand-new, empty in-memory FeatureLayer for this scenario
    const store = new MemoryStore();
    const reference = getReference("EPSG:4979"); // 3D WGS84
    const model = new FeatureModel(store, { reference });

    // 🟣 Use a NORMAL "circle" style so the Style Editor’s point controls work.
    this.basePointStyle = {
      symbol: "circle",
      size: 12,
      fill: "#e91e63",
      outline: "#ffffff",
      outlineWidth: 2,
    };

    this.previewPointStyle = {
      symbol: "circle",
      size: 16,
      fill: "#ff9800",
      outline: "#ffffff",
      outlineWidth: 2,
    };

    this.lineStyle = {
      color: "rgba(11, 65, 240, 1)",
      bloom: 10, // numeric, not string
      width: 1,
    };

    const layer = new FeatureLayer(model as any, {
      label,
      selectable: true,
      editable: true,
      visible: true,
      style: {
        point: this.basePointStyle,
        line: this.lineStyle,
      } as any,
    } as any);

    // Tag & debug
    (layer as any).__isScenarioLayer = true;
    (layer as any).__scenarioKey = scenarioKey;
    (layer as any).kind = "point";

    // 🔧 Style provider:
    //  - baseStyle = layer.style (what "Apply Layer" edits)
    //  - featureStyle = props.__style (what "Apply Feature" edits)
    //  - merged = deep merge of both
    //  - pick-preview overrides the point symbol
    (layer as any).styleProvider = (feature: any) => {
      const props = (feature && feature.properties) || {};
      const baseStyle = (layer as any).style || {};
      const featureStyle = props.__style || {};

      let merged = this.mergeDeep(baseStyle, featureStyle);

      if (props.kind === PICK_PREVIEW_KIND) {
        merged = {
          ...merged,
          point: this.previewPointStyle,
        };
      }

      return merged;
    };

    // Add to layer tree (robust: try rootNode if needed)
    try {
      if (lt && typeof lt.addChild === "function") {
        lt.addChild(layer);
      } else if (lt?.rootNode && typeof lt.rootNode.addChild === "function") {
        lt.rootNode.addChild(layer);
      } else {
        this.warn(
          "[ScenarioLayerHelper] layerTree has no addChild; scenario layer not attached"
        );
      }
    } catch (e) {
      this.warn(
        "[ScenarioLayerHelper] Could not add scenario layer to layerTree",
        e
      );
    }

    this.currentScenarioKey = scenarioKey;
    this.currentLayer = layer;
    this.scenarioStore = store;

    // 🔥 Register this scenario layer with the shared vizFacade
    // so Style/Location editors & registry know about it.
    try {
      this.viz.setActiveLayer(layer);
      this.log("Registered scenario layer with viz", { label, scenarioKey });
    } catch (e) {
      this.warn("Failed to register scenario layer with vizFacade", e);
    }

    // Render aircraft + waypoints + routes into this layer
    try {
      this.renderAircraftForScenario(aircrafts, s, layer);
    } catch (e) {
      this.warn(
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
      this.log("LayerTree top-level labels after scenario add:", labels);
    } catch {
      /* best effort only */
    }

    mapAny.repaint?.();
    this.mapCmp?.refreshLayerTree?.();
  }

  // ──────────────────────────── Aircraft → 3D Shapes ────────────────────────────

  private renderAircraftForScenario(
    aircrafts: DeployedAircraft[],
    scenario: Scenario,
    layer: FeatureLayer
  ): void {
    const scenarioId = (scenario as any)?.id ?? null;

    // Filter aircrafts for this scenario only (if they carry a scenario id)
    const activeAircrafts =
      scenarioId == null
        ? aircrafts
        : aircrafts.filter((ac) => (ac as any).scenario === scenarioId);

    if (!activeAircrafts || activeAircrafts.length === 0) {
      this.log(
        "renderAircraftForScenario → no deployed aircraft for this scenario (empty scenario layer kept)",
        { scenarioId, count: aircrafts?.length ?? 0 }
      );
      return;
    }

    if (!this.pointIconCanvas) {
      this.pointIconCanvas = makeCircleCanvas(8, "#e91e63", {
        color: "#fff",
        width: 2,
      });
    }

    this.log("renderAircraftForScenario → count =", activeAircrafts.length, {
      scenarioId,
    });

    for (const ac of activeAircrafts) {
      const acId =
        ac.id ?? ac.name ?? `ac_${Math.random().toString(36).slice(2)}`;
      const typeObj = ac.aircraft_type as any;
      const typeName =
        typeObj && typeof typeObj === "object"
          ? typeObj.name
          : typeObj ?? "Type";

      const baseAlt =
        ac.position?.altitude_m ?? ac.initial_altitude_m ?? 10000;

      const lat0 = ac.position?.latitude ?? ac.initial_latitude;
      const lon0 = ac.position?.longitude ?? ac.initial_longitude;

      const wps: Waypoint[] = ac.planned_waypoints ?? [];

      // 1) Initial position as 3D point
      if (typeof lon0 === "number" && typeof lat0 === "number") {
        this.viz.addPoint3DForLayer(
          layer,
          lon0,
          lat0,
          baseAlt,
          {
            kind: "aircraft",
            aircraftId: acId,
            scenarioId: (ac as any).scenario ?? scenarioId,
            name: ac.name ?? "Aircraft",
            typeName,
            status: ac.status ?? null,
          },
          // 🔹 No custom style here: uses layer.style so Style Editor can control it
          undefined
        );
      } else {
        this.warn("Skipping aircraft initial point: invalid lon/lat", {
          acId,
          lon0,
          lat0,
        });
      }

      if (!Array.isArray(wps) || wps.length === 0) {
        this.log("Aircraft has no waypoints, skipping route", { acId });
        continue;
      }

      const routeCoords: [number, number, number][] = [];

      // First route point = initial position (if valid)
      if (typeof lon0 === "number" && typeof lat0 === "number") {
        routeCoords.push([lon0, lat0, baseAlt]);
      } else {
        this.warn("Route start skipped: invalid lon/lat", {
          acId,
          lon0,
          lat0,
        });
      }

      // 2) Waypoints icons + route
      wps.forEach((wp, idx) => {
        if (typeof wp.lon !== "number" || typeof wp.lat !== "number") {
          this.warn("Skipping waypoint with invalid lon/lat", { wp, idx });
          return;
        }
        const wpAlt = wp.alt ?? baseAlt;

        this.viz.addPoint3DForLayer(
          layer,
          wp.lon,
          wp.lat,
          wpAlt,
          {
            kind: "waypoint",
            aircraftId: acId,
            scenarioId: (ac as any).scenario ?? scenarioId,
            index: idx,
            alt_m: wpAlt,
          },
          // Again: let layer.style drive visualization
          undefined
        );

        routeCoords.push([wp.lon, wp.lat, wpAlt]);
      });

      if (routeCoords.length >= 2) {
        this.viz.addLine3DForLayer(layer, routeCoords, {
          kind: "route",
          aircraftId: acId,
          scenarioId: (ac as any).scenario ?? scenarioId,
          waypointCount: routeCoords.length - 1,
        });
      } else {
        this.log("Not enough points to build route polyline", {
          acId,
          routeCoordsLength: routeCoords.length,
        });
      }
    }
  }

  // ──────────────────────────── LIVE PICK PREVIEW ────────────────────────────

  setPickPreview(point: { lon: number; lat: number; alt: number } | null): void {
    if (!this.currentLayer || !this.scenarioStore) {
      this.log("setPickPreview called but no currentLayer/scenarioStore");
      return;
    }

    const store = this.scenarioStore;
    const ref3D = getReference("EPSG:4979");

    // If null → just clear existing preview (if any)
    if (!point) {
      this.log("Clearing pick preview feature");
      try {
        store.remove(PICK_PREVIEW_ID as any);
      } catch {
        /* ignore if not present */
      }
      (this.map as any).repaint?.();
      return;
    }

    const { lon, lat, alt } = point;
    const shape = createPoint(ref3D, [lon, lat, alt]);

    const existing = store.get(PICK_PREVIEW_ID as any);

    if (existing) {
      store.put({
        ...existing,
        shape,
        properties: {
          ...(existing as any).properties,
          kind: PICK_PREVIEW_KIND,
          alt_m: alt,
        },
      } as any);
    } else {
      store.put({
        id: PICK_PREVIEW_ID,
        shape,
        properties: {
          kind: PICK_PREVIEW_KIND,
          alt_m: alt,
        },
      } as any);
    }

    (this.map as any).repaint?.();
  }

  // ──────────────────────────── internals ────────────────────────────

  private removeCurrentLayer(): void {
    if (!this.currentLayer) return;

    const mapAny: any = this.map as any;
    const lt: AnyNode = mapAny.layerTree;
    const layer = this.currentLayer;

    this.log("Removing previous scenario layer", {
      label: (layer as any).label,
      scenarioKey: this.currentScenarioKey,
    });

    try {
      const parent: AnyNode = (layer as any).parent ?? lt ?? lt?.rootNode;
      if (parent && typeof parent.removeChild === "function") {
        parent.removeChild(layer);
      }
    } catch (e) {
      this.warn(
        "[ScenarioLayerHelper] Failed to remove previous scenario layer",
        e
      );
    }

    this.currentLayer = null;
    this.currentScenarioKey = null;
    this.scenarioStore = undefined;
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

  // small local deep-merge (same behavior as in RiaVizFacade)
  private mergeDeep<T extends object>(a: T, b: any): T {
    const out: any = Array.isArray(a) ? [...(a as any)] : { ...(a as any) };
    if (b && typeof b === "object") {
      Object.keys(b).forEach((k) => {
        const v = (b as any)[k];
        if (v && typeof v === "object" && !Array.isArray(v)) {
          out[k] = this.mergeDeep(out[k] || {}, v);
        } else {
          out[k] = v;
        }
      });
    }
    return out as T;
  }

  // ──────────────────────────── Debug helpers ────────────────────────────

  private log(...args: any[]) {
    console.info("[ScenarioLayerHelper]", ...args);
  }

  private warn(...args: any[]) {
    console.warn("[ScenarioLayerHelper]", ...args);
  }
}
