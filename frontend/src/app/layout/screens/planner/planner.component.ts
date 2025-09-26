import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../../../map/map.component'; 
import { ScenarioService, Scenario } from '../../../core/auth/services/scenario.service'; // import your service and interface
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-primary',
  imports: [MapComponent, CommonModule, FormsModule], 
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent implements OnInit {
  scenarios: Scenario[] = [];
  selectedScenario: Scenario | null = null;
  editing = false;

  form = { name: '', description: '' };
  scenarioError = '';

  // Comment out unused aircraft properties
  /*
  aircraftTypes: AircraftType[] = [];
  aircraftInstances: AircraftInstance[] = [];
  */

  // Comment out aircraft editing properties
  /*
  editingAircraftIdx: number | 'add' | null = null;
  acForm: any = {
    aircraft: '',
    name: '',
    initial_lat: '',
    initial_lon: '',
    planned_waypoints: [],
    id: null,
  };

  isPlottingInitial = false;
  isPlottingWaypoint = false;
  */

  constructor(private scenarioService: ScenarioService) {}

  ngOnInit() {
    this.loadScenarios();

    // Comment out
    // this.loadAircraftTypes();
  }

  loadScenarios() {
    this.scenarioService.getAllScenarios()
      .pipe(
        catchError(err => {
          console.error('Failed to load scenarios', err);
          return of([]); // fallback to empty list
        })
      )
      .subscribe(scenarios => {
        this.scenarios = scenarios;
      });
  }

  // Comment out aircraft loading methods
  /*
  loadAircraftTypes() {
    if (!this.token) return;
    this.http
      .get<AircraftType[]>(API_URLS.AIRCRAFTS, this.getAuthHeaders())
      .subscribe((res) => {
        this.aircraftTypes = res;
      });
  }

  loadAircraftInstances() {
    if (!this.token || !this.selectedScenario) {
      this.aircraftInstances = [];
      return;
    }
    const url = `${API_URLS.AIRCRAFT_INSTANCES}?scenario=${this.selectedScenario.id}`;
    this.http
      .get<AircraftInstance[]>(url, this.getAuthHeaders())
      .subscribe((res) => {
        this.aircraftInstances = res;
      });
  }
  */

  handleSelect(s: Scenario) {
    this.selectedScenario = s;
    this.editing = false;
    this.form = { name: s.name, description: s.description || '' };

    // Comment out aircraft related reset
    /*
    this.editingAircraftIdx = null;
    this.acForm = {
      aircraft: '',
      name: '',
      initial_lat: '',
      initial_lon: '',
      planned_waypoints: [],
      id: null,
    };
    this.isPlottingInitial = false;
    this.isPlottingWaypoint = false;
    this.loadAircraftInstances();
    */
  }

  handleEditScenario() {
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
    if (!window.confirm('Delete this scenario?')) return;

    if (!s.id) return;

    this.scenarioService.deleteScenario(s.id)
      .subscribe({
        next: () => {
          this.scenarios = this.scenarios.filter(x => x.id !== s.id);
          this.selectedScenario = null;
          this.editing = false;

          // Comment out aircraft reset
          // this.editingAircraftIdx = null;
        },
        error: (err) => {
          console.error('Failed to delete scenario', err);
          alert('Failed to delete scenario.');
        }
      });
  }

  handleCreateScenario() {
    this.form = { name: '', description: '' };
    this.editing = true;
    this.selectedScenario = null;
  }

  handleSaveScenario() {
    this.scenarioError = '';

    if (!this.form.name) {
      this.scenarioError = 'Scenario name is required.';
      return;
    }

    if (this.editing && this.selectedScenario && this.selectedScenario.id) {
      this.scenarioService.updateScenario(this.selectedScenario.id, this.form)
        .subscribe({
          next: (updatedScenario) => {
            this.scenarios = this.scenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s);
            this.selectedScenario = updatedScenario;
            this.editing = false;
          },
          error: (err) => {
            console.error('Failed to update scenario', err);
            this.scenarioError = err.message || 'Failed to save scenario.';
          }
        });
    } else {
      this.scenarioService.createScenario(this.form)
        .subscribe({
          next: (newScenario) => {
            this.scenarios = [...this.scenarios, newScenario];
            this.selectedScenario = newScenario;
            this.editing = false;

            // Comment out aircraft load
            // this.loadAircraftInstances();
          },
          error: (err) => {
            console.error('Failed to create scenario', err);
            this.scenarioError = err.message || 'Failed to create scenario.';
          }
        });
    }
  }

  // Comment out all aircraft-related methods for now
  /*
  handleStartAddAircraft() { ... }
  handleAircraftEdit(idx: number) { ... }
  handleAcFormChange(field: string, value: any) { ... }
  handleCancelAircraftEdit() { ... }
  handleDeleteWaypoint(idx: number) { ... }
  handleSaveAircraft() { ... }
  handleDeleteAircraft(idx: number) { ... }
  onMapClick(lat: number, lon: number) { ... }
  getAllMarkers() { ... }
  */
}
