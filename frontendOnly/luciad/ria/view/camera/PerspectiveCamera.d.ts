import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Vector3 } from "../../util/Vector3.js";
import { Camera } from "./Camera.js";
import { LookAt } from "./LookAt.js";
import { LookFrom } from "./LookFrom.js";
/**
 * Object literal used to create a copy of a {@link PerspectiveCamera}.
 */
export interface PerspectiveCameraOptions {
  /**
   * When set, the copy will have this point as its eye
   */
  eye?: Vector3;
  /**
   * When set, the copy will have this point as its forward.
   */
  forward?: Vector3;
  /**
   * When set, the copy will have this point as its up
   */
  up?: Vector3;
  /**
   * When set, the copy will have this point as its near.
   */
  near?: number;
  /**
   * When set, the copy will have this point as its far.
   */
  far?: number;
  /**
   * When set, the copy will have this point as its width.
   */
  width?: number;
  /**
   * When set, the copy will have this point as its height.
   */
  height?: number;
  /**
   * When set, the copy will have this reference.
   */
  worldReference?: CoordinateReference;
  /**
   * When set, the copy will have this point as its fovY.
   */
  fovY?: number;
}
/**
 * <p> A camera that uses an perspective projection. Also known as a 'pinhole' camera.</p>
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
 * the perspective camera defines its projection using the following properties:
 * <ul>

 *   <li>The <b>fovY</b>: the angle, in degrees, that determines the vertical 'field-of-view' angle of the camera.
 *                        The horizontal field-of-view angle is derived from the vertical field-of-view and
 *                        the camera's {@link Camera.aspectRatio aspect ratio}.
 *                        You can convert between horizontal (fovX) and vertical (fovY) field-of-view angles.
 *                        See {@link fovY} for a code snippet showing how to do this.
 *   </li>
 * </ul>
 *
 * </p>
 *
 * <p>
 * Note that cameras in LuciadRIA are immutable. You can manipulate the map's camera by using
 * {@link copyAndSet} or by converting from/to a {@link LookFrom} or {@link LookAt}.
 * </p>
 *
 * <p>
 * The PerspectiveCamera can only be used in combination with geocentric or 3D cartesian map references.
 * </p>
 *
 * <p>
 * To manipulate a perspective camera in a 3D reference, consider using
 * {@link lookAt} or {@link lookFrom}. This allows you to reason about the camera in terms of yaw (angle from north direction),
 * pitch (angle wrt. horizon) and roll. You could also just manipulate the camera's eye position and forward/up directions
 * directly, if that's a better fit for your use case.
 * </p>
 *
 * <p>
 * Map navigation constraints configured on {@link MapNavigator} are not enforced when this camera is
 * updated on the map. Constraints are only respected when using the {@link MapNavigator}.
 * </p>
 *
 * ```javascript
 * // low-level manipulation of perspective camera: put camera looking over Europe, faced towards the north
 * map.camera = map.camera.copyAndSet({
 *   eye: {x: 6214861.581912037, y: 710226.7751339739, z: 4927634.769711619]},
 *   forward: {x: 0.9588725076044676, y: -0.12713997961061635, z:-0.25376946180526144},
 *   up: {x: -0.2469197372006221, y: -0.06727846255744102, z: 0.9666976010400992}
 * });
 * ```
 */
export declare class PerspectiveCamera extends Camera {
  /**
   * Creates a new PerspectiveCamera
   * @param eye the 3D position that the camera is looking from, in world coordinates.
   * @param  forward The 3D direction the camera is looking in, in world coordinates.
   *                          The combination of the forward and up vector determines the orientation of the camera.
   * @param  up The 3D direction that indicates the 'up' direction of the camera, in world coordinates.
   *                              The combination of the forward and up vector determines the orientation of the camera,
   *                              in world space.
   * @param near The distance from the <code>eye</code> to the near clipping plane.
   *                            Points that fall outside of the near/far interval, are clipped.
   *                            Note that the near plane distance can be negative.
   * @param far The distance from the <code>eye</code> to the far clipping plane.
   *                           Points that fall outside of the near/far interval, are clipped.
   * @param width The width, in pixels, of the camera's viewport.
   * @param height The height, in pixels, of the camera's viewport.
   * @param fovY The angle, in degrees, that determines the vertical 'field-of-view' angle of the camera.
   * @param worldReference The reference in which
   *                                   <code>eye</code>, <code>forward</code>, <code>up</code>, <code>near</code>,
   *                                   <code>far</code> are defined (as well as the world units referred to in
   *                                   <code>scaleX</code> and <code>scaleY</code>).
   */
  constructor(eye: Vector3, forward: Vector3, up: Vector3, near: number, far: number, width: number, height: number, fovY: number, worldReference: CoordinateReference);
  /**
   * The angle, in degrees, that determines the vertical 'field-of-view' angle of the camera.
   *              The horizontal field-of-view angle is derived from the vertical field-of-view and
   *              the camera's {@link Camera.aspectRatio aspect ratio}.
   *              You can convert between horizontal (fovX) and vertical (fovY) field-of-view angles using the following formulas:
   * ```javascript
   * var DEG2RAD = Math.PI / 180;
   * var RAD2DEG = 180 / Math.PI;
   * var camerafovX = 2 * Math.atan(Math.tan(camera.fovY * DEG2RAD / 2) * camera.aspectRatio) * RAD2DEG;
   * var newFovX = 60;
   * var newfovY = 2 * Math.atan(Math.tan(newFovX * DEG2RAD / 2) / camera.aspectRatio) * RAD2DEG;
   * ```
   */
  get fovY(): number;
  /**
   * Returns copy of this camera.
   */
  copy(): PerspectiveCamera;
  /**
   * Copies this camera, and overrides parameters on the copy.
   *
   * ```javascript
   * // use a horizontal field-of-view on the map, instead of a vertical field-of-view
   * var DEG2RAD = Math.PI / 180;
   * var RAD2DEG = 180 / Math.PI;
   * var newFovX = 90;
   * var newfovY = 2 * Math.atan(Math.tan(newFovX * DEG2RAD / 2) / camera.aspectRatio) * RAD2DEG;
   * map.camera = this.map.camera.copyAndSet({fovY: newFovY});
   * ```
   *
   * @param options Camera parameters to override while copying. The returned copy will have the values of
   *        this Camera's parameters, except for the parameters defined in the options argument.
   * @return A copy of the current camera, with the parameters defined in the options
   *                                           overridden.
   */
  copyAndSet(options: PerspectiveCameraOptions): PerspectiveCamera;
  /**
   * Checks if two cameras are equal.
   *
   * @param other The other object to check equality for
   * @return True if <code>other</code> is a PerspectiveCamera instance with the same state as this one.
   */
  equals(other: any): boolean;
  lookFrom(lookFrom: LookFrom): PerspectiveCamera;
  lookAt(lookAt: LookAt): PerspectiveCamera;
}