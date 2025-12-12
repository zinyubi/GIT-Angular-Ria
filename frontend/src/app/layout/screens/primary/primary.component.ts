import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { MapComponentRia } from './../../../luciadmaps/components/map/map.component.ria';

import {
  SimulationWebsocketService,
  SimulationInfoMessage,
  SimulationSnapshot,
} from './simulationwebsocket.service';

import {
  SimulationMonitorService,
  SimulationOverview,
} from './simulationmonitor.service';

import { API_URLS } from '../../../config/api.config';
import { AuthService } from '../../../core/auth/services/auth.service';

import {
  PrimarySimLayerHelper,
  PrimaryTrailAircraft,
  PrimaryTrailPoint,
} from './primarysimlayer.helper';

import { SimStyleRegistry, SimUiSnapshot } from '../../../luciadmaps/components/util/riavisualization/simstyle.registry';

interface ScenarioListItem {
  id: number;
  name: string;
  sim_state?: string;
}

type SimulationInfoView = SimulationInfoMessage & {
  scenario_id?: number;
  time_now?: string;
  time_step?: number;
  sim_state?: string;
  can_control?: boolean;
  scenario_name?: string;
};

export interface LiveAircraftTrack {
  id: string;
  name?: string;
  lat: number;
  lon: number;
  alt_m?: number | null;
  speed_mps?: number | null;
  heading_deg?: number | null;
}

type TrailPoint = { lat: number; lon: number; alt: number };

@Component({
  standalone: true,
  selector: 'app-primary',
  imports: [CommonModule, FormsModule, MapComponentRia],
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.css'],
})
export class PrimaryComponent implements OnInit, OnDestroy, AfterViewInit {
  // Scenario selection
  scenarios: ScenarioListItem[] = [];
  monitorSimulations: SimulationOverview[] = [];
  selectedScenarioId: number | null = null;

  // Simulation state
  info: SimulationInfoView | null = null;
  lastSnapshot: SimulationSnapshot | null = null;
  connectionStatus = false;
  lastError: string | null = null;

  private subs: Subscription[] = [];

  // Map access
  @ViewChild(MapComponentRia) mapComponent?: MapComponentRia;
  private simLayerHelper?: PrimarySimLayerHelper;
  private pendingSnapshot: SimulationSnapshot | null = null;

  // Trail history
  private trailHistory = new Map<string, TrailPoint[]>();
  private readonly TRAIL_LENGTH = 100;

  // Style registry (shared between UI + painter)
  private styleRegistry = new SimStyleRegistry();

  // ───────────── Styling modal ─────────────
  simStyleModalOpen = false;
  simStyleTab: 'defaults' | 'overrides' = 'defaults';

  // UI form models (kept in sync via getUiSnapshot / update...)
  simDefaultsPoint: any = {};
  simDefaultsLine: any = {};
  simAircraftLabel: any = {};
  simTrailLabel: any = {};

  simSelectedAircraftId: string = '';
  simOverridePoint: any = {};
  simOverrideLine: any = {};

  constructor(
    private http: HttpClient,
    private simWs: SimulationWebsocketService,
    private monitorWs: SimulationMonitorService,
    private auth: AuthService,
  ) {}

  // ───────────────────────── lifecycle ─────────────────────────

