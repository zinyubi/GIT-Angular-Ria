// planner.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  Scenario,
  AircraftType,
  DeployedAircraft,
} from '../../../core/auth/services/scenario.service';

// Child areas (sidebar/tools/map)
import { ScenariosRailComponent } from './plannercomponents/sidebar/scenarios-rail.component';
import { DeploymentFormComponent } from './plannercomponents/tools/deployment-form.component';
import { DeployedAircraftListComponent } from './plannercomponents/tools/deployed-aircraft-list.component';
import { AircraftEditorComponent } from './plannercomponents/tools/aircraft-editor.component';
import { MapPanelComponent } from './plannercomponents/map/map-panel.component';

// Facades + state
import { PlannerState } from './plannercomponents/state/planner.state';
import { ScenariosFacade } from './plannercomponents/facades/scenarios.facade';
import { DeploymentFacade } from './plannercomponents/facades/deployment.facade';
import { AircraftFacade } from './plannercomponents/facades/aircraft.facade';
import { MapPickerService } from './plannercomponents/facades/map-picker.service';

// ---- Unified, nullable form type for the editor (fixes template typing clashes)
type WaypointForm = { lat: number | null; lon: number | null; alt: number | null };

type PickMode = 'none' | 'deploy-latlon' | 'waypoint' | 'edit-initial';

