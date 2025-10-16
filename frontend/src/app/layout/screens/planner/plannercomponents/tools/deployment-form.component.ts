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
  @Input() open = true;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() aircraftTypes: AircraftType[] = [];
  @Input() formValue: any = {};
  @Output() formValueChange = new EventEmitter<any>();

  @Input() deploying = false;
  @Output() requestPick = new EventEmitter<void>();
  @Output() deploy = new EventEmitter<void>();

  toggleOpen(v: boolean) { this.openChange.emit(v); }
}
