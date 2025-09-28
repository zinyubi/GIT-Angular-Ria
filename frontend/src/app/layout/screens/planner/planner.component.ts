import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-primary',
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

  // ===== Center (tools) data =====
  aircraftTypes: AircraftType[] = [];
  deployedAircrafts: DeployedAircraft[] = [];

  // Accordion state
  deployOpen = true;
  editorOpen = false;

  // Deployment form
  newAircraftForm = {
    aircraft_type: '',        // type id as string; cast to number on submit
    name: '',
    initial_latitude: '',
    initial_longitude: '',
    initial_altitude_m: 0,
  };

  // Aircraft editing + waypoints
  editingAircraft: DeployedAircraft | null = null;
  waypointEditIndex: number | null = null;
  waypointForm: Waypoint = { lat: 0, lon: 0, alt: 0 };

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
    this.scenarioService.getAircraftTypes().subscribe({
      next: (types) => (this.aircraftTypes = types ?? []),
      error: (err) => console.error('Failed to load aircraft types', err),
    });
  }

  loadDeployedAircrafts() {
    if (!this.selectedScenario?.id) return;
    this.scenarioService.getDeployedAircrafts(this.selectedScenario.id).subscribe({
      next: (aircrafts) => (this.deployedAircrafts = aircrafts ?? []),
      error: (err) => console.error('Failed to load deployed aircrafts', err),
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
    // Editing the selected scenario's meta
    if (!this.selectedScenario) return;
    this.editing = true;
  }

  handleCancelEditScenario() {
    this.editing = false;
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
  }

  handleSaveScenario() {
    this.scenarioError = '';

    if (!this.form.name?.trim()) {
      this.scenarioError = 'Scenario name is required.';
      return;
    }

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
    });
  }

  // ===== Deployment =====
  handleDeployAircraft() {
    if (!this.selectedScenario?.id) return;

    const payload: DeployedAircraft = {
      scenario: this.selectedScenario.id,
      aircraft_type: Number(this.newAircraftForm.aircraft_type),
      name: this.newAircraftForm.name,
      initial_latitude: Number(this.newAircraftForm.initial_latitude),
      initial_longitude: Number(this.newAircraftForm.initial_longitude),
      initial_altitude_m: Number(this.newAircraftForm.initial_altitude_m),
      planned_waypoints: [],
    };

    this.scenarioService.deployAircraft(payload).subscribe({
      next: (aircraft) => {
        this.deployedAircrafts = [...this.deployedAircrafts, aircraft];
        this.newAircraftForm = {
          aircraft_type: '',
          name: '',
          initial_latitude: '',
          initial_longitude: '',
          initial_altitude_m: 0,
        };
      },
      error: (err) => {
        console.error('Failed to deploy aircraft', err);
        alert('Deployment failed.');
      },
    });
  }

  // ===== Aircraft Editing =====
  startEditAircraft(ac: DeployedAircraft) {
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

    if (!this.editingAircraft.planned_waypoints) {
      this.editingAircraft.planned_waypoints = [];
    }

    if (this.waypointEditIndex === null) {
      this.editingAircraft.planned_waypoints.push({ ...this.waypointForm });
    } else {
      this.editingAircraft.planned_waypoints[this.waypointEditIndex] = { ...this.waypointForm };
    }

    this.waypointForm = { lat: 0, lon: 0, alt: 0 };
    this.waypointEditIndex = null;
  }

  deleteWaypoint(index: number) {
    if (!this.editingAircraft?.planned_waypoints) return;
    this.editingAircraft.planned_waypoints.splice(index, 1);
  }
}
