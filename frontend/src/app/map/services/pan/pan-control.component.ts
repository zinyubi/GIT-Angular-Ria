import { Component, Input } from '@angular/core';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { createPoint } from '@luciad/ria/shape/ShapeFactory.js';

@Component({
  selector: 'app-pan-control',
  templateUrl: './pan-control.component.html',
  styleUrls: ['./pan-control.component.css']
})
export class PanControlComponent {
  @Input() map!: WebGLMap;

  pan(xRatio: number, yRatio: number): void {
    if (!this.map) return;
    this.map.mapNavigator.pan({
      targetLocation: createPoint(null, [
        this.map.viewSize[0] * xRatio,
        this.map.viewSize[1] * yRatio
      ]),
      animate: { duration: 250 }
    });
  }
}
