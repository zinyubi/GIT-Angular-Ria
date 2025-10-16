import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Scenario, AircraftType, DeployedAircraft } from '../../../../../core/auth/services/scenario.service';

export interface Waypoint { lat: number; lon: number; alt: number; }

@Injectable({ providedIn: 'root' })
export class PlannerState {
  // Sidebar
  readonly scenarios$ = new BehaviorSubject<Scenario[]>([]);
  readonly selectedScenario$ = new BehaviorSubject<Scenario | null>(null);
  readonly editing$ = new BehaviorSubject<boolean>(false);
  readonly form$ = new BehaviorSubject<{ name: string; description: string }>({ name: '', description: '' });
  readonly scenarioError$ = new BehaviorSubject<string>('');
  readonly sidebarCollapsed$ = new BehaviorSubject<boolean>(true);

  // Tools
  readonly aircraftTypes$ = new BehaviorSubject<AircraftType[]>([]);
  readonly deployedAircrafts$ = new BehaviorSubject<DeployedAircraft[]>([]);

  // Flags
  readonly loadingScenarios$ = new BehaviorSubject<boolean>(false);
  readonly loadingTypes$ = new BehaviorSubject<boolean>(false);
  readonly loadingDeployed$ = new BehaviorSubject<boolean>(false);
  readonly savingScenario$ = new BehaviorSubject<boolean>(false);
  readonly deploying$ = new BehaviorSubject<boolean>(false);
  readonly savingAircraft$ = new BehaviorSubject<boolean>(false);

  // Editor
  readonly editingAircraft$ = new BehaviorSubject<DeployedAircraft | null>(null);
  readonly waypointEditIndex$ = new BehaviorSubject<number | null>(null);
  readonly waypointForm$ = new BehaviorSubject<Waypoint>({ lat: 0, lon: 0, alt: 0 });

  // Deploy form
  readonly newAircraftForm$ = new BehaviorSubject<any>({
    aircraft_type: '', name: '',
    initial_latitude: '', initial_longitude: '',
    initial_altitude_m: ''
  });

  resetDeployForm() {
    this.newAircraftForm$.next({
      aircraft_type: '', name: '',
      initial_latitude: '', initial_longitude: '',
      initial_altitude_m: ''
    });
  }
}
