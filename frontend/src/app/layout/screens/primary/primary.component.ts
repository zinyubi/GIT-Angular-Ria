// src/app/layout/screens/primary/primary.component.ts
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
  SimulationControlAck,
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
};

export interface LiveAircraftTrack {
  id: string | number;
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

  // Trail history: trackId → last ≤100 points
  private trailHistory = new Map<string | number, TrailPoint[]>();
  private readonly TRAIL_LENGTH = 100;

  constructor(
    private http: HttpClient,
    private simWs: SimulationWebsocketService,
    private monitorWs: SimulationMonitorService,
    private auth: AuthService,
  ) {}

  // ───────────────────────── lifecycle ─────────────────────────

  ngOnInit(): void {
    // 1) Global monitor WS (for "(running)" etc. in the scenario dropdown)
    this.monitorWs.connect();
    this.subs.push(
      this.monitorWs.simulations$.subscribe((sims: SimulationOverview[]) => {
        this.monitorSimulations = sims;
        this.mergeMonitorStates();
      }),
    );

    // 2) Load scenarios once
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
          error: () => {
            this.scenarios = [];
          },
        }),
    );

    // 3) Per-scenario simulation websocket
    this.subs.push(
      // Info message (sent once on connect)
      this.simWs.info$.subscribe((info: SimulationInfoMessage | null) => {
        if (!info) {
          this.info = null;
          return;
        }
        this.info = info as SimulationInfoView;

        // If backend info has its own sim_state, sync it into scenarios
        if (info.sim_state && info.scenario_id != null) {
          this.applySimState(info.scenario_id, info.sim_state);
        }
      }),

      // Pure snapshot messages (type: "snapshot")
      this.simWs.snapshot$.subscribe((snap: SimulationSnapshot) => {
        this.lastSnapshot = snap;
        this.updateScenarioStateFromSnapshot(snap);
        this.updateScenarioLayerFromSnapshot(snap);
      }),

      // Control acks & other state messages (type: "control_ack", etc.)
      this.simWs.state$.subscribe((msg: SimulationControlAck | any) => {
        if (!msg) return;

        const snapshot: SimulationSnapshot | null | undefined = msg.snapshot;
        const newState: string | undefined = msg.state;
        const scenarioId: number | undefined = msg.scenario_id;

        // If backend included a fresh snapshot inside the control_ack
        if (snapshot) {
          this.lastSnapshot = snapshot;
          this.updateScenarioStateFromSnapshot(snapshot);
          this.updateScenarioLayerFromSnapshot(snapshot);
        }

        // Also update state from the control_ack itself (for immediate UI refresh)
        if (newState && scenarioId != null) {
          this.applySimState(scenarioId, newState);
        }
      }),

      // Socket connection flag
      this.simWs.connected$.subscribe((isConnected: boolean) => {
        this.connectionStatus = isConnected;
      }),

      // Error stream
      this.simWs.errors$.subscribe((err: string) => {
        this.lastError = err;
      }),
    );
  }

  ngAfterViewInit(): void {
    if (this.mapComponent?.map && this.mapComponent.vizFacade) {
      this.simLayerHelper = new PrimarySimLayerHelper(
        this.mapComponent.map,
        this.mapComponent.vizFacade,
        this.mapComponent,
      );

      if (this.pendingSnapshot) {
        this.updateScenarioLayerFromSnapshot(this.pendingSnapshot);
        this.pendingSnapshot = null;
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s: Subscription) => s.unsubscribe());
    this.simWs.disconnect();
    this.monitorWs.disconnect();
    this.simLayerHelper?.clear();
    this.trailHistory.clear();
  }

  // ───────────────────────── scenario list / monitor ─────────────────────────

  private mergeMonitorStates(): void {
    if (!this.scenarios.length && !this.monitorSimulations.length) return;

    const byId = new Map<number, SimulationOverview>();
    for (const sim of this.monitorSimulations) {
      byId.set(sim.scenario_id, sim);
    }

    // Update scenarios[].sim_state from monitor
    this.scenarios = this.scenarios.map((s: ScenarioListItem) => ({
      ...s,
      sim_state: byId.get(s.id)?.state ?? s.sim_state,
    }));

    // Also keep info.sim_state in sync for the current scenario
    if (this.info && this.info.scenario_id != null) {
      const m = byId.get(this.info.scenario_id);
      if (m) {
        this.info = {
          ...this.info,
          sim_state: m.state,
        } as SimulationInfoView;
      }
    }
  }

  /** Central helper: whenever we know "scenario X is now in state Y" we call this. */
  private applySimState(scenarioId: number, state: string): void {
    // Update scenario list
    this.scenarios = this.scenarios.map((s: ScenarioListItem) =>
      s.id === scenarioId ? { ...s, sim_state: state } : s,
    );

    // Update info if it belongs to the same scenario
    if (this.info && this.info.scenario_id === scenarioId) {
      this.info = {
        ...this.info,
        sim_state: state,
      } as SimulationInfoView;
    }
  }

  private updateScenarioStateFromSnapshot(snap: SimulationSnapshot): void {
    this.applySimState(snap.scenario_id, snap.state);
  }

  get visibleScenarios(): ScenarioListItem[] {
    return this.scenarios;
  }

  get anyRunning(): boolean {
    // Prefer monitor for "any running?"
    if (this.monitorSimulations.length) {
      return this.monitorSimulations.some(
        (s: SimulationOverview) => s.state === 'running',
      );
    }
    return this.scenarios.some((s: ScenarioListItem) => s.sim_state === 'running');
  }

  // ───────────────────────── scenario change + controls ─────────────────────────

  onScenarioChange(newId: number | null): void {
    // Clear map layer + trail history when switching
    this.simLayerHelper?.clear();
    this.trailHistory.clear();

    if (!newId) {
      this.selectedScenarioId = null;
      this.simWs.disconnect();
      this.info = null;
      this.lastSnapshot = null;
      return;
    }

    this.selectedScenarioId = newId;
    this.simWs.connect(newId);
  }

  // 🔹 Optimistic updates so we *don't* have to refresh the page

  onStart(): void {
    if (!this.canControl || !this.selectedScenarioId) return;

    this.info = {
      ...(this.info ?? {}),
      type: 'info',
      scenario_id: this.selectedScenarioId,
      sim_state: 'running',
      can_control: true,
    } as SimulationInfoView;

    this.applySimState(this.selectedScenarioId, 'running');

    this.simWs.sendAction('start');
  }

  onPause(): void {
    if (!this.canControl || this.simState !== 'running' || !this.selectedScenarioId) {
      return;
    }

    this.info = {
      ...(this.info ?? {}),
      type: 'info',
      scenario_id: this.selectedScenarioId,
      sim_state: 'paused',
      can_control: true,
    } as SimulationInfoView;

    this.applySimState(this.selectedScenarioId, 'paused');

    this.simWs.sendAction('pause');
  }

  onStop(): void {
    if (!this.canControl || !this.selectedScenarioId) return;

    this.info = {
      ...(this.info ?? {}),
      type: 'info',
      scenario_id: this.selectedScenarioId,
      sim_state: 'stopped',
      can_control: true,
    } as SimulationInfoView;

    this.applySimState(this.selectedScenarioId, 'stopped');

    this.simWs.sendAction('stop');
  }

  onReset(): void {
    if (!this.canControl || !this.selectedScenarioId) return;

    // Clear map + history
    this.trailHistory.clear();
    this.simLayerHelper?.clear();
    this.lastSnapshot = null;

    this.info = {
      ...(this.info ?? {}),
      type: 'info',
      scenario_id: this.selectedScenarioId,
      sim_state: 'idle',
      can_control: true,
    } as SimulationInfoView;

    this.applySimState(this.selectedScenarioId, 'idle');

    this.simWs.sendAction('reset');
  }

  get canControl(): boolean {
    return !!this.info?.can_control;
  }

  get simState(): string {
    // 1) Prefer monitor state for the selected scenario
    if (this.selectedScenarioId != null && this.monitorSimulations.length) {
      const m = this.monitorSimulations.find(
        (s) => s.scenario_id === this.selectedScenarioId,
      );
      if (m?.state) {
        return m.state;
      }
    }

    // 2) Then prefer info.sim_state (per-scenario WS)
    if (this.info?.sim_state) return this.info.sim_state;

    // 3) Then snapshot.state
    if (this.lastSnapshot?.state) return this.lastSnapshot.state;

    // 4) Finally, fall back to scenarios[] entry
    if (this.selectedScenarioId != null) {
      const s = this.scenarios.find((x) => x.id === this.selectedScenarioId);
      if (s?.sim_state) return s.sim_state;
    }

    return 'unknown';
  }

  get scenarioName(): string {
    if (this.info?.scenario_name) return this.info.scenario_name;
    if (this.lastSnapshot?.scenario_name) return this.lastSnapshot.scenario_name;

    const selected = this.scenarios.find(
      (s: ScenarioListItem) => s.id === this.selectedScenarioId,
    );
    return selected?.name ?? 'N/A';
  }

  // ───────────────────────── telemetry for UI ─────────────────────────

  get liveTracks(): LiveAircraftTrack[] {
    const snap: any = this.lastSnapshot as any;
    if (!snap || !Array.isArray(snap.aircraft)) return [];

    return (snap.aircraft as any[])
      .map((raw: any, idx: number) => {
        const sp: any = raw.sim_position || {};
        return {
          id: raw.external_id ?? raw.id ?? idx,
          name: raw.name ?? raw.external_id ?? `Aircraft ${idx + 1}`,
          lat: sp.latitude,
          lon: sp.longitude,
          alt_m: sp.altitude_m,
          speed_mps: raw.ground_speed_mps ?? raw.speed_mps ?? null,
          heading_deg: raw.heading_deg ?? null,
        } as LiveAircraftTrack;
      })
      .filter(
        (t: LiveAircraftTrack) =>
          Number.isFinite(t.lat) && Number.isFinite(t.lon),
      );
  }

  get primaryTrack(): LiveAircraftTrack | null {
    const tracks = this.liveTracks;
    return tracks.length ? tracks[0] : null;
  }

  getTrackForAircraft(ac: any, idx: number): LiveAircraftTrack | undefined {
    const list = this.liveTracks;
    if (!list.length) return undefined;

    const id = ac.external_id ?? ac.id ?? ac.callsign ?? null;

    let match: LiveAircraftTrack | undefined;
    if (id !== null) {
      match = list.find((t: LiveAircraftTrack) => t.id === id);
    }
    if (!match && ac.name) {
      match = list.find((t: LiveAircraftTrack) => t.name === ac.name);
    }
    if (!match && idx < list.length) {
      match = list[idx];
    }
    return match;
  }

  // ───────────────── trail history + snapshot → trail aircraft ─────────────────

  private pushTrailPoint(
    trackKey: string | number,
    lat: number,
    lon: number,
    alt: number,
  ): void {
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

  private snapshotToTrailAircrafts(
    snap: SimulationSnapshot,
  ): PrimaryTrailAircraft[] {
    const list: any[] = (snap as any).aircraft || [];

    return list.map((raw: any, idx: number) => {
      const sp: any = raw.sim_position || {};
      const lat = Number(sp.latitude ?? 0);
      const lon = Number(sp.longitude ?? 0);
      const alt = Number(sp.altitude_m ?? 0);

      const trackKey: string | number =
        raw.external_id ?? raw.id ?? raw.callsign ?? idx;

      this.pushTrailPoint(trackKey, lat, lon, alt);

      const history: TrailPoint[] = this.trailHistory.get(trackKey) || [];
      const current: PrimaryTrailPoint = { lon, lat, alt };

      const trailPoints: PrimaryTrailPoint[] = history.map(
        (p: TrailPoint): PrimaryTrailPoint => ({
          lon: p.lon,
          lat: p.lat,
          alt: p.alt,
        }),
      );

      const name: string =
        raw.name ?? raw.external_id ?? `Aircraft ${idx + 1}`;

      return {
        id: trackKey,
        name,
        scenarioId: snap.scenario_id,
        current,
        trail: trailPoints,
      };
    });
  }

  private updateScenarioLayerFromSnapshot(
    snap: SimulationSnapshot | null,
  ): void {
    if (!snap) return;

    if (!this.selectedScenarioId || snap.scenario_id !== this.selectedScenarioId) {
      return;
    }

    if (
      !this.mapComponent?.map ||
      !this.mapComponent.vizFacade ||
      !this.simLayerHelper
    ) {
      this.pendingSnapshot = snap;
      return;
    }

    const aircrafts: PrimaryTrailAircraft[] =
      this.snapshotToTrailAircrafts(snap);

    this.simLayerHelper.renderScenarioTrail(
      snap.scenario_id,
      snap.scenario_name ?? `Scenario ${snap.scenario_id}`,
      aircrafts,
    );
  }
}