@Component({
  standalone: true,
  selector: 'app-planner',
  imports: [
    CommonModule,
    FormsModule,
    ScenariosRailComponent,
    DeploymentFormComponent,
    DeployedAircraftListComponent,
    AircraftEditorComponent,
    MapPanelComponent,
  ],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent implements OnInit, OnDestroy {
  // ===== Left (sidebar) state =====
  scenarios: Scenario[] = [];
  selectedScenario: Scenario | null = null;
  editing = false;
  form = { name: '', description: '' };
  scenarioError = '';

  sidebarCollapsed = true;
  @ViewChild('listBlock', { static: false }) listBlock?: ElementRef<HTMLElement>;

  // ===== Map ref =====
  @ViewChild(MapPanelComponent) mapPanel?: MapPanelComponent;
  private pickMode: PickMode = 'none';

  // ===== Center (tools) data =====
  aircraftTypes: AircraftType[] = [];
  deployedAircrafts: DeployedAircraft[] = [];

  // Single-open panels
  deployOpen = true;
  editorOpen = false;

  // Optional: turn on to auto-save each waypoint on map click
  autoSavePickedWaypoints = false; // set to true if you want rapid multi-add on map

  newAircraftForm: {
    aircraft_type: string | number;
    name: string;
    initial_latitude: string | number;
    initial_longitude: string | number;
    initial_altitude_m: string | number;
  } = {
    aircraft_type: '',
    name: '',
    initial_latitude: '',
    initial_longitude: '',
    initial_altitude_m: '',
  };

  editingAircraft: DeployedAircraft | null = null;
  waypointEditIndex: number | null = null;

  // ---- Use the unified, nullable form type here
  waypointForm: WaypointForm = { lat: null, lon: null, alt: null };

  // Flags
  loadingScenarios = false;
  loadingTypes = false;
  loadingDeployed = false;
  savingScenario = false;
  deploying = false;
  savingAircraft = false;

  private subs = new Subscription();

  constructor(
    private state: PlannerState,
    private scenariosFx: ScenariosFacade,
    private deployFx: DeploymentFacade,
    private aircraftFx: AircraftFacade,
    private picker: MapPickerService,
  ) {}

  ngOnInit() {
    // mirror state
    this.subs.add(this.state.scenarios$.subscribe(v => (this.scenarios = v)));
    this.subs.add(this.state.selectedScenario$.subscribe(v => (this.selectedScenario = v)));
    this.subs.add(this.state.editing$.subscribe(v => (this.editing = v)));
    this.subs.add(this.state.form$.subscribe(v => (this.form = v)));
    this.subs.add(this.state.scenarioError$.subscribe(v => (this.scenarioError = v)));
    this.subs.add(this.state.sidebarCollapsed$.subscribe(v => (this.sidebarCollapsed = v)));

    this.subs.add(this.state.aircraftTypes$.subscribe(v => (this.aircraftTypes = v)));
    this.subs.add(this.state.deployedAircrafts$.subscribe(v => (this.deployedAircrafts = v)));

    this.subs.add(this.state.loadingScenarios$.subscribe(v => (this.loadingScenarios = v)));
    this.subs.add(this.state.loadingTypes$.subscribe(v => (this.loadingTypes = v)));
    this.subs.add(this.state.loadingDeployed$.subscribe(v => (this.loadingDeployed = v)));
    this.subs.add(this.state.savingScenario$.subscribe(v => (this.savingScenario = v)));
    this.subs.add(this.state.deploying$.subscribe(v => (this.deploying = v)));
    this.subs.add(this.state.savingAircraft$.subscribe(v => (this.savingAircraft = v)));

    // auto-close editor when facade clears it
    this.subs.add(this.state.editingAircraft$.subscribe(v => {
      this.editingAircraft = v;
      if (!v) { this.editorOpen = false; this.deployOpen = true; }
    }));

    this.subs.add(this.state.waypointEditIndex$.subscribe(v => (this.waypointEditIndex = v)));

    // ---- Keep the local form typed as WaypointForm (no empty strings)
    this.subs.add(this.state.waypointForm$.subscribe(v => {
      const f = v as Partial<WaypointForm> | null;
      this.waypointForm = {
        lat: f?.lat ?? null,
        lon: f?.lon ?? null,
        alt: f?.alt ?? null,
      };
    }));

    this.subs.add(this.state.newAircraftForm$.subscribe(v => (this.newAircraftForm = v)));

    // initial loads
    this.scenariosFx.loadScenarios();
    this.deployFx.loadAircraftTypes();
  }

  // sidebar helpers
  expand(): void { this.state.sidebarCollapsed$.next(false); }
  expandAnd(section: 'create' | 'edit' | 'list'): void {
    this.state.sidebarCollapsed$.next(false);
    requestAnimationFrame(() => {
      if (section === 'create') this.handleCreateScenario();
      else if (section === 'edit') { if (this.selectedScenario) this.handleEditScenario(); }
      else if (section === 'list') this.listBlock?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // scenarios
  loadScenarios() { this.scenariosFx.loadScenarios(); }

  handleSelect(s: Scenario) {
    this.scenariosFx.selectScenario(s, () => this.deployFx.loadDeployedAircrafts());
    this.editorOpen = false;
    this.deployOpen = true;
  }

  handleCreateScenario() { this.scenariosFx.createScenario(); }
  handleEditScenario() { this.scenariosFx.editScenario(); }
  handleCancelEditScenario() { this.scenariosFx.cancelEditScenario(); }
  handleSaveScenario() { this.scenariosFx.saveScenario(); }
  handleDeleteScenario(s: Scenario) { this.scenariosFx.deleteScenario(s); }

  // types + deployed
  loadAircraftTypes() { this.deployFx.loadAircraftTypes(); }
  loadDeployedAircrafts() { this.deployFx.loadDeployedAircrafts(); }

  // single-open logic
  onDeployOpenChange(open: boolean) {
    this.deployOpen = open;
    if (open) this.editorOpen = false;
  }
  onEditorOpenChange(open: boolean) {
    this.editorOpen = open;
    if (open) this.deployOpen = false;
  }

  // deployment
  handleDeployAircraft() {
    this.deployFx.deployAircraft();
    this.deployOpen = false;
  }

  // aircraft editor
  startEditAircraft(ac: DeployedAircraft) {
    this.aircraftFx.startEdit(ac);
    this.editorOpen = true;
    this.deployOpen = false;
  }
  cancelEditAircraft() {
    this.aircraftFx.cancelEdit();
    this.editorOpen = false;
    this.deployOpen = true;
  }
  saveAircraft() { this.aircraftFx.saveAircraft(); }
  editWaypoint(i: number) { this.aircraftFx.editWaypoint(i); }
  saveWaypoint() { this.aircraftFx.saveWaypoint(); }
  deleteWaypoint(i: number) { this.aircraftFx.deleteWaypoint(i); }

  // map picking
  beginPick(mode: PickMode) {
    this.pickMode = mode;
    if (mode !== 'edit-initial') {
      this.picker.begin(mode as 'deploy-latlon' | 'waypoint' | 'none');
    }
    this.mapPanel?.startPointPicking();
  }
  cancelPick() {
    if (this.pickMode !== 'edit-initial') {
      this.picker.cancel();
    }
    this.pickMode = 'none';
    this.mapPanel?.stopPointPicking();
  }
  handlePointPicked(coords: { lon: number; lat: number }) {
    const lat = +coords.lat.toFixed(6);
    const lon = +coords.lon.toFixed(6);

    if (this.pickMode === 'edit-initial') {
      if (this.editingAircraft) {
        this.editingAircraft.initial_latitude = lat;
        this.editingAircraft.initial_longitude = lon;
      }
      this.pickMode = 'none';
      return;
    }

    // deploy/waypoint modes
    this.picker.apply(
      coords,
      (plat, plon) => this.state.newAircraftForm$.next({
        ...this.state.newAircraftForm$.value,
        initial_latitude: plat, initial_longitude: plon
      }),
      (wplat, wplon) => {
        this.state.waypointForm$.next({
          ...this.state.waypointForm$.value,
          lat: wplat, lon: wplon
        });

        // OPTIONAL: auto-save each picked waypoint and keep picking
        if (this.autoSavePickedWaypoints) {
          this.aircraftFx.saveWaypoint();
          this.beginPick('waypoint');
        }
      },
    );

    this.pickMode = 'none';
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.cancelPick(); }

  // trackBy
  trackByScenarioId = (_: number, s: Scenario) => s.id;
  trackByAircraftId = (_: number, a: DeployedAircraft) => a.id;
  trackByWaypointIndex = (i: number) => i;

  ngOnDestroy() { this.subs.unsubscribe(); }
}
