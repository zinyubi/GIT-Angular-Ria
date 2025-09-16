import { Point } from "../../shape/Point.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Vector3 } from "../../util/Vector3.js";
import { LookAt } from "./LookAt.js";
import { LookFrom } from "./LookFrom.js";
/**
 * <p> A camera transforms points from the 'world' reference (often the {@link Map.reference map's reference})
 * to the view (pixel coordinates). In layman terms: just like with television,
 * the camera's position, orientation (and other parameters like the projection) determines what is shown on screen.</p>
 *
 * <p>Note that the Camera API is a low-level API. For simple map navigation use cases, it's recommended
 * to use the higher-level {@link MapNavigator API}. The MapNavigator API works in both 2D and 3D,
 * on all map references. If you use the low-level Camera API, keep in mind that the same camera manipulation implementation
 * might not work for other types of cameras (OrthographicCamera vs PerspectiveCamera) or other (types of) map
 * references (projected vs. geocentric).</p>
 *
 * <p>
 * This is a base class shared by both {@link PerspectiveCamera} and
 * {@link OrthographicCamera}. It describes the position, orientation and viewport of the camera,
 * as well as provide functions to transform between 3D 'world' and 'view' (pixel) points.
 * </p>
 *
 * <p>
 * The camera's position, orientation and viewport are described by the following parameters:
 *
 * <ul>
 *   <li>The <b>eye</b> point: the 3D position that the camera is looking from, in world coordinates.</li>
 *   <li>The <b>forward</b> vector: the 3D direction the camera is looking in, in world coordinates.
 *                                  The combination of the forward and up vector determines the orientation of the camera.
 *                                  in world space.
 *   </li>
 *   <li>The <b>up</b> vector: the 3D direction that indicates the 'up' direction of the camera, in world coordinates.
 *                              The combination of the forward and up vector determines the orientation of the camera,
 *                              in world space.
 *   </li>
 *   <li>The <b>near</b> plane distance: the distance from the <code>eye</code> to the near clipping plane.
 *                                     Points that fall outside of the near/far interval, are clipped.
 *                                     Note that the near plane distance can be negative.
 *   </li>
 *   <li>The <b>far</b> plane distance: the distance from the <code>eye</code> to the far clipping plane.
 *                                    Points that fall outside of the near/far interval, are clipped.
 *   </li>
 *   <li>The <b>width</b> in pixels of the camera's viewport.</li>
 *   <li>The <b>height</b> in pixels of the camera's viewport.</li>
 *   <li>The <b>worldReference</b>: the coordinate reference in which the camera is positioned and oriented.
 * </ul>
 * </p>
 *
 * <p>
 * In practice, you only work with {@link PerspectiveCamera} and
 * {@link OrthographicCamera}. Besides the camera position, orientation and viewport, these
 * subclasses also define a projection (orthographic vs. perspective).
 * </p>
 *
 * @see {@link OrthographicCamera}
 * @see {@link PerspectiveCamera}
 */
