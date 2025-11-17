// src/app/layout/screens/planner/plannercomponents/tools/aircraft-editor.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type WaypointForm = {
  lat: number | null;
  lon: number | null;
  alt: number | null;
};

@Component({
  standalone: true,
  selector: 'app-aircraft-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './aircraft-editor.component.html',
  styleUrls: ['./aircraft-editor.component.css'],
})
export class AircraftEditorComponent {
  @Input() open = true;
  @Output() openChange = new EventEmitter<boolean>();

  /** Currently edited aircraft (from Planner / facade) */
  @Input() aircraft: any | null = null;

  /** Current waypoint form (lat/lon/alt nullable) */
  @Input() waypointForm: WaypointForm = { lat: null, lon: null, alt: null };
  @Output() waypointFormChange = new EventEmitter<WaypointForm>();

  /** Index of waypoint being edited (or null for new) */
  @Input() waypointEditIndex: number | null = null;

  /** Aircraft actions */
  @Output() saveAircraft = new EventEmitter<void>();
  @Output() cancelAircraft = new EventEmitter<void>();

  /** Waypoint actions */
  @Output() requestPickWaypoint = new EventEmitter<void>();
  @Output() editWaypoint = new EventEmitter<number>();
  @Output() deleteWaypoint = new EventEmitter<number>();
  @Output() saveWaypoint = new EventEmitter<void>();

  /** Initial aircraft position pick from map */
  @Output() requestPickInitial = new EventEmitter<void>();

  toggleOpen(v: boolean) {
    this.open = v;
    this.openChange.emit(v);
  }

  /** Angular-safe update (no spread operator in template) */
  updateField(field: keyof WaypointForm, value: any) {


    let v: any = value;

    // convert "", null, undefined → null
    if (v === '' || v === null || v === undefined) {
      v = null;
    }

    // convert numeric strings → number
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v);
      v = Number.isFinite(n) ? n : null;
    }

    const updated: WaypointForm = {
      ...this.waypointForm,
      [field]: v,
    };



    this.waypointForm = updated;
    this.waypointFormChange.emit(updated);
  }

  resetWpForm() {
    const reset: WaypointForm = { lat: null, lon: null, alt: null };
    this.waypointForm = reset;
    this.waypointFormChange.emit(reset);
  }
}
