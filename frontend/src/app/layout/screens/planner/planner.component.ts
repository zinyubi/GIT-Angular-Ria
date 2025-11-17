// src/app/layout/screens/planner/planner.component.ts

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

// Child areas
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

// Local form type (structurally same as in AircraftEditor)
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
  // ===== Left rail =====
  scenarios: Scenario[] = [];
  selectedScenario: Scenario | null = null;
  editing = false;
  form = { name: '', description: '' };
  scenarioError = '';

  sidebarCollapsed = true;
  @ViewChild('listBlock', { static: false }) listBlock?: ElementRef<HTMLElement>;

  // ===== Map =====
  @ViewChild(MapPanelComponent) mapPanel?: MapPanelComponent;
  private pickMode: PickMode = 'none';

  // ===== Tools =====
  aircraftTypes: AircraftType[] = [];
  deployedAircrafts: DeployedAircraft[] = [];

  // Single-open panels
  deployOpen = true;
  editorOpen = false;
  inspectorCollapsed = false;

  autoSavePickedWaypoints = false;

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
    this.subs.add(
      this.state.scenarios$.subscribe(v => {
        this.scenarios = v;
      }),
    );
    this.subs.add(
      this.state.selectedScenario$.subscribe(v => {
        this.selectedScenario = v;
      }),
    );
    this.subs.add(
      this.state.editing$.subscribe(v => {
        this.editing = v;
      }),
    );
    this.subs.add(
      this.state.form$.subscribe(v => {
        this.form = v;
      }),
    );
    this.subs.add(
      this.state.scenarioError$.subscribe(v => {
        this.scenarioError = v;
      }),
    );
    this.subs.add(
      this.state.sidebarCollapsed$.subscribe(v => {
        this.sidebarCollapsed = v;
      }),
    );

    this.subs.add(
      this.state.aircraftTypes$.subscribe(v => {
        this.aircraftTypes = v;
      }),
    );
    this.subs.add(
      this.state.deployedAircrafts$.subscribe(v => {
        this.deployedAircrafts = v;
      }),
    );

    this.subs.add(
      this.state.loadingScenarios$.subscribe(v => (this.loadingScenarios = v)),
    );
    this.subs.add(
      this.state.loadingTypes$.subscribe(v => (this.loadingTypes = v)),
    );
    this.subs.add(
      this.state.loadingDeployed$.subscribe(v => (this.loadingDeployed = v)),
    );
    this.subs.add(
      this.state.savingScenario$.subscribe(v => (this.savingScenario = v)),
    );
    this.subs.add(
      this.state.deploying$.subscribe(v => (this.deploying = v)),
    );
    this.subs.add(
      this.state.savingAircraft$.subscribe(v => (this.savingAircraft = v)),
    );

    // Auto-close editor when cleared
    this.subs.add(
      this.state.editingAircraft$.subscribe(v => {
        this.editingAircraft = v;
        if (!v) {
          this.editorOpen = false;
          this.deployOpen = true;
        }
      }),
    );

    this.subs.add(
      this.state.waypointEditIndex$.subscribe(v => {
        this.waypointEditIndex = v;
      }),
    );

    // Waypoint form sync (incl. altitude)
    this.subs.add(
      this.state.waypointForm$.subscribe(v => {
        this.waypointForm = {
          lat: v?.lat ?? null,
          lon: v?.lon ?? null,
          alt: v?.alt ?? null,
        };
      }),
    );

    this.subs.add(
      this.state.newAircraftForm$.subscribe(v => {
        this.newAircraftForm = v;
      }),
    );

    // initial loads
    this.scenariosFx.loadScenarios();
    this.deployFx.loadAircraftTypes();
  }

  // ===== sidebar =====
  expand() {
    this.state.sidebarCollapsed$.next(false);
  }

  expandAnd(section: 'create' | 'edit' | 'list') {
    this.state.sidebarCollapsed$.next(false);
    requestAnimationFrame(() => {
      if (section === 'create') this.handleCreateScenario();
      else if (section === 'edit') this.handleEditScenario();
      else if (section === 'list') {
        this.listBlock?.nativeElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }

  // ===== scenarios =====
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

  // ===== types + deployed =====
  loadAircraftTypes() { this.deployFx.loadAircraftTypes(); }
  loadDeployedAircrafts() { this.deployFx.loadDeployedAircrafts(); }

  // ===== single-open logic =====
  onDeployOpenChange(open: boolean) {
    this.deployOpen = open;
    if (open) this.editorOpen = false;
  }

  onEditorOpenChange(open: boolean) {
    this.editorOpen = open;
    if (open) this.deployOpen = false;
  }

  // ===== deployment =====
  handleDeployAircraft() {
    this.deployFx.deployAircraft();
    this.deployOpen = false;
  }

  // ===== editor =====
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

  saveAircraft() {
    this.aircraftFx.saveAircraft();
  }

  editWaypoint(i: number) {
    this.aircraftFx.editWaypoint(i);
  }

  saveWaypoint() {
    this.aircraftFx.saveWaypoint();
  }

  deleteWaypoint(i: number) {
    this.aircraftFx.deleteWaypoint(i);
  }

  removeAircraft(ac: DeployedAircraft) {
    this.aircraftFx.deleteAircraft(ac);
  }

  /** Called from template when AircraftEditor emits waypointFormChange */
  onWaypointFormChange(form: WaypointForm) {
    this.waypointForm = {
      lat: form?.lat ?? null,
      lon: form?.lon ?? null,
      alt: form?.alt ?? null,
    };

    this.state.waypointForm$.next(this.waypointForm);
  }

  // ===== map picking =====
  beginPick(mode: PickMode) {
    this.pickMode = mode;
    console.debug('[Planner] beginPick', mode);

    if (mode !== 'edit-initial') {
      this.picker.begin(mode as 'deploy-latlon' | 'waypoint' | 'none');
    }
    this.mapPanel?.startPointPicking();
  }

  cancelPick() {
    console.debug('[Planner] cancelPick, previous mode =', this.pickMode);
    if (this.pickMode !== 'edit-initial') this.picker.cancel();
    this.pickMode = 'none';
    this.mapPanel?.stopPointPicking();
  }

  /**
   * Now accepts optional altitude from MapComponentRia:
   * handlePointPicked({ lon, lat, alt? })
   */
  handlePointPicked(coords: { lon: number; lat: number; alt?: number }) {
    const lat = +coords.lat.toFixed(6);
    const lon = +coords.lon.toFixed(6);
    const alt = coords.alt != null && Number.isFinite(coords.alt)
      ? +coords.alt.toFixed(1)
      : null;

    console.debug('[Planner] handlePointPicked', {
      mode: this.pickMode,
      raw: coords,
      normalized: { lat, lon, alt },
    });

    // Edit initial aircraft position (and alt if we have it)
    if (this.pickMode === 'edit-initial') {
      if (this.editingAircraft) {
        this.editingAircraft.initial_latitude = lat;
        this.editingAircraft.initial_longitude = lon;
        if (alt !== null) {
          this.editingAircraft.initial_altitude_m = alt;
        }
      }
      this.pickMode = 'none';
      return;
    }

    // For deploy/waypoint modes we still use MapPickerService for lat/lon,
    // but we ALSO wire altitude into our forms when available.
    this.picker.apply(
      { lon, lat },   // coords object used by your existing picker
      // Deploy callback
      (plat, plon) => {
        const current = this.state.newAircraftForm$.value;
        this.state.newAircraftForm$.next({
          ...current,
          initial_latitude: plat,
          initial_longitude: plon,
          // If map gave us an altitude, store it into the deploy form as well
          ...(alt !== null ? { initial_altitude_m: alt } : {}),
        });
      },
      // Waypoint callback
      (wplat, wplon) => {
        const currentWpForm = this.state.waypointForm$.value;
        this.state.waypointForm$.next({
          ...currentWpForm,
          lat: wplat,
          lon: wplon,
          // Use map altitude for waypoint if present
          ...(alt !== null ? { alt } : {}),
        });

        if (this.autoSavePickedWaypoints) {
          this.aircraftFx.saveWaypoint();
          this.beginPick('waypoint');
        }
      },
    );

    this.pickMode = 'none';
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.cancelPick();
  }

  // trackBy helpers
  trackByScenarioId = (_: number, s: Scenario) => s.id;
  trackByAircraftId = (_: number, a: DeployedAircraft) => a.id;
  trackByWaypointIndex = (i: number) => i;

  get mapDeployedAircrafts(): DeployedAircraft[] {
    if (!this.selectedScenario || !this.deployedAircrafts) return [];
    const sid = this.selectedScenario.id;
    const filtered = this.deployedAircrafts.filter(ac => ac.scenario === sid);
    return filtered;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
