import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeployedAircraft, AircraftType } from '../../../../../core/auth/services/scenario.service';

@Component({
  standalone: true,
  selector: 'app-deployed-aircraft-list',
  imports: [CommonModule],
  templateUrl: './deployed-aircraft-list.component.html',
  styleUrls: ['./deployed-aircraft-list.component.css'],
})
export class DeployedAircraftListComponent {
  @Input() aircrafts: DeployedAircraft[] = [];
  @Output() edit = new EventEmitter<DeployedAircraft>();

  trackByAircraftId = (_: number, a: DeployedAircraft) => a.id!;

  getTypeName(ac: DeployedAircraft): string | number {
    const t = ac.aircraft_type as any;
    return t && typeof t === 'object' ? (t.name ?? 'Type') : (t ?? '');
  }
  getLat(ac: DeployedAircraft): number | string {
    return ac.position?.latitude ?? ac.initial_latitude ?? '';
  }
  getLon(ac: DeployedAircraft): number | string {
    return ac.position?.longitude ?? ac.initial_longitude ?? '';
  }
  getAlt(ac: DeployedAircraft): number | string {
    return ac.position?.altitude_m ?? ac.initial_altitude_m ?? '';
  }
}