export declare abstract class Camera {
  /**
   * The 3D position that the camera is looking from, in world coordinates.
   */
  get eye(): Vector3;
  /**
   *  The 3D position that the camera is looking from, in world coordinates. This one is a shape instead
   *  of a Vector3, so it can easily be transformed to other references.
   */
  get eyePoint(): Point;
  /**
   * The 3D direction the camera is looking in, in world coordinates.
   * The combination of the forward and up vector determines the orientation of the camera. in world space.
   */
  get forward(): Vector3;
  /**
   * The 3D direction that indicates the 'up' direction of the camera, in world coordinates.
   * The combination of the forward and up vector determines the orientation of the camera, in world space.
   */
  get up(): Vector3;
  /**
   * The world distance from the <code>eye</code> to the near clipping plane.
   * Points that fall outside of the near/far interval, are clipped.
   * By default, this gets updated automatically on a 3D Map, to keep the earth's surface visible.
   * See {@link WebGLMap.adjustDepthRange} for more information.
   * Note that the near plane distance can be negative.
   */
  get near(): number;
  /**
   * The world distance from the <code>eye</code> to the far clipping plane.
   * Points that fall outside of the near/far interval, are clipped.
   * By default, this gets updated automatically on a 3D Map, to keep the earth's surface visible.
   * See {@link WebGLMap.adjustDepthRange} for more information.
   */
  get far(): number;
  /**
   * The aspect ratio of the view port ({@link width} / {@link height}).
   */
  get aspectRatio(): number;
  /**
   * The width, in pixels, of the camera's viewport.
   */
  get width(): number;
  /**
   * The height, in pixels, of the camera's viewport.
   */
  get height(): number;
  /**
   * The coordinate reference in which the camera is positioned and oriented.
   */
  get worldReference(): CoordinateReference;
  /**
   * <p>
   *   Returns a camera that matches the position and orientation of the specified {@link LookFrom}.
   * </p>
   *
   * <p>
   *   If <code>lookFrom.eye</code> is a {@link Point}, then that point will be transformed to
   *   {@link worldReference} (if necessary).
   * </p>
   *
   * <p>
   *   Note you can only use this function if this camera's {@link worldReference} is not a 2D reference.
   * </p>
   *
   * <p>
   *   To perform a lookFrom with navigation constraints enforced you can use {@link MapNavigator.lookFrom MapNavigator#lookFrom}.
   *   This call will respect navigations constraints and additionally it can do the operation animated.
   * </p>
   *
   *  ```javascript
   * map.camera = map.camera.lookFrom({
   *   eye: createPoint(getReference("CRS:84"), [0, 0, 20e3]),
   *   yaw: 180,
   *   pitch: -35,
   *   roll: 0
   * });
   *```
   *
   * @param lookFrom  The returned camera will match this LookFrom's position and orientation.
   * @return a camera that matches the position and orientation of the {@link LookFrom} that was passed in.
   *
   * @since 2023.1
   */
  lookFrom(lookFrom: LookFrom): Camera;
  /**
   * <p>
   *   Returns a {@link LookFrom} that matches the position and orientation of this camera.
   * </p>
   *
   * <p>
   *   Note you can only use this function if this camera's {@link worldReference} is not a 2D reference.
   * </p>
   *
   * ```javascript
   * // keep looking from the same point, but pitch the view up 10 degrees
   * var lookFrom = map.camera.asLookFrom();
   * lookFrom.pitch += 10;
   * map.camera = map.camera.lookFrom(lookFrom);
   * ```
   *
   * @return a LookFrom object that matches position and orientation of this camera.
   *
   * @since 2023.1
   */
  asLookFrom(): LookFrom;
  /**
   * <p>
   *   Returns a camera that matches the position and orientation of the specified {@link LookAt}.
   * </p>
   *
   * <p>
   *   If <code>lookAt.ref</code> is a {@link Point}, then that point will be transformed to
   *   {@link worldReference} (if necessary).
   * </p>
   *
   * <p>
   *   Note you can only use this function if this camera's {@link worldReference} is not a 2D reference.
   * </p>
   *
   * ```javascript
   * map.camera = map.camera.lookAt({
   *   ref: createPoint(getReference("CRS:84"), [52, 2, 0]),
   *   distance: 50e3,
   *   yaw: 180,
   *   pitch: -35,
   *   roll: 0
   * });
   * ```
   * @param lookAt The returned camera will match this LookFrom's position and orientation.
   * @return a camera that matches the position and orientation of the {@link LookAt} that was passed in.
   *
   * @since 2023.1
   */
  lookAt(lookAt: LookAt): Camera;
  /**
   * <p>
   *   Returns a {@link LookAt} that matches the position and orientation of this camera.
   * </p>
   *
   * <p>
   *   Note you can only use this function if this camera's {@link worldReference} is not a 2D reference.
   * </p>
   *
   * @param distance a distance (in the world reference's unit) between the camera's position and the LookAt's {@link LookAt.ref ref}.
   *                 For geocentric references, the world unit is usually 1 meter.
   * @return a LookAt object that matches position and orientation of this camera.
   *
   * @since 2023.1
   */
  asLookAt(distance: number): LookAt;
  /**
   *  Transforms a Vector3 from world to view
   * @param worldVec The world point to transform to view space (pixels).
   * @param vectorSFCT An optional 'out' parameter. If this is defined, it's x,y and z properties will be assigned to the result of the transformation.
   *                               If it's not defined, a new Vector3 with the result is constructed and returned.
   *                               Use this out parameter if you need to transform many points at once, and want to avoid
   *                               creating many objects.
   * @return The transformed point, in view space (pixels)
   */
  toView(worldVec: Vector3, vectorSFCT?: Vector3): Vector3;
  /**
   *  Transforms a Point from world to view
   * @param point The point to transform to view space (pixels).
   *                               If this point is not defined in this camera's {@link worldReference},
   *                               it will first be transformed to the {@link worldReference}.
   * @param outPointSFCT An optional 'out' parameter.
   *                               If this is defined, that point will be moved to the result of the transformation.
   *                               If it's not defined, a new Point with the result is constructed and returned.
   *                               Use this out parameter if you need to transform many points at once, and want to avoid
   *                               creating many Point instances.
   * @return The transformed point, in view space (pixels).
   */
  toViewPoint(point: Point, outPointSFCT?: Point): Point;
  /**
   *  Transforms a Vector3 to world.
   * @param viewVec The view point (pixels) to transform to world space.
   * @param vectorSFCT An optional 'out' parameter. If this is defined, it's x,y and z properties will be assigned to the result of the transformation.
   *                               If it's not defined, a new Vector3 with the result is constructed and returned.
   *                               Use this out parameter if you need to transform many points at once, and want to avoid
   *                               creating many objects.
   * @return The transformed point, in world space.
   */
  toWorld(viewVec: Vector3, vectorSFCT?: Vector3): Vector3;
  /**
   *  Transforms a Point to world.
   * @param viewPoint The point to transform to view space (pixels).
   *                               A 'view' point has 'null' as its reference.
   * @param outPointSFCT An optional 'out' parameter.
   *                               If this is defined, that point will be moved to the result of the transformation.
   *                               If it is defined, and has a reference other than {@link worldReference},
   *                               it will be transformed to that reference.
   *                               If it's not defined, a new Point with the result is constructed and returned.
   *                               Use this out parameter if you need to transform many points at once, and want to avoid
   *                               creating many Point instances.
   * @return The transformed point, in view space (pixels).
   */
  toWorldPoint(viewPoint: Point, outPointSFCT?: Point): Point;
}