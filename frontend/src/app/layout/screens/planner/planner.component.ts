// planner.component.ts
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

import { MapComponent } from '../../../map/map.component';
import {
  ScenarioService,
  Scenario,
  AircraftType,
  DeployedAircraft,
} from '../../../core/auth/services/scenario.service';

interface Waypoint {
  lat: number;
  lon: number;
  alt: number;
}

type PickMode = 'none' | 'deploy-latlon' | 'waypoint';

@Component({
  standalone: true,
  selector: 'app-planner',
  imports: [MapComponent, CommonModule, FormsModule],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent implements OnInit {
  // ===== Left (sidebar) state =====
  scenarios: Scenario[] = [];
  selectedScenario: Scenario | null = null;
  editing = false; // editing scenario details (left panel)
  form = { name: '', description: '' };
  scenarioError = '';

  // Collapsed/expanded rail
  sidebarCollapsed = true;

  // Hook to the scenarios list for smooth scroll when expanding to "list"
  @ViewChild('listBlock', { static: false }) listBlock?: ElementRef<HTMLElement>;

  // ===== Map ref (NEW) =====
  @ViewChild(MapComponent) map?: MapComponent;
  private pickMode: PickMode = 'none';

  // ===== Center (tools) data =====
  aircraftTypes: AircraftType[] = [];
  deployedAircrafts: DeployedAircraft[] = [];

  // Accordion state
  deployOpen = true;
  editorOpen = false;

  // Deployment form (strings for inputs; coerced on submit)
  newAircraftForm = {
    aircraft_type: '',        // type id as string; cast to number on submit
    name: '',
    initial_latitude: '',
    initial_longitude: '',
    initial_altitude_m: '' as number | string,
  };

  // Aircraft editing + waypoints
  editingAircraft: DeployedAircraft | null = null;
  waypointEditIndex: number | null = null;
  waypointForm: Waypoint = { lat: 0, lon: 0, alt: 0 };

  // Optional UI flags
  loadingScenarios = false;
  loadingTypes = false;
  loadingDeployed = false;
  savingScenario = false;
  deploying = false;
  savingAircraft = false;

  constructor(private scenarioService: ScenarioService) {}

  // ===== Lifecycle =====
  ngOnInit() {
    this.loadScenarios();
    this.loadAircraftTypes();
  }

  // ===== Sidebar helpers (new rail behavior) =====
  expand(): void {
    this.sidebarCollapsed = false;
  }

  expandAnd(section: 'create' | 'edit' | 'list'): void {
    this.sidebarCollapsed = false;
    // Defer to let the view render expanded state before acting
    requestAnimationFrame(() => {
      if (section === 'create') {
        this.handleCreateScenario();
      } else if (section === 'edit') {
        if (this.selectedScenario) this.handleEditScenario();
      } else if (section === 'list') {
        this.listBlock?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ===== Scenarios =====
  loadScenarios() {
    this.loadingScenarios = true;
    this.scenarioService
      .getAllScenarios()
      .pipe(
        catchError((err) => {
          console.error('Failed to load scenarios', err);
          return of<Scenario[]>([]);
        })
      )
      .subscribe((scenarios) => {
        this.scenarios = scenarios ?? [];
        this.loadingScenarios = false;

        // keep selection valid if list changed
        if (this.selectedScenario) {
          const found = this.scenarios.find((s) => s.id === this.selectedScenario!.id);
          if (!found) {
            this.selectedScenario = null;
            this.deployedAircrafts = [];
          }
        }
      });
  }

  loadAircraftTypes() {
    this.loadingTypes = true;
    this.scenarioService.getAircraftTypes().subscribe({
      next: (types) => (this.aircraftTypes = types ?? []),
      error: (err) => console.error('Failed to load aircraft types', err),
      complete: () => (this.loadingTypes = false),
    });
  }

  loadDeployedAircrafts() {
    if (!this.selectedScenario?.id) return;
    this.loadingDeployed = true;
    this.scenarioService.getDeployedAircrafts(this.selectedScenario.id).subscribe({
      next: (aircrafts) => (this.deployedAircrafts = aircrafts ?? []),
      error: (err) => console.error('Failed to load deployed aircrafts', err),
      complete: () => (this.loadingDeployed = false),
    });
  }

  handleSelect(s: Scenario) {
    this.selectedScenario = s;
    this.editing = false;
    this.form = { name: s.name, description: s.description || '' };
    this.loadDeployedAircrafts();
    this.deployOpen = true;
    this.editorOpen = false;
  }

  handleEditScenario() {
    if (!this.selectedScenario) return;
    this.editing = true;
    this.scenarioError = '';
  }

  handleCancelEditScenario() {
    this.editing = false;
    this.scenarioError = '';
    if (this.selectedScenario) {
      this.form = {
        name: this.selectedScenario.name,
        description: this.selectedScenario.description || '',
      };
    } else {
      this.form = { name: '', description: '' };
    }
  }

  handleDeleteScenario(s: Scenario) {
    if (!s?.id) return;
    if (!window.confirm('Delete this scenario?')) return;

    this.scenarioService.deleteScenario(s.id).subscribe({
      next: () => {
        this.scenarios = this.scenarios.filter((x) => x.id !== s.id);
        if (this.selectedScenario?.id === s.id) {
          this.selectedScenario = null;
          this.editing = false;
          this.deployedAircrafts = [];
        }
      },
      error: (err) => {
        console.error('Failed to delete scenario', err);
        alert('Failed to delete scenario.');
      },
    });
  }

  handleCreateScenario() {
    this.form = { name: '', description: '' };
    this.editing = true;
    this.selectedScenario = null;
    this.scenarioError = '';
  }

  handleSaveScenario() {
    this.scenarioError = '';

    if (!this.form.name?.trim()) {
      this.scenarioError = 'Scenario name is required.';
      return;
    }

    this.savingScenario = true;

    // update existing
    if (this.selectedScenario?.id && this.editing) {
      this.scenarioService.updateScenario(this.selectedScenario.id, this.form).subscribe({
        next: (updatedScenario) => {
          this.scenarios = this.scenarios.map((s) =>
            s.id === updatedScenario.id ? updatedScenario : s
          );
          this.selectedScenario = updatedScenario;
          this.editing = false;
        },
        error: (err) => {
          console.error('Failed to update scenario', err);
          this.scenarioError = err?.message || 'Failed to save scenario.';
        },
        complete: () => (this.savingScenario = false),
      });
      return;
    }

    // create new
    this.scenarioService.createScenario(this.form).subscribe({
      next: (newScenario) => {
        this.scenarios = [...this.scenarios, newScenario];
        this.selectedScenario = newScenario;
        this.editing = false;
      },
      error: (err) => {
        console.error('Failed to create scenario', err);
        this.scenarioError = err?.message || 'Failed to create scenario.';
      },
      complete: () => (this.savingScenario = false),
    });
  }

  // ===== Deployment =====
  handleDeployAircraft() {
    if (!this.selectedScenario?.id) return;

    const typeId = this.toNumber(this.newAircraftForm.aircraft_type);
    const lat = this.toNumber(this.newAircraftForm.initial_latitude);
    const lon = this.toNumber(this.newAircraftForm.initial_longitude);
    const alt = this.toNumber(this.newAircraftForm.initial_altitude_m);

    // Basic validation
    const errors: string[] = [];
    if (!typeId) errors.push('Select an aircraft type.');
    if (!this.isValidLat(lat)) errors.push('Latitude must be between -90 and 90.');
    if (!this.isValidLon(lon)) errors.push('Longitude must be between -180 and 180.');
    if (!this.isFiniteNumber(alt) || alt < 0) errors.push('Altitude must be a non-negative number.');

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    const payload: DeployedAircraft = {
      scenario: this.selectedScenario.id,
      aircraft_type: typeId,
      name: (this.newAircraftForm.name || '').trim(),
      initial_latitude: lat,
      initial_longitude: lon,
      initial_altitude_m: alt,
      planned_waypoints: [],
    };

    this.deploying = true;
    this.scenarioService.deployAircraft(payload).subscribe({
      next: (aircraft) => {
        this.deployedAircrafts = [...this.deployedAircrafts, aircraft];
        this.resetDeployForm();
      },
      error: (err) => {
        console.error('Failed to deploy aircraft', err);
        alert('Deployment failed.');
      },
      complete: () => (this.deploying = false),
    });
  }

  private resetDeployForm() {
    this.newAircraftForm = {
      aircraft_type: '',
      name: '',
      initial_latitude: '',
      initial_longitude: '',
      initial_altitude_m: '',
    };
  }

  // ===== Aircraft Editing =====
  startEditAircraft(ac: DeployedAircraft) {
    // Deep clone to avoid mutating the list item until save
    this.editingAircraft = JSON.parse(JSON.stringify(ac));
    this.waypointEditIndex = null;
    this.waypointForm = { lat: 0, lon: 0, alt: 0 };
    this.editorOpen = true;
  }

  cancelEditAircraft() {
    this.editingAircraft = null;
    this.waypointEditIndex = null;
  }

  saveAircraft() {
    if (!this.editingAircraft?.id) return;

    // Optional validation for waypoints & initial positions
    if (!this.isValidLat(this.editingAircraft.initial_latitude)) {
      alert('Initial latitude must be between -90 and 90.');
      return;
    }
    if (!this.isValidLon(this.editingAircraft.initial_longitude)) {
      alert('Initial longitude must be between -180 and 180.');
      return;
    }
    if (!this.isFiniteNumber(this.editingAircraft.initial_altitude_m) || this.editingAircraft.initial_altitude_m < 0) {
      alert('Initial altitude must be a non-negative number.');
      return;
    }

    // Validate each waypoint (if any)
    if (Array.isArray(this.editingAircraft.planned_waypoints)) {
      for (const wp of this.editingAircraft.planned_waypoints) {
        if (!this.isValidLat(wp.lat) || !this.isValidLon(wp.lon) || !this.isFiniteNumber(wp.alt)) {
          alert('One or more waypoints have invalid coordinates or altitude.');
          return;
        }
      }
    }

    this.savingAircraft = true;
    this.scenarioService.updateDeployedAircraft(this.editingAircraft.id, this.editingAircraft).subscribe({
      next: (updated) => {
        const idx = this.deployedAircrafts.findIndex((a) => a.id === updated.id);
        if (idx >= 0) {
          const next = [...this.deployedAircrafts];
          next[idx] = updated;
          this.deployedAircrafts = next;
        }
        this.editingAircraft = null;
        this.waypointEditIndex = null;
      },
      error: (err) => {
        console.error('Failed to save aircraft', err);
        alert('Failed to save aircraft.');
      },
      complete: () => (this.savingAircraft = false),
    });
  }

  // ===== Waypoints =====
  editWaypoint(index: number) {
    if (!this.editingAircraft?.planned_waypoints) return;
    const wp = this.editingAircraft.planned_waypoints[index];
    if (!wp) return;
    this.waypointEditIndex = index;
    this.waypointForm = { lat: wp.lat, lon: wp.lon, alt: wp.alt };
  }

  saveWaypoint() {
    if (!this.editingAircraft) return;

    const lat = this.toNumber(this.waypointForm.lat);
    const lon = this.toNumber(this.waypointForm.lon);
    const alt = this.toNumber(this.waypointForm.alt);

    if (!this.isValidLat(lat) || !this.isValidLon(lon) || !this.isFiniteNumber(alt)) {
      alert('Waypoint must have valid latitude (−90..90), longitude (−180..180), and numeric altitude.');
      return;
    }

    if (!Array.isArray(this.editingAircraft.planned_waypoints)) {
      this.editingAircraft.planned_waypoints = [];
    }

    const next = { lat, lon, alt };

    if (this.waypointEditIndex === null) {
      this.editingAircraft.planned_waypoints.push(next);
    } else {
      this.editingAircraft.planned_waypoints[this.waypointEditIndex] = next;
    }

    this.waypointForm = { lat: 0, lon: 0, alt: 0 };
    this.waypointEditIndex = null;
  }

  deleteWaypoint(index: number) {
    if (!this.editingAircraft?.planned_waypoints) return;
    this.editingAircraft.planned_waypoints.splice(index, 1);
  }

  // ===== Map picking glue (NEW) =====
  beginPick(mode: PickMode) {
    this.pickMode = mode;
    this.map?.startPointPicking();
  }

  cancelPick() {
    this.pickMode = 'none';
    this.map?.stopPointPicking();
  }

  handlePointPicked(coords: { lon: number; lat: number }) {
    const lat = +coords.lat.toFixed(6);
    const lon = +coords.lon.toFixed(6);

    if (this.pickMode === 'deploy-latlon') {
      this.newAircraftForm.initial_latitude = String(lat);
      this.newAircraftForm.initial_longitude = String(lon);
    } else if (this.pickMode === 'waypoint') {
      this.waypointForm.lat = lat;
      this.waypointForm.lon = lon;
    }

    // reset pick mode (one-shot)
    this.pickMode = 'none';
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.cancelPick();
  }

  // ===== trackBy helpers (perf) =====
  trackByScenarioId = (_: number, s: Scenario) => s.id;
  trackByAircraftId = (_: number, a: DeployedAircraft) => a.id;
  trackByWaypointIndex = (i: number) => i;

  // ===== Utils / validation =====
  private toNumber(v: unknown): number {
    const n = typeof v === 'string' ? Number(v.trim()) : Number(v);
    return Number.isFinite(n) ? n : NaN;
  }

  private isFiniteNumber(n: unknown): n is number {
    return typeof n === 'number' ? Number.isFinite(n) : Number.isFinite(this.toNumber(n));
  }

  private isValidLat(n: unknown): boolean {
    const v = this.toNumber(n);
    return Number.isFinite(v) && v >= -90 && v <= 90;
  }

  private isValidLon(n: unknown): boolean {
    const v = this.toNumber(n);
    return Number.isFinite(v) && v >= -180 && v <= 180;
  }
}
