import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponentRia } from '../../../../../luciadmaps/components/map/map.component.ria';

@Component({
  standalone: true,
  selector: 'app-map-panel',
  imports: [CommonModule, MapComponentRia],
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.css'],
})
export class MapPanelComponent {
  @ViewChild(MapComponentRia) map?: MapComponentRia;
  @Output() pointPicked = new EventEmitter<{ lon: number; lat: number }>();

  startPointPicking() { this.map?.startPointPicking(); }
  stopPointPicking() { this.map?.stopPointPicking(); }
  onPointPicked(evt: { lon: number; lat: number }) { this.pointPicked.emit(evt); }
}
