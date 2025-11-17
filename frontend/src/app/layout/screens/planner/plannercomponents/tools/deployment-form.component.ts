// src/app/layout/screens/planner/plannercomponents/tools/deployment-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AircraftType } from '../../../../../core/auth/services/scenario.service';

@Component({
  standalone: true,
  selector: 'app-deployment-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './deployment-form.component.html',
  styleUrls: ['./deployment-form.component.css'],
})
export class DeploymentFormComponent {
  /** Accordion open / close, controlled by PlannerComponent */
  @Input() open = true;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() aircraftTypes: AircraftType[] = [];

  @Input() formValue: {
    aircraft_type: string | number;
    name: string;
    initial_latitude: string | number;
    initial_longitude: string | number;
    initial_altitude_m: string | number;
  } = {
    aircraft_type: '',
    name: '',
    initial_latitude: '',
    initial_longitude: '',
    initial_altitude_m: '',
  };

  @Output() formValueChange = new EventEmitter<typeof this.formValue>();

  @Input() deploying = false;
  @Output() requestPick = new EventEmitter<void>();
  @Output() deploy = new EventEmitter<void>();

  toggleOpen(v: boolean) {
    this.open = v;
    this.openChange.emit(v);
  }
}