  ngOnInit(): void {
    this.monitorWs.connect();
    this.subs.push(
      this.monitorWs.simulations$.subscribe((sims: SimulationOverview[]) => {
        this.monitorSimulations = sims;
        this.mergeMonitorStates();
      }),
    );

    this.subs.push(
      this.http
        .get<any[]>(API_URLS.SCENARIOS, { headers: this.auth.getAuthHeaders() })
        .subscribe({
          next: (rows: any[]) => {
            this.scenarios = (rows || []).map((s: any) => ({
              id: s.id,
              name: s.name,
            }));
            this.mergeMonitorStates();
          },
          error: () => (this.scenarios = []),
        }),
    );

    this.subs.push(
      this.simWs.info$.subscribe((info: SimulationInfoMessage | null) => {
        this.info = info as SimulationInfoView | null;
      }),

      this.simWs.snapshot$.subscribe((snap: SimulationSnapshot) => {
        this.lastSnapshot = snap;
        this.updateScenarioStateFromSnapshot(snap);
        this.updateScenarioLayerFromSnapshot(snap);
      }),

      this.simWs.state$.subscribe((msg: any) => {
        if (!msg) return;

        const snapshot: SimulationSnapshot | null | undefined = msg.snapshot;
        const newState: string | undefined = msg.state;
        const scenarioId: number | undefined = msg.scenario_id;

        if (snapshot) {
          this.lastSnapshot = snapshot;
          this.updateScenarioStateFromSnapshot(snapshot);
          this.updateScenarioLayerFromSnapshot(snapshot);
        }

        if (newState && scenarioId != null) {
          this.scenarios = this.scenarios.map((s) =>
            s.id === scenarioId ? { ...s, sim_state: newState } : s,
          );

          if (this.info && this.info.scenario_id === scenarioId) {
            this.info = { ...this.info, sim_state: newState } as SimulationInfoView;
          }
        }
      }),

      this.simWs.connected$.subscribe((isConnected: boolean) => {
        this.connectionStatus = isConnected;
      }),

      this.simWs.errors$.subscribe((err: string) => {
        this.lastError = err;
      }),
    );

    // initialize UI model from registry
    this.pullUiFromRegistry();
  }

