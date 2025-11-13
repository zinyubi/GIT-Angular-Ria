import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-aircraft-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './aircraft-editor.component.html',
  styleUrls: ['./aircraft-editor.component.css'],
})
export class AircraftEditorComponent {
  /** Panel accordion state */
  @Input() open = true;
  @Output() openChange = new EventEmitter<boolean>();

  /** Current aircraft being edited */
  @Input() aircraft: any | null = null;

  /** Waypoint edit form (lat, lon, alt) */
  @Input() waypointForm: { lat: number | null; lon: number | null; alt?: number | null } = {
    lat: null,
    lon: null,
    alt: null,
  };
  @Output() waypointFormChange = new EventEmitter<typeof this.waypointForm>();

  /** Index of the waypoint being edited (if any) */
  @Input() waypointEditIndex: number | null = null;

  /** Editor events */
  @Output() saveAircraft = new EventEmitter<void>();
  @Output() cancelAircraft = new EventEmitter<void>();

  /** Waypoint events */
  @Output() requestPickWaypoint = new EventEmitter<void>();
  @Output() editWaypoint = new EventEmitter<number>();
  @Output() deleteWaypoint = new EventEmitter<number>();
  @Output() saveWaypoint = new EventEmitter<void>();

  /** Initial-position pick (from map) */
  @Output() requestPickInitial = new EventEmitter<void>();

  /** “Advanced position” collapse toggle */
  showPosAdvanced = false;

  toggleOpen(v: boolean) {
    this.open = v;
    this.openChange.emit(v);
  }
  isValueNaN(val: any): boolean {
  return isNaN(Number(val));
}

  resetWpForm() {
    this.waypointForm = { lat: null, lon: null, alt: null };
    this.waypointFormChange.emit(this.waypointForm);
  }
}
