import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { createPoint } from '@luciad/ria/shape/ShapeFactory.js';
import { CoordinateReference } from '@luciad/ria/reference/CoordinateReference.js';
import { createTransformation } from '@luciad/ria/transformation/TransformationFactory.js';
import { LocationMode } from '@luciad/ria/transformation/LocationMode.js';
import { OutOfBoundsError } from '@luciad/ria/error/OutOfBoundsError.js';
import { Point } from '@luciad/ria/shape/Point.js';

@Injectable({ providedIn: 'root' })
export class MouseCoordinateServiceRia {
  private modelPoint$ = new BehaviorSubject<Point | null>(null);
  private viewPoint$  = new BehaviorSubject<Point | null>(null);
  private listener: ((e: MouseEvent) => void) | null = null;

  constructor(private zone: NgZone) {}

  start(map: WebGLMap, targetRef: CoordinateReference): void {
    this.stop(map);
    const mapRef   = map.reference;
    const v       = createPoint(null, []);
    const m       = createPoint(mapRef, []);
    const model   = createPoint(targetRef, []);
    const map2Model = createTransformation(mapRef, targetRef, {
      normalizeWrapAround: map.wrapAroundWorld
    });

    this.listener = (e: MouseEvent) => {
      try {
        const r = map.domNode.getBoundingClientRect();
        v.move2D(e.clientX - r.left, e.clientY - r.top);
        map.getViewToMapTransformation(LocationMode.TERRAIN).transform(v, m);
        map2Model.transform(m, model);
        this.zone.run(() => {
          this.modelPoint$.next(model.copy());
          this.viewPoint$.next(v.copy());
        });
      } catch (err) {
        if (!(err instanceof OutOfBoundsError)) throw err;
        this.zone.run(() => {
          this.modelPoint$.next(null);
          this.viewPoint$.next(null);
        });
      }
    };
    map.domNode.addEventListener('mousemove', this.listener, false);
  }

  stop(map: WebGLMap): void {
    if (this.listener) {
      map.domNode.removeEventListener('mousemove', this.listener);
      this.listener = null;
    }
    this.modelPoint$.next(null);
    this.viewPoint$.next(null);
  }

  model$(): Observable<Point | null> { return this.modelPoint$.asObservable(); }
  view$():  Observable<Point | null> { return this.viewPoint$.asObservable(); }
}
