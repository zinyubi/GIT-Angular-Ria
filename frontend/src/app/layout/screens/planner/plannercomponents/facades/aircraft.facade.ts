// src/app/layout/screens/planner/plannercomponents/facades/aircraft.facade.ts
import { Injectable } from '@angular/core';
import { PlannerState } from '../state/planner.state';
import { ScenarioService, DeployedAircraft, AircraftType } from '../../../../../core/auth/services/scenario.service';

@Injectable({ providedIn: 'root' })
export class AircraftFacade {
  constructor(private s: PlannerState, private api: ScenarioService) {}

  private num(v: unknown): number {
    if (v === null || v === undefined) return NaN;
    const s = String(v).trim().replace(/\u2212/g, '-').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  startEdit(ac: DeployedAircraft) {
    const clone: DeployedAircraft = JSON.parse(JSON.stringify(ac));

    // If list serializer did not include initial_* fields, derive them from position
    if (clone.position) {
      if (clone.initial_latitude === undefined) clone.initial_latitude = clone.position.latitude;
      if (clone.initial_longitude === undefined) clone.initial_longitude = clone.position.longitude;
      if (clone.initial_altitude_m === undefined) clone.initial_altitude_m = clone.position.altitude_m;
    }

    this.s.editingAircraft$.next(clone);
    this.s.waypointEditIndex$.next(null);
    this.s.waypointForm$.next({ lat: 0, lon: 0, alt: '' as any });
  }

  cancelEdit() {
    this.s.editingAircraft$.next(null);
    this.s.waypointEditIndex$.next(null);
  }

  saveAircraft() {
    const ac = this.s.editingAircraft$.value;
    if (!ac?.id) return;

    const lat = this.num(ac.initial_latitude);
    const lon = this.num(ac.initial_longitude);
    const alt = this.num(ac.initial_altitude_m);

    if (!(Number.isFinite(lat) && lat >= -90 && lat <= 90)) { alert('Initial latitude must be between -90 and 90.'); return; }
    if (!(Number.isFinite(lon) && lon >= -180 && lon <= 180)) { alert('Initial longitude must be between -180 and 180.'); return; }
    if (!(Number.isFinite(alt) && alt >= 0)) { alert('Initial altitude must be a non-negative number.'); return; }

    // Waypoint validation (alt optional)
    const wps = Array.isArray(ac.planned_waypoints) ? [...ac.planned_waypoints] : [];
    for (const wp of wps) {
      const wlat = this.num(wp.lat);
      const wlon = this.num(wp.lon);
      const hasAlt = (wp as any).alt !== undefined && (wp as any).alt !== null && String((wp as any).alt).trim() !== '';
      const walt = hasAlt ? this.num((wp as any).alt) : undefined;

      if (!(Number.isFinite(wlat) && wlat >= -90 && wlat <= 90) ||
          !(Number.isFinite(wlon) && wlon >= -180 && wlon <= 180)) {
        alert('One or more waypoints have invalid latitude/longitude.');
        return;
      }
      if (hasAlt && !Number.isFinite(walt)) {
        alert('Waypoint altitude must be numeric if provided.');
        return;
      }
      if (!hasAlt) delete (wp as any).alt; else (wp as any).alt = walt!;
    }

    // aircraft_type id for update serializer
    const aircraft_type =
      typeof ac.aircraft_type === 'number'
        ? ac.aircraft_type
        : (ac.aircraft_type as AircraftType)?.id;

    const payload: Partial<DeployedAircraft> = {
      name: ac.name || '',
      scenario: ac.scenario,
      aircraft_type: aircraft_type as number,
      initial_latitude: lat,
      initial_longitude: lon,
      initial_altitude_m: alt,
      planned_waypoints: wps,
    };

    this.s.savingAircraft$.next(true);
    this.api.updateDeployedAircraft(ac.id!, payload).subscribe({
      next: updated => {
        const arr = [...this.s.deployedAircrafts$.value];
        const idx = arr.findIndex(a => a.id === updated.id);
        if (idx >= 0) { arr[idx] = updated; this.s.deployedAircrafts$.next(arr); }
        this.s.editingAircraft$.next(null);
        this.s.waypointEditIndex$.next(null);
      },
      error: err => { console.error('Failed to save aircraft', err); alert('Failed to save aircraft.'); },
      complete: () => this.s.savingAircraft$.next(false),
    });
  }

  editWaypoint(index: number) {
    const ac = this.s.editingAircraft$.value;
    if (!ac?.planned_waypoints) return;
    const wp = ac.planned_waypoints[index];
    if (!wp) return;
    this.s.waypointEditIndex$.next(index);
    this.s.waypointForm$.next({ lat: wp.lat, lon: wp.lon, alt: (wp as any).alt ?? '' });
  }

  saveWaypoint() {
    const ac = this.s.editingAircraft$.value;
    const f: any = this.s.waypointForm$.value;
    if (!ac) return;

    const lat = this.num(f.lat), lon = this.num(f.lon);
    const hasAlt = f.alt !== undefined && f.alt !== null && String(f.alt).trim() !== '';
    const alt = hasAlt ? this.num(f.alt) : undefined;

    if (!(Number.isFinite(lat) && lat >= -90 && lat <= 90) ||
        !(Number.isFinite(lon) && lon >= -180 && lon <= 180)) {
      alert('Waypoint must have valid latitude (−90..90) and longitude (−180..180).');
      return;
    }
    if (hasAlt && !Number.isFinite(alt)) {
      alert('Waypoint altitude must be numeric if provided.');
      return;
    }

    if (!Array.isArray(ac.planned_waypoints)) ac.planned_waypoints = [];
    const next = hasAlt ? { lat, lon, alt } : { lat, lon };

    const idx = this.s.waypointEditIndex$.value;
    if (idx === null) ac.planned_waypoints.push(next as any);
    else ac.planned_waypoints[idx] = next as any;

    this.s.waypointForm$.next({ lat: 0, lon: 0, alt: '' as any });
    this.s.waypointEditIndex$.next(null);
    this.s.editingAircraft$.next({ ...ac });
  }

  deleteWaypoint(index: number) {
    const ac = this.s.editingAircraft$.value;
    if (!ac?.planned_waypoints) return;
    ac.planned_waypoints.splice(index, 1);
    this.s.editingAircraft$.next({ ...ac });
  }
}
