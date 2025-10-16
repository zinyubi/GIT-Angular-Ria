import { Component, Input, OnDestroy } from '@angular/core';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { createPoint } from '@luciad/ria/shape/ShapeFactory.js';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ria-pancontrol',
  imports: [CommonModule],
  templateUrl: './pan-control.component.ria.html',
  styleUrls: ['./pan-control.component.ria.css']
})
export class PanControlComponentRia implements OnDestroy {
  @Input() map?: WebGLMap;

  private holdTimerId: any = null;

  /** Single pan step toward a view point, given as ratios of view size. */
  panToRatio(xRatio: number, yRatio: number): void {
    const map = this.map;
    if (!map) return;
    const x = map.viewSize[0] * xRatio;
    const y = map.viewSize[1] * yRatio;
    map.mapNavigator.pan({
      targetLocation: createPoint(null, [x, y]),
      animate: { duration: 250 }
    });
  }

  /** Start repeating the pan while the button is held. Also triggers one immediate step. */
  startRepeat(xRatio: number, yRatio: number): void {
    this.stopRepeat();
    this.panToRatio(xRatio, yRatio);
    this.holdTimerId = setInterval(() => this.panToRatio(xRatio, yRatio), 160);
  }

  /** Stop the repeating pan. */
  stopRepeat(): void {
    if (this.holdTimerId) {
      clearInterval(this.holdTimerId);
      this.holdTimerId = null;
    }
  }

  // Convenience wrappers for template binding
  startUp()    { this.startRepeat(1/2, 1/4); }
  startDown()  { this.startRepeat(1/2, 3/4); }
  startLeft()  { this.startRepeat(1/4, 1/2); }
  startRight() { this.startRepeat(3/4, 1/2); }

  clickUp()    { this.panToRatio(1/2, 1/4); }
  clickDown()  { this.panToRatio(1/2, 3/4); }
  clickLeft()  { this.panToRatio(1/4, 1/2); }
  clickRight() { this.panToRatio(3/4, 1/2); }

  ngOnDestroy(): void { this.stopRepeat(); }
}
