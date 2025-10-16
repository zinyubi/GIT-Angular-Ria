// src/app/layout/screens/planner/plannercomponents/facades/deployment.facade.ts
import { Injectable } from '@angular/core';
import { PlannerState } from '../state/planner.state';
import { ScenarioService, DeployedAircraft } from '../../../../../core/auth/services/scenario.service';

@Injectable({ providedIn: 'root' })
export class DeploymentFacade {
  constructor(private s: PlannerState, private api: ScenarioService) {}

  private num(v: unknown): number {
    if (v === null || v === undefined) return NaN;
    const s = String(v).trim().replace(/\u2212/g, '-').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  loadAircraftTypes() {
    this.s.loadingTypes$.next(true);
    this.api.getAircraftTypes().subscribe({
      next: types => this.s.aircraftTypes$.next(types ?? []),
      error: err => console.error('Failed to load aircraft types', err),
      complete: () => this.s.loadingTypes$.next(false),
    });
  }

  loadDeployedAircrafts() {
    const id = this.s.selectedScenario$.value?.id;
    if (!id) return;
    this.s.loadingDeployed$.next(true);
    this.api.getDeployedAircrafts(id).subscribe({
      next: acs => this.s.deployedAircrafts$.next(acs ?? []),
      error: err => console.error('Failed to load deployed aircrafts', err),
      complete: () => this.s.loadingDeployed$.next(false),
    });
  }

  deployAircraft() {
    const sel = this.s.selectedScenario$.value;
    if (!sel?.id) return;

    const f = this.s.newAircraftForm$.value;
    const typeId = this.num(f.aircraft_type);
    const lat = this.num(f.initial_latitude);
    const lon = this.num(f.initial_longitude);
    const alt = this.num(f.initial_altitude_m);

    const errors: string[] = [];
    if (!typeId) errors.push('Select an aircraft type.');
    if (!(Number.isFinite(lat) && lat >= -90 && lat <= 90)) errors.push('Latitude must be between -90 and 90.');
    if (!(Number.isFinite(lon) && lon >= -180 && lon <= 180)) errors.push('Longitude must be between -180 and 180.');
    if (!(Number.isFinite(alt) && alt >= 0)) errors.push('Altitude must be a non-negative number.');
    if (errors.length) { alert(errors.join('\n')); return; }

    const payload: DeployedAircraft = {
      scenario: sel.id,
      aircraft_type: typeId,
      name: (f.name || '').trim(),
      initial_latitude: lat,
      initial_longitude: lon,
      initial_altitude_m: alt,
      planned_waypoints: [],
    };

    this.s.deploying$.next(true);
    this.api.deployAircraft(payload).subscribe({
      next: ac => this.s.deployedAircrafts$.next([...this.s.deployedAircrafts$.value, ac]),
      error: err => { console.error('Failed to deploy aircraft', err); alert('Deployment failed.'); },
      complete: () => { this.s.deploying$.next(false); this.s.resetDeployForm(); },
    });
  }
}
