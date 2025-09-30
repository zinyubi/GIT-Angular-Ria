import { Injectable } from '@angular/core';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { OutOfBoundsError } from '@luciad/ria/error/OutOfBoundsError.js';
import { createEllipsoidalGeodesy } from '@luciad/ria/geodesy/GeodesyFactory.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';
import { ReferenceType } from '@luciad/ria/reference/ReferenceType.js';
import { createPoint } from '@luciad/ria/shape/ShapeFactory.js';
import { LocationMode } from '@luciad/ria/transformation/LocationMode.js';
import { createTransformation } from '@luciad/ria/transformation/TransformationFactory.js';
import { PerspectiveCamera } from '@luciad/ria/view/camera/PerspectiveCamera.js';
import { Point } from '@luciad/ria/shape/Point.js';

@Injectable({ providedIn: 'root' })
export class CompassServiceRia {
  private readonly CRS84 = getReference('CRS:84');
  private readonly geodesy = createEllipsoidalGeodesy(this.CRS84);
  private static readonly OFFSET_M = 1000;

  /** Camera rotation (2D) or yaw (3D). Degrees. */
  private getCameraRotation(map: WebGLMap): number {
    const cam = map.camera;
    return cam instanceof PerspectiveCamera ? cam.asLookFrom().yaw : cam.asLook2D().rotation;
  }

  /** Angle to north (deg) at view center for current reference. */
  private getAzimuthAtViewCenter(map: WebGLMap): number {
    const refType = map.reference.referenceType;
    if (refType === ReferenceType.CARTESIAN || refType === ReferenceType.GEOCENTRIC) {
      return this.getCameraRotation(map);
    }
    try {
      const world2llh = createTransformation(map.reference, this.CRS84);
      const llh2world = createTransformation(this.CRS84, map.reference);

      // center of view in view coords
      let centerViewPoint: Point = createPoint(null, [map.viewSize[0] / 2, map.viewSize[1] / 2]);

      // view -> map (normalize for wrapAround)
      const viewToMap = map.getViewToMapTransformation(LocationMode.TERRAIN);
      const norm = createTransformation(map.reference, map.reference, { normalizeWrapAround: map.wrapAroundWorld });

      const centerMapPoint = norm.transform(viewToMap.transform(centerViewPoint));
      // ensure view point matches normalized map point
      centerViewPoint = map.mapToViewTransformation.transform(centerMapPoint);

      // move 1000m north (az=0) in llh
      const centerLLH = world2llh.transform(centerMapPoint);
      const higherLLH = this.geodesy.interpolate(centerLLH, CompassServiceRia.OFFSET_M, 0);
      const higherViewPoint = map.mapToViewTransformation.transform(llh2world.transform(higherLLH));

      // azimuth from center to "north" in screen space (deg)
      const rad = Math.atan2(centerViewPoint.x - higherViewPoint.x, centerViewPoint.y - higherViewPoint.y);
      return rad * (180 / Math.PI);
    } catch (e) {
      if (e instanceof OutOfBoundsError) return this.getCameraRotation(map);
      throw e;
    }
  }

  calculateCSSRotationRia(map: WebGLMap): { x: number; z: number } {
  const azimuth = this.getAzimuthAtViewCenter(map);     // positive: clockwise from north
  const z = -azimuth;                                   // CSS rotates CW with positive values; invert
  let x = 0;

  // Add a mild X tilt in 3D based on pitch so icon hints the camera tilt
  const cam = map.camera;
  // PerspectiveCamera has .asLookFrom().pitch where -90 is straight down
  // map to [0..60] deg to avoid flattening into a line
  // clamp(89 + pitch, 0, 90) * (60/90)
  // (89 offset centers around typical -89 nadir)
  // Use safe math without external helpers:
  // @ts-ignore
  if (cam?.asLookFrom) {
    // @ts-ignore
    const { pitch } = cam.asLookFrom();
    const raw = 89 + (pitch ?? 0);
    const clamped = Math.max(0, Math.min(90, raw));
    x = (clamped * 60) / 90;
  }

  return { x, z };
}

/** Return a CSS transform string for the compass icon. */
cssRotationForMapRia(map: WebGLMap): string {
  const { x, z } = this.calculateCSSRotationRia(map);
  return `rotateX(${x}deg) rotateZ(${z}deg)`;
}

  /** Rotate map so that north points up (2D) / yaw aligned (3D). */
  rotateToNorthRia(map: WebGLMap): void {
    // try to rotate around the surface point at screen center
    let center: Point | undefined;
    try {
      const viewCenter = createPoint(null, [map.viewSize[0] / 2, map.viewSize[1] / 2]);
      center = map.getViewToMapTransformation(LocationMode.CLOSEST_SURFACE).transform(viewCenter);
    } catch (e) {
      if (!(e instanceof OutOfBoundsError)) throw e;
      // no center available; rotate around camera
      center = undefined;
    }

    const delta = -this.getAzimuthAtViewCenter(map);
    // apply both 2D rotation and 3D yaw; engine will use the relevant one
    const opts: any = { animate: true, deltaRotation: delta, deltaYaw: delta };
    if (center) opts.center = center;

    map.mapNavigator.rotate(opts);
  }
}
