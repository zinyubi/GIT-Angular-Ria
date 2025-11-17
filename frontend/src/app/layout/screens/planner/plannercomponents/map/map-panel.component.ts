// src/app/layout/screens/planner/plannercomponents/map/map-panel.component.ts
import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { WebGLMap } from '@luciad/ria/view/WebGLMap.js';

import { MapComponentRia, PickPreviewEvent } from '../../../../../luciadmaps/components/map/map.component.ria';
import {
  Scenario,
  DeployedAircraft,
} from '../../../../../core/auth/services/scenario.service';

import { RiaVizFacade } from '../../../../../luciadmaps/components/util/riavisualization/index';
import {
  setWrapNormalization,
  setWgsSource,
} from '../../../../../luciadmaps/components/util/riavisualization/riaviz.utils';

import { ScenarioLayerHelper } from './helper/scenario-layer.helper';

@Component({
  standalone: true,
  selector: 'app-map-panel',
  imports: [CommonModule, MapComponentRia],
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.css'],
})
export class MapPanelComponent implements OnChanges, AfterViewInit {
  @ViewChild(MapComponentRia) mapCmp?: MapComponentRia;

  @Input() scenario: Scenario | null = null;
  /** Deployed aircraft list to render for the *current* scenario */
  @Input() deployedAircrafts: DeployedAircraft[] = [];

  @Output() pointPicked = new EventEmitter<{ lon: number; lat: number; alt?: number }>();

  private map?: WebGLMap;
  private viz?: RiaVizFacade;

  // Helper that owns all “scenario → layer + aircraft” logic
  private scenarioHelper?: ScenarioLayerHelper;

  // Pending state before map is ready
  private pendingScenario: Scenario | null = null;
  private pendingAircrafts: DeployedAircraft[] = [];

  // ──────────────────────────── Lifecycle ────────────────────────────

  ngAfterViewInit() {
    this.map = (this.mapCmp as any)?.map as WebGLMap | undefined;
    if (!this.map) return;

    setWrapNormalization((this.map as any).wrapAroundWorld ?? false);
    setWgsSource('CRS:84');

    this.viz = new RiaVizFacade(this.map);
    this.scenarioHelper = new ScenarioLayerHelper(
      this.map,
      this.viz,
      this.mapCmp
    );

    // Apply last-known state once the map is ready
    const scenarioToApply = this.scenario ?? this.pendingScenario ?? null;
    const aircraftToApply =
      scenarioToApply
        ? (this.deployedAircrafts ?? this.pendingAircrafts ?? [])
        : [];

    if (this.scenarioHelper) {
      this.scenarioHelper.applyScenario(
        scenarioToApply,
        aircraftToApply
      );
    }

    // Clear pending
    this.pendingScenario = null;
    this.pendingAircrafts = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    const scenarioChanged = !!changes['scenario'];
    const aircraftChanged = !!changes['deployedAircrafts'];

    if (!scenarioChanged && !aircraftChanged) return;

    const currentScenario = this.scenario ?? null;
    const currentAircrafts = this.deployedAircrafts ?? [];

    // Map not ready yet → stash both
    if (!this.map || !this.viz || !this.scenarioHelper) {
      if (scenarioChanged) this.pendingScenario = currentScenario;
      if (aircraftChanged) this.pendingAircrafts = currentAircrafts;
      return;
    }

    // If scenario is cleared → remove layer completely
    if (!currentScenario) {
      this.scenarioHelper.applyScenario(null, []);
      return;
    }

    // Scenario and/or aircraft list changed → re-apply with current data
    this.scenarioHelper.applyScenario(currentScenario, currentAircrafts);
  }

  // ──────────────────────────── Passthroughs ────────────────────────────

  startPointPicking() {
    this.mapCmp?.startPointPicking();
  }

  stopPointPicking() {
    this.mapCmp?.stopPointPicking();
  }

  onPointPicked(evt: { lon: number; lat: number; alt?: number }) {
    this.pointPicked.emit(evt);
  }

  /**
   * Live preview from MapComponentRia → forward into scenario layer helper so the
   * preview point is drawn in the same 3D layer as aircraft/waypoints.
   */
  onPickPreview(evt: PickPreviewEvent) {
    if (!this.scenarioHelper) {
      return;
    }

    // Cancel → clear preview
    if (evt.phase === 'cancel') {
      this.scenarioHelper.setPickPreview(null);
      return;
    }

    // Done → keep the final preview point (so it doesn't disappear)
    if (evt.phase === 'done') {
      if (evt.alt == null) {
        this.scenarioHelper.setPickPreview(null);
      } else {
        this.scenarioHelper.setPickPreview({
          lon: evt.lon,
          lat: evt.lat,
          alt: evt.alt,
        });
      }
      return;
    }

    // latlon / alt → show preview
    if (evt.alt == null) {
      return; // nothing useful to draw
    }

    this.scenarioHelper.setPickPreview({
      lon: evt.lon,
      lat: evt.lat,
      alt: evt.alt,
    });
  }
}
