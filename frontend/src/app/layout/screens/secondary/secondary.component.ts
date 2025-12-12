// src/app/layout/screens/secondary/secondary.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MapComponentRia } from './../../../luciadmaps/components/map/map.component.ria';
import {
  SimulationWebsocketService,
  SimulationInfoMessage,
  SimulationSnapshot,
} from '../primary/simulationwebsocket.service';
import {
  SimulationMonitorService,
  SimulationOverview,
} from '../primary/simulationmonitor.service';

@Component({
  standalone: true,
  selector: 'app-secondary',
  imports: [CommonModule, FormsModule, MapComponentRia],
  templateUrl: './secondary.component.html',
  styleUrls: ['./secondary.component.css'],
})
export class SecondaryComponent implements OnInit, OnDestroy {
  simulations: SimulationOverview[] = [];
  selectedScenarioId: number | null = null;

  info: SimulationInfoMessage | null = null;
  lastSnapshot: SimulationSnapshot | null = null;
  connectionStatus = false;
  lastError: string | null = null;

  private subs: Subscription[] = [];

  constructor(
    private simWs: SimulationWebsocketService,
    private monitorWs: SimulationMonitorService,
  ) {}

  ngOnInit(): void {
    // 1) Connect to global monitor (no auth needed)
    this.monitorWs.connect();
    this.subs.push(
      this.monitorWs.simulations$.subscribe((sims) => {
        this.simulations = sims;
      }),
    );

    // 2) Subscribe to per-scenario simulation WS (view-only)
    this.subs.push(
      this.simWs.info$.subscribe((info) => {
        this.info = info;
      }),
      this.simWs.snapshot$.subscribe((snap) => {
        this.lastSnapshot = snap;
      }),
      this.simWs.connected$.subscribe((isConnected) => {
        this.connectionStatus = isConnected;
      }),
      this.simWs.errors$.subscribe((err) => {
        this.lastError = err;
      }),
      this.simWs.state$.subscribe((state) => {
        if (state.snapshot) {
          this.lastSnapshot = state.snapshot;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.simWs.disconnect();
    this.monitorWs.disconnect();
  }

  // ---------------- Scenario view ----------------

  /** Only show running simulations to secondary users. */
  get visibleScenarios(): SimulationOverview[] {
    return this.simulations.filter((s) => s.state === 'running');
  }

  get anyRunning(): boolean {
    return this.visibleScenarios.length > 0;
  }

  onScenarioChange(newId: number | null): void {
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

  get simState(): string {
    if (this.lastSnapshot?.state) {
      return this.lastSnapshot.state;
    }
    if (this.info?.sim_state) {
      return this.info.sim_state;
    }
    return 'unknown';
  }

  get scenarioName(): string {
    if (this.info?.scenario_name) return this.info.scenario_name;
    if (this.lastSnapshot?.scenario_name) return this.lastSnapshot.scenario_name;
    const selected = this.visibleScenarios.find(
      (s) => s.scenario_id === this.selectedScenarioId,
    );
    return selected?.scenario_name ?? 'N/A';
  }
}
