import { Camera } from "./Camera.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Look2D } from "./Look2D.js";
import { Vector3 } from "../../util/Vector3.js";
import { LookAt } from "./LookAt.js";
import { LookFrom } from "./LookFrom.js";
/**
 * Camera parameters to override while copying.
 * See {@link OrthographicCamera.copyAndSet}
 */
export interface OrthographicCameraOptions {
  /**
   * The eye
   */
  eye?: Vector3;
  /**
   * The forward
   */
  forward?: Vector3;
  /**
   * The up
   */
  up?: Vector3;
  /**
   * The near
   */
  near?: number;
  /**
   * The far
   */
  far?: number;
  /**
   * The width
   */
  width?: number;
  /**
   * The height
   */
  height?: number;
  /**
   * The reference
   */
  worldReference?: CoordinateReference;
  /**
   * The world width
   */
  worldWidth?: number;
  /**
   * The world height
   */
  worldHeight?: number;
}
/**
 * <p> A camera that uses an orthographic (aka. parallel) projection.</p>
 *
 * <p>Note that the Camera API is a low-level API. For simple map navigation use cases, it's recommended
 * to use the higher-level {@link MapNavigator API}. The MapNavigator API works in both 2D and 3D,
 * on all map references. If you use the low-level Camera API, keep in mind that the same camera manipulation implementation
 * might not work for other types of cameras (OrthographicCamera vs PerspectiveCamera) or other (types of) map
 * references (projected vs. geocentric).</p>
 *
 * <p> A camera transforms points from the 'world' reference (often the {@link Map.reference map's reference})
 * to the view (pixel coordinates).</p>
 *
 * <p>
 * Besides the position, orientation and viewport properties that it inherits from {@link Camera},
 * the orthographic camera defines its projection using the following properties:
 * <ul>
 *   <li><b>worldWidth</b>: the size of the viewport along the X (horizontal) direction, in world units.</li>
 *   <li><b>worldHeight</b>: the size of the viewport along the Y (vertical) direction, in world units.</li>
 * </ul>
 *
 * </p>
 *
 * <p>
 * Note that cameras in LuciadRIA are immutable. You can manipulate the map's camera by using
 * {@link copyAndSet}, {@link Look2D}, {@link lookAt} or {@link lookFrom}.
 * The last two only work if the camera's {@link worldReference} is a 3D reference.
 * </p>
 *
 * <p>
 * Currently, the OrthographicCamera can only be used in combination with projected (grid) or cartesian map references.
 * For now, you can not use this camera if the map has a geocentric reference.
 * </p>
 *
 * <p>
 * For projected (grid) or 2D cartesian references, the camera should be positioned along the positive Z axis, facing
 * the negative Z direction. This way, the camera is positioned facing the XY-plane, where the map is rendered in.
 * </p>
 *
 * <p>
 * To manipulate an orthographic camera on a projected (grid) or 2D cartesian reference, we recommend using
 * {@link look2D}. This allows you to reason about the camera in 2D space, instead of a 3D space.
 * It also allows you to easily rotate and zoom the camera around any arbitrary view / world point.
 * </p>
 *
 * <p>
 * Map navigation constraints configured on {@link MapNavigator} are not enforced when this camera is
 * updated on the map. Constraints are only respected when using the {@link MapNavigator}.
 * </p>
 *
 * ```javascript
 * // low-level manipulation of orthographicCamera: zoom by a factor of 2
 * map.camera = map.camera.copyAndSet({worldWidth: map.camera.worldWidth / 2, worldHeight: map.camera.worldHeight / 2});
 *
 * // look2D() example: put the world's origin at pixel 200,200, and rotate the camera by 10 degrees (keeping the same scale)
 * var look2D = map.camera.asLook2D();
 * look2D.viewOrigin = {x: 200, y: 200, z: 0};
 * look2D.worldOrigin = {x: 0, y: 0, z: 0};
 * // look2D.scaleX and look2D.scaleY remain the same
 * look2D.rotation = look2D.rotation + 10;
 * map.camera = map.camera.look2D(look2D);
 * ```
 */
