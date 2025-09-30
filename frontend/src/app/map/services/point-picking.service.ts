import { Injectable } from '@angular/core';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { createPoint } from '@luciad/ria/shape/ShapeFactory.js';
import { LocationMode } from '@luciad/ria/transformation/LocationMode.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';

@Injectable({ providedIn: 'root' })
export class PointPickingService {
  private _listener: any;

  start(map: WebGLMap, cb: (lon: number, lat: number) => void, container?: HTMLElement): void {
    this.stop(map);
    const targetRef = getReference('EPSG:4326');
    const v = createPoint(null, []);
    const m = createPoint(targetRef, []);

    this._listener = (e: MouseEvent) => {
      const rect = (container ?? map.domNode).getBoundingClientRect();
      v.move2D(e.clientX - rect.left, e.clientY - rect.top);
      map.getViewToMapTransformation(LocationMode.TERRAIN).transform(v, m);
      const lon = (m as any).x ?? (m as any)[0];
      const lat = (m as any).y ?? (m as any)[1];
      if (Number.isFinite(lon) && Number.isFinite(lat)) cb(+lon, +lat);
    };
    (container ?? map.domNode).addEventListener('click', this._listener, { once: true });
  }

  stop(map: WebGLMap, container?: HTMLElement): void {
    if (this._listener) {
      (container ?? map.domNode).removeEventListener('click', this._listener);
      this._listener = null;
    }
  }
}
