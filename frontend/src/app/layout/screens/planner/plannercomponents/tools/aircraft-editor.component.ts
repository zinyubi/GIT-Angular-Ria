// src/app/layout/screens/planner/plannercomponents/tools/aircraft-editor.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeployedAircraft } from '../../../../../core/auth/services/scenario.service';

@Component({
  standalone: true,
  selector: 'app-aircraft-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './aircraft-editor.component.html',
  styleUrls: ['./aircraft-editor.component.css'],
})
export class AircraftEditorComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() aircraft: DeployedAircraft | null = null;

  @Input() waypointForm: { lat: number; lon: number; alt: number | '' } = { lat: 0, lon: 0, alt: '' };
  @Output() waypointFormChange = new EventEmitter<{ lat: number; lon: number; alt: number | '' }>();

  @Input() waypointEditIndex: number | null = null;

  @Output() saveAircraft = new EventEmitter<void>();
  @Output() cancelAircraft = new EventEmitter<void>();

  @Output() requestPickWaypoint = new EventEmitter<void>();
  @Output() requestPickInitial = new EventEmitter<void>();
  @Output() editWaypoint = new EventEmitter<number>();
  @Output() deleteWaypoint = new EventEmitter<number>();
  @Output() saveWaypoint = new EventEmitter<void>();

  toggleOpen(v: boolean) { this.openChange.emit(v); }

  resetWpForm() {
    this.waypointForm = { lat: 0, lon: 0, alt: '' };
    this.waypointFormChange.emit(this.waypointForm);
  }
}