  ngAfterViewInit(): void {
    if (this.mapComponent?.map && this.mapComponent.vizFacade) {
      this.simLayerHelper = new PrimarySimLayerHelper(
        this.mapComponent.map,
        this.mapComponent.vizFacade,
        this.mapComponent,
        this.styleRegistry,
      );

      if (this.pendingSnapshot) {
        this.updateScenarioLayerFromSnapshot(this.pendingSnapshot);
        this.pendingSnapshot = null;
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.simWs.disconnect();
    this.monitorWs.disconnect();
    this.simLayerHelper?.clear();
    this.trailHistory.clear();
  }

  // ───────────────────────── scenario list / monitor ─────────────────────────

  private mergeMonitorStates(): void {
    if (!this.scenarios.length) return;

    const byId = new Map<number, SimulationOverview>();
    for (const sim of this.monitorSimulations) byId.set(sim.scenario_id, sim);

    this.scenarios = this.scenarios.map((s) => ({
      ...s,
      sim_state: byId.get(s.id)?.state ?? s.sim_state,
    }));
  }

  private updateScenarioStateFromSnapshot(snap: SimulationSnapshot): void {
    this.scenarios = this.scenarios.map((s) =>
      s.id === snap.scenario_id ? { ...s, sim_state: snap.state } : s,
    );

    if (this.info && this.info.scenario_id === snap.scenario_id) {
      this.info = { ...this.info, sim_state: snap.state } as SimulationInfoView;
    }
  }

  get visibleScenarios(): ScenarioListItem[] {
    return this.scenarios;
  }

  get anyRunning(): boolean {
    if (this.monitorSimulations.length) {
      return this.monitorSimulations.some((s) => s.state === 'running');
    }
    return this.scenarios.some((s) => s.sim_state === 'running');
  }

  // ───────────────────────── scenario change + controls ─────────────────────────

  onScenarioChange(newId: number | null): void {
    this.simLayerHelper?.clear();
    this.trailHistory.clear();
    this.lastSnapshot = null;

    // load styles for the new scenario
    this.selectedScenarioId = newId;
    this.loadStylesForScenario(newId);

    if (!newId) {
      this.simWs.disconnect();
      this.info = null;
      return;
    }

    this.simWs.connect(newId);
  }

  onStart(): void {
    if (!this.canControl || !this.selectedScenarioId) return;

    this.info = {
      ...(this.info ?? {}),
      type: 'info',
      scenario_id: this.selectedScenarioId,
      sim_state: 'running',
    } as SimulationInfoView;

    this.scenarios = this.scenarios.map((s) =>
      s.id === this.selectedScenarioId ? { ...s, sim_state: 'running' } : s,
    );

    this.simWs.sendAction('start');
  }

  onPause(): void {
    if (!this.canControl || this.simState !== 'running' || !this.selectedScenarioId) return;

    this.info = {
      ...(this.info ?? {}),
      type: 'info',
      scenario_id: this.selectedScenarioId,
      sim_state: 'paused',
    } as SimulationInfoView;

    this.scenarios = this.scenarios.map((s) =>
      s.id === this.selectedScenarioId ? { ...s, sim_state: 'paused' } : s,
    );

    this.simWs.sendAction('pause');
  }

  onStop(): void {
    if (!this.canControl || !this.selectedScenarioId) return;

    this.info = {
      ...(this.info ?? {}),
      type: 'info',
      scenario_id: this.selectedScenarioId,
      sim_state: 'stopped',
    } as SimulationInfoView;

    this.scenarios = this.scenarios.map((s) =>
      s.id === this.selectedScenarioId ? { ...s, sim_state: 'stopped' } : s,
    );

    this.simWs.sendAction('stop');
  }

  onReset(): void {
    if (!this.canControl || !this.selectedScenarioId) return;

    this.trailHistory.clear();
    this.simLayerHelper?.clear();
    this.lastSnapshot = null;

    this.info = {
      ...(this.info ?? {}),
      type: 'info',
      scenario_id: this.selectedScenarioId,
      sim_state: 'idle',
    } as SimulationInfoView;

    this.scenarios = this.scenarios.map((s) =>
      s.id === this.selectedScenarioId ? { ...s, sim_state: 'idle' } : s,
    );

    this.simWs.sendAction('reset');
  }

  get canControl(): boolean {
    return !!this.info?.can_control;
  }

  get simState(): string {
    return this.info?.sim_state ?? this.lastSnapshot?.state ?? 'unknown';
  }

  get scenarioName(): string {
    if (this.info?.scenario_name) return this.info.scenario_name;
    if ((this.lastSnapshot as any)?.scenario_name) return (this.lastSnapshot as any).scenario_name;

    const selected = this.scenarios.find((s) => s.id === this.selectedScenarioId);
    return selected?.name ?? 'N/A';
  }

  // ───────────────────────── SAFE helpers for template ─────────────────────────

  /** Stable key for per-aircraft selection/override. Avoids .id/.callsign compile errors. */
  aircraftKey(ac: any, i: number): string {
    const ext = ac?.external_id;
    if (ext != null && String(ext).trim().length) return String(ext);
    return `idx:${i}`;
  }

  aircraftLabel(ac: any, i: number): string {
    return String(ac?.name ?? ac?.external_id ?? `Aircraft ${i + 1}`);
  }

  // ───────────────────────── telemetry for UI ─────────────────────────

  get liveTracks(): LiveAircraftTrack[] {
    const snap: any = this.lastSnapshot as any;
    if (!snap || !Array.isArray(snap.aircraft)) return [];

    return (snap.aircraft as any[])
      .map((raw: any, idx: number) => {
        const sp: any = raw.sim_position || {};
        return {
          id: this.aircraftKey(raw, idx),
          name: raw.name ?? raw.external_id ?? `Aircraft ${idx + 1}`,
          lat: sp.latitude,
          lon: sp.longitude,
          alt_m: sp.altitude_m ?? null,
          speed_mps: raw.ground_speed_mps ?? raw.speed_mps ?? null,
          heading_deg: raw.heading_deg ?? null,
        } as LiveAircraftTrack;
      })
      .filter((t) => Number.isFinite(t.lat) && Number.isFinite(t.lon));
  }

  public getTrackForAircraft(ac: any, idx: number): LiveAircraftTrack | undefined {
    const list = this.liveTracks;
    if (!list.length) return undefined;

    const id = this.aircraftKey(ac, idx);
    return list.find((t) => t.id === id) ?? list[idx];
  }

  // ───────────────── trail history + snapshot → trail aircraft ─────────────────

  private pushTrailPoint(trackKey: string, lat: number, lon: number, alt: number): void {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

    let arr = this.trailHistory.get(trackKey);
    if (!arr) {
      arr = [];
      this.trailHistory.set(trackKey, arr);
    }

    arr.push({ lat, lon, alt });
    if (arr.length > this.TRAIL_LENGTH) {
      arr.splice(0, arr.length - this.TRAIL_LENGTH);
    }
  }

  private snapshotToTrailAircrafts(snap: SimulationSnapshot): PrimaryTrailAircraft[] {
    const list: any[] = (snap as any).aircraft || [];

    return list.map((raw: any, idx: number) => {
      const sp: any = raw.sim_position || {};
      const lat = Number(sp.latitude ?? 0);
      const lon = Number(sp.longitude ?? 0);
      const alt = Number(sp.altitude_m ?? 0);

      const trackKey = this.aircraftKey(raw, idx);
      this.pushTrailPoint(trackKey, lat, lon, alt);

      const history = this.trailHistory.get(trackKey) || [];
      const current: PrimaryTrailPoint = { lon, lat, alt };

      const trailPoints: PrimaryTrailPoint[] = history.map((p) => ({
        lon: p.lon,
        lat: p.lat,
        alt: p.alt,
      }));

      const name = this.aircraftLabel(raw, idx);

      return {
        id: trackKey,
        name,
        scenarioId: (snap as any).scenario_id,
        current,
        trail: trailPoints,
        alt_m: alt,
        speed_mps: raw.ground_speed_mps ?? raw.speed_mps ?? null,
        heading_deg: raw.heading_deg ?? null,
      };
    });
  }

  public updateScenarioLayerFromSnapshot(snap: SimulationSnapshot | null): void {
    if (!snap) return;
    if (!this.selectedScenarioId || (snap as any).scenario_id !== this.selectedScenarioId) return;

    if (!this.mapComponent?.map || !this.mapComponent.vizFacade || !this.simLayerHelper) {
      this.pendingSnapshot = snap;
      return;
    }

    const aircrafts = this.snapshotToTrailAircrafts(snap);

    this.simLayerHelper.renderScenarioTrail(
      (snap as any).scenario_id,
      (snap as any).scenario_name ?? `Scenario ${(snap as any).scenario_id}`,
      aircrafts,
    );
  }

  // ───────────────────── Style modal + persistence ─────────────────────

  openSimStyleModal(): void {
    this.simStyleModalOpen = true;
    this.simStyleTab = 'defaults';
    this.pullUiFromRegistry();
  }

  closeSimStyleModal(): void {
    this.simStyleModalOpen = false;
  }

  private pullUiFromRegistry(): void {
    const snap = this.styleRegistry.getUiSnapshot();
    this.simDefaultsPoint = { ...snap.aircraftPoint };
    this.simDefaultsLine = { ...snap.trailLine };
    this.simAircraftLabel = { ...snap.aircraftLabel };
    this.simTrailLabel = { ...snap.trailLabel };

    // reset overrides UI (doesn't delete stored overrides)
    this.simSelectedAircraftId = '';
    this.simOverridePoint = this.styleRegistry.emptyPointOverride();
    this.simOverrideLine = this.styleRegistry.emptyLineOverride();
  }

  private persistStylesForScenario(): void {
    if (!this.selectedScenarioId) return;
    const key = `sim-style:scenario:${this.selectedScenarioId}`;
    const data = this.styleRegistry.exportScenarioSnapshot();
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadStylesForScenario(scenarioId: number | null): void {
    // Reset to defaults first
    this.styleRegistry.resetAll();

    if (!scenarioId) {
      this.pullUiFromRegistry();
      return;
    }

    const key = `sim-style:scenario:${scenarioId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SimUiSnapshot;
        this.styleRegistry.importScenarioSnapshot(parsed);
      } catch {
        // ignore bad JSON
      }
    }

    this.pullUiFromRegistry();
  }

  applySimDefaults(): void {
    this.styleRegistry.updateDefaultsFromUi({
      aircraftPoint: { ...this.simDefaultsPoint },
      trailLine: { ...this.simDefaultsLine },
      aircraftLabel: { ...this.simAircraftLabel },
      trailLabel: { ...this.simTrailLabel },
    });

    this.persistStylesForScenario();

    if (this.lastSnapshot) this.updateScenarioLayerFromSnapshot(this.lastSnapshot);
  }

  applySimPerAircraft(): void {
    if (!this.simSelectedAircraftId) return;

    const pointPatch = this.styleRegistry.cleanPointOverride({ ...this.simOverridePoint });
    const linePatch = this.styleRegistry.cleanLineOverride({ ...this.simOverrideLine });

    this.styleRegistry.setAircraftOverride(this.simSelectedAircraftId, {
      point: pointPatch,
      line: linePatch,
    });

    this.persistStylesForScenario();

    if (this.lastSnapshot) this.updateScenarioLayerFromSnapshot(this.lastSnapshot);
  }

  clearSimPerAircraft(): void {
    if (!this.simSelectedAircraftId) return;
    this.styleRegistry.clearAircraftOverride(this.simSelectedAircraftId);

    this.persistStylesForScenario();

    if (this.lastSnapshot) this.updateScenarioLayerFromSnapshot(this.lastSnapshot);
  }
}