declare class OrthographicCamera extends Camera {
  /**
   * Creates a new OrthographicCamera
   * @param eye the 3D position that the camera is looking from, in world coordinates.
   * @param forward The 3D direction the camera is looking in, in world coordinates.
   *                          The combination of the forward and up vector determines the orientation of the camera.
   * @param up The 3D direction that indicates the 'up' direction of the camera, in world coordinates.
   *                              The combination of the forward and up vector determines the orientation of the camera,
   *                              in world space.
   * @param near The distance from the <code>eye</code> to the near clipping plane.
   *                            Points that fall outside of the near/far interval, are clipped.
   *                            Note that the near plane distance can be negative.
   * @param far The distance from the <code>eye</code> to the far clipping plane.
   *                           Points that fall outside of the near/far interval, are clipped.
   * @param width The width, in pixels, of the camera's viewport.
   * @param height The height, in pixels, of the camera's viewport.
   * @param worldWidth  The size of the viewport along the X (horizontal) direction, in world units.
   * @param worldHeight The size of the viewport along the Y (vertical) direction, in world units.
   * @param worldReference The reference in which
   *                                   <code>eye</code>, <code>forward</code>, <code>up</code>, <code>near</code>,
   *                                   <code>far</code> are defined (as well as the world units referred to in
   *                                   <code>scaleX</code> and <code>scaleY</code>).
   */
  constructor(eye: Vector3, forward: Vector3, up: Vector3, near: number, far: number, width: number, height: number, worldWidth: number, worldHeight: number, worldReference: CoordinateReference);
  /**
   * The size of the viewport along the X (horizontal) direction, in world units.
   */
  get worldWidth(): number;
  /**
   * The size of the viewport along the Y (vertical) direction, in world units.
   */
  get worldHeight(): number;
  /**
   * Returns copy of this camera.
   *
   * @return A copy of this camera
   */
  copy(): OrthographicCamera;
  /**
   * Copies this camera, and overrides parameters on the copy.
   * @param [options] Camera parameters to override while copying. The returned copy will have the values of
   *        this Camera's parameters, except for the parameters defined in the options argument.
   **
   * ```javascript
   * // create a new camera, with a bigger width and height
   * var biggerCamera = this.map.camera.copyAndSet({width: 2 * map.camera.width, height: 2 * map.camera.height});
   * ```
   * @return A copy of the current camera, with the parameters defined in the options
   *                                           overridden.
   */
  copyAndSet(options: OrthographicCameraOptions): OrthographicCamera;
  /**
   * Checks if two cameras are equal.
   *
   * @param other  The other object to check equality for
   * @return True if <code>other</code> is an OrthographicCamera instance with the same state as this one.
   */
  equals(other: any): boolean;
  /**
   * Returns a new OrthographicCamera, which is positioned and oriented as described by the {@link Look2D look2d} object.
   *              This look2D object makes it easier to work with '2D' cameras (Orthographic cameras with a projected (grid) or cartesian reference).
   *              You can construct a look2D object manually, or retrieve it from an existing camera using {@link asLook2D}.
   *
   *              <p>Note that this will only work if this camera's {@link worldReference} is a projected (grid) or cartesian reference.</p>
   *
   *              <p>For convenience, if worldOrigin is a {@link Point}, LuciadRIA will attempt to transform it to the {@link worldReference}.</p>
   *
   * @param look2D a Look2D object
   *
   * @return A new camera instance that matches the position described by the {@link Look2D} object.
   * @see {@link asLook2D}
   * @see {@link Look2D}
   *
   * ```javascript
   * // put lon-lat point [12,5] at the center of the view
   * map.camera.look2D({
   *   viewOrigin: {x: map.camera.width / 2, y: map.camera.height / 2, z: 0},
   *   worldOrigin: createPoint(ReferenceProvider.getReference("CRS:84"), [12, 5]),
   *   scaleX: map.camera.width / map.camera.worldWidth,
   *   scaleY: map.camera.height / map.camera.worldHeight,
   *   rotation: 0
   * });
   * ```
   */
  look2D(look2D: Look2D): OrthographicCamera;
  /**
   * Returns a {@link Look2D look2d} object that matches this camera's position and orientation.
   *              This look2D object makes it easier to work with '2D' cameras (Orthographic cameras with a projected (grid) or cartesian reference).
   *              Once retrieved, this look2D can be manipulated and then set on the map again using {@link look2D}
   *
   *              <p>Note that this will only work if this camera's {@link worldReference} is a projected (grid) or cartesian reference.</p>
   * @return A Look2D object that matches this camera's position and orientation.
   *
   * @see {@link look2D}
   * @see {@link Look2D}
   *
   * ```javascript
   * // rotate the map 45 degrees
   * var look2D = map.camera.asLook2D();
   * look2D.rotation += 45;
   * map.camera = map.camera.look2D(look2D);
   * ```
   */
  asLook2D(): Look2D;
  lookAt(lookAt: LookAt): OrthographicCamera;
  lookFrom(lookFrom: LookFrom): OrthographicCamera;
}
export { OrthographicCamera };