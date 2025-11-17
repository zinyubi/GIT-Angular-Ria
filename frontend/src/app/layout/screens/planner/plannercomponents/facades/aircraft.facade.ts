// src/app/layout/screens/planner/plannercomponents/facades/aircraft.facade.ts
import { Injectable } from '@angular/core';
import { PlannerState } from '../state/planner.state';
import {
  ScenarioService,
  DeployedAircraft,
  AircraftType,
} from '../../../../../core/auth/services/scenario.service';

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
      if (clone.initial_latitude === undefined)
        clone.initial_latitude = clone.position.latitude;
      if (clone.initial_longitude === undefined)
        clone.initial_longitude = clone.position.longitude;
      if (clone.initial_altitude_m === undefined)
        clone.initial_altitude_m = clone.position.altitude_m;
    }

    this.s.editingAircraft$.next(clone);
    this.s.waypointEditIndex$.next(null);

    // ✅ keep form clean & nullable
    this.s.waypointForm$.next({ lat: null, lon: null, alt: null });
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

    if (!(Number.isFinite(lat) && lat >= -90 && lat <= 90)) {
      alert('Initial latitude must be between -90 and 90.');
      return;
    }
    if (!(Number.isFinite(lon) && lon >= -180 && lon <= 180)) {
      alert('Initial longitude must be between -180 and 180.');
      return;
    }
    if (!(Number.isFinite(alt) && alt >= 0)) {
      alert('Initial altitude must be a non-negative number.');
      return;
    }

    // Waypoint validation (alt optional per waypoint)
    const wps = Array.isArray(ac.planned_waypoints)
      ? [...ac.planned_waypoints]
      : [];

    for (const wp of wps) {
      const wlat = this.num(wp.lat);
      const wlon = this.num(wp.lon);

      const rawAlt = (wp as any).alt;
      const hasAlt = rawAlt !== null && rawAlt !== undefined && rawAlt !== "";

      const walt = hasAlt ? this.num(rawAlt) : null;

      if (
        !(Number.isFinite(wlat) && wlat >= -90 && wlat <= 90) ||
        !(Number.isFinite(wlon) && wlon >= -180 && wlon <= 180)
      ) {
        alert('One or more waypoints have invalid latitude/longitude.');
        return;
      }

      if (hasAlt && !Number.isFinite(walt)) {
        alert('Waypoint altitude must be numeric if provided.');
        return;
      }

      // ✅ normalize: either numeric alt or no alt property
      if (!hasAlt) {
        delete (wp as any).alt;
      } else {
        (wp as any).alt = walt!;
      }
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
        if (idx >= 0) {
          arr[idx] = updated;
          this.s.deployedAircrafts$.next(arr);
        }
        this.s.editingAircraft$.next(null);
        this.s.waypointEditIndex$.next(null);
      },
      error: err => {
        console.error('Failed to save aircraft', err);
        alert('Failed to save aircraft.');
      },
      complete: () => this.s.savingAircraft$.next(false),
    });
  }

  editWaypoint(index: number) {
    const ac = this.s.editingAircraft$.value;
    if (!ac?.planned_waypoints) return;
    const wp = ac.planned_waypoints[index];
    if (!wp) return;

    this.s.waypointEditIndex$.next(index);

    // ✅ alt is kept as number | null | undefined, no magic 0
    this.s.waypointForm$.next({
      lat: wp.lat ?? null,
      lon: wp.lon ?? null,
      alt: (wp as any).alt ?? null,
    });
  }

  saveWaypoint() {
    const ac = this.s.editingAircraft$.value;
    const f: any = this.s.waypointForm$.value;
    if (!ac) return;

    const lat = this.num(f.lat);
    const lon = this.num(f.lon);

    const rawAlt = f.alt;
    const hasAlt =
      rawAlt !== undefined &&
      rawAlt !== null &&
      String(rawAlt).trim() !== '';

    const alt = hasAlt ? this.num(rawAlt) : null;

    // Validate lat/lon
    if (
      !(Number.isFinite(lat) && lat >= -90 && lat <= 90) ||
      !(Number.isFinite(lon) && lon >= -180 && lon <= 180)
    ) {
      alert(
        'Waypoint must have valid latitude (−90..90) and longitude (−180..180).',
      );
      return;
    }

    // Validate altitude if provided
    if (hasAlt && !Number.isFinite(alt)) {
      alert('Waypoint altitude must be numeric if provided.');
      return;
    }

    if (!Array.isArray(ac.planned_waypoints)) ac.planned_waypoints = [];

    // ✅ Only include alt when provided; otherwise keep it 2D
    const next: any = { lat, lon };
    if (hasAlt) {
      next.alt = alt;
    }

    const idx = this.s.waypointEditIndex$.value;
    if (idx === null) {
      ac.planned_waypoints.push(next);
    } else {
      ac.planned_waypoints[idx] = next;
    }

    // ✅ Reset to nulls, not 0 / ''
    this.s.waypointForm$.next({ lat: null, lon: null, alt: null });
    this.s.waypointEditIndex$.next(null);
    this.s.editingAircraft$.next({ ...ac });
  }

  deleteWaypoint(index: number) {
    const ac = this.s.editingAircraft$.value;
    if (!ac?.planned_waypoints) return;
    ac.planned_waypoints.splice(index, 1);
    this.s.editingAircraft$.next({ ...ac });
  }

  // ========= NEW: delete deployed aircraft =========
  deleteAircraft(ac: DeployedAircraft) {
    if (!ac?.id) {
      return;
    }

    const ok = confirm(
      `Remove aircraft "${ac.name || ac.id}" from this scenario?`,
    );
    if (!ok) return;

    this.s.savingAircraft$.next(true);

    this.api.deleteDeployedAircraft(ac.id).subscribe({
      next: () => {
        const current = this.s.deployedAircrafts$.value;
        const updated = current.filter(a => a.id !== ac.id);
        this.s.deployedAircrafts$.next(updated);

        if (this.s.editingAircraft$.value?.id === ac.id) {
          this.s.editingAircraft$.next(null);
          this.s.waypointEditIndex$.next(null);
        }
      },
      error: err => {
        console.error('Failed to delete aircraft', err);
        alert('Failed to delete aircraft.');
      },
      complete: () => this.s.savingAircraft$.next(false),
    });
  }
}
