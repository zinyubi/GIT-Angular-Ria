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
  @Input() aircrafts: DeployedAircraft[] | null | undefined = [];

  @Output() edit = new EventEmitter<DeployedAircraft>();
  @Output() remove = new EventEmitter<DeployedAircraft>();

  /** Whether the accordion is open */
  @Input() open = true;
  @Output() openChange = new EventEmitter<boolean>();

  toggleOpen(val: boolean) {
    this.open = val;
    this.openChange.emit(val);
  }

  trackByAircraftId = (_: number, a: DeployedAircraft) => a.id!;

  getTypeName(ac: DeployedAircraft): string | number {
    const t = ac.aircraft_type as AircraftType | any;
    return t && typeof t === 'object' ? (t.name ?? 'Type') : (t ?? '');
  }

  getLat(ac: DeployedAircraft): string {
    const v = ac.position?.latitude ?? ac.initial_latitude;
    return typeof v === 'number' ? v.toFixed(3) : '—';
  }

  getLon(ac: DeployedAircraft): string {
    const v = ac.position?.longitude ?? ac.initial_longitude;
    return typeof v === 'number' ? v.toFixed(3) : '—';
  }

  getAlt(ac: DeployedAircraft): string {
    const v = ac.position?.altitude_m ?? ac.initial_altitude_m;
    return typeof v === 'number' ? `${v.toFixed(0)}` : '—';
  }
}
