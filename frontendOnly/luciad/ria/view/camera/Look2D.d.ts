import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Vector3 } from "../../util/Vector3.js";
/**
 * A Look2D represents the position of an OrthographicCamera in a projected (grid) or cartesian reference (aka a '2D' reference).
 * It allows you to reason about the map's camera in a 2D space, rather than a 3D space.
 * It also allows you to easily perform zooming and rotation around an arbitrary view point.
 *
 * A Look2D is defined by the following properties:
 * <ul>
 *   <li><b>worldOrigin</b>: The 2D world point at viewOrigin.</li>
 *   <li><b>viewOrigin</b>: The pixel point at which worldOrigin is in the viewport</li>
 *   <li><b>scaleX</b>: The scale, in pixels / world unit, along the X (horizontal) direction of the camera's viewport.</li>
 *   <li><b>scaleY</b>: The scale, in pixels / world unit, along the Y (vertical) direction of the camera's viewport.</li>
 *   <li><b>rotation</b>: The rotation of the camera, in degrees. Positive is counter-clockwise in the view. 0 = no rotation.</li>
 *   <li><b>reference</b>: The reference in which worldOrigin is defined. The 'world units' from scaleX / scaleY also refer to this reference.</li>
 * </ul>
 *
 * Rotation and scaling (zooming) happen with viewOrigin / worldOrigin as the center.
 *
 * Imagine pushing a pin through the pixel at <code>viewOrigin</code>, and sticking it to <code>worldOrigin</code>
 * on the 2D map. Moving the pin pans the map. Rotation (<code>rotation</code>) and zooming
 * (<code>scaleX</code> and <code>scaleY</code>) happen around the pin.
 *
 * Note that a Look2D can not be used with a geocentric (3D) reference.
 *
 * ```javascript
 * // zoom in by a factor of 2, towards a mouse location (pixel 50, 50)
 * var mouseLocation = {x: 50, y: 50, z: 0};
 * var look2D = map.camera.asLook2D();
 * look2D.viewOrigin = mouseLocation;
 * look2D.worldOrigin = map.camera.toWorld(mouseLocation);
 * look2D.scaleX *= 2;
 * look2D.scaleY *= 2;
 * map.camera = map.camera.look2D(look2D);
 * ```
 */
export interface Look2D {
  /**
   * The pixel point at which worldOrigin is in the viewport.
   *
   */
  viewOrigin: Vector3;
  /**
   * The 2D world point at viewOrigin.
   */
  worldOrigin: Vector3;
  /**
   * The scale, in pixels per world unit, along the X (horizontal) direction of the camera's viewport.
   *
   */
  scaleX: number;
  /**
   * The scale, in pixels per world unit, along the Y (vertical) direction of the camera's viewport.
   *
   */
  scaleY: number;
  /**
   * The rotation of the camera, in degrees. Positive is counter-clockwise in the view. 0 = no rotation.
   *
   */
  rotation: number;
  /**
   * The reference in which worldOrigin is defined. The 'world units' of scaleX and scaleY also refer to the units of this reference.
   */
  reference: CoordinateReference;
}