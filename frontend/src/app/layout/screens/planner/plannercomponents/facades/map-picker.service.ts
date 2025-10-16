import { Injectable } from '@angular/core';

export type PickMode = 'none' | 'deploy-latlon' | 'waypoint';

@Injectable({ providedIn: 'root' })
export class MapPickerService {
  pickMode: PickMode = 'none';

  begin(mode: PickMode) { this.pickMode = mode; }
  cancel() { this.pickMode = 'none'; }

  apply(
    coords: { lon: number; lat: number },
    writeDeploy: (lat: string, lon: string) => void,
    writeWaypoint: (lat: number, lon: number) => void,
  ) {
    const lat = +coords.lat.toFixed(6);
    const lon = +coords.lon.toFixed(6);
    if (this.pickMode === 'deploy-latlon') writeDeploy(String(lat), String(lon));
    else if (this.pickMode === 'waypoint') writeWaypoint(lat, lon);
    this.pickMode = 'none';
  }
}
