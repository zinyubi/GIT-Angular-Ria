import { Point } from "../shape/Point.js";
import { Bounds } from "../shape/Bounds.js";
import { Bounded } from "../shape/Bounded.js";
import { MapNavigatorConstraints } from "./MapNavigatorConstraints.js";
/**
 * The options for an animation.
 */
export interface MapNavigatorAnimationOptions {
  /**
   * The duration of the animation in milliseconds.
   * Must be positive or 0.
   * Defaults to {@link MapNavigator.defaults defaults.fit.duration}.
   */
  duration?: number;
  /**
   * An easing function for the animation that adjusts the speed of the animation.
   *
   * For some example easing functions, see {@link http://easings.net/}
   * or {@link https://gist.github.com/gre/1650294}.
   *
   * When omitted, defaults to {@link MapNavigator.defaults defaults.fit.ease}.
   *
   * @param n a number in range [0,1]
   * @return  a number in range [0,1]
   */
  ease?: (n: number) => number;
}
/**
 * The options for a fit operation.
 */
export interface MapNavigatorFitOptions {
  /**
   * The {@link Bounds} to fit on.
   * Can be in a model, map or view reference.
   */
  bounds: Bounds;
  /**
   * The fit margin is the margin between the bounds to fit on and the edge of the visible map.
   * Can be specified in either percentage of the map's screen dimensions, or as a fixed amount of pixels.
   *
   * A fit margin of "5%" will add a margin of 5% of the map's screen dimensions on each side of the bounds,
   * the center remains unchanged.
   *
   * A fit margin of "10px" will add a margin of 10 pixels on each side of the bounds, the center remains unchanged.
   * Setting this to "0%", "0px" or just "0" will remove the margin.
   *
   * When omitted, {@link MapNavigator.defaults defaults.fit.fitMargin} will be used.
   */
  fitMargin?: string;
  /**
   * <p>This can only be set to
   * <code>true</code> if the Map is used to visualize data
   * that is not spatial in nature. For example,
   * when the Map's reference axes represent units of measure like
   * speed, distance, or volume.
   * See {@link createCartesianReference}
   * for more information on how to create such a reference.
   * </p>
   *
   * <p>
   * Indicates whether the scale ratio will be adapted to
   * be able to obtain a perfect fit.  The default value is <code>false</code>.
   * Perfect fit means the existing aspect ratio between the horizontal and
   * vertical scale of the map will be adjusted independently.
   * </p>
   *
   * <p>
   * Consider a map which is shown in a wide
   * rectangular screenport (e.g. 16:9) but on which you perform a perfect fit
   * with a square bounds. Doing so would cause a warping effect, compressing
   * the y-axis to ensure it is in the view.  However, when the data on the
   * map is specified in a coordinates system in which x and y do not represent
   * the same kind of quantity, setting <code>allowWarpXYAxis</code> to
   * <code>true</code> is a convenient way to show all data on the map in that
   * bounds, without any extra padding and the associated loss of screen
   * real-estate. In such a case, a stretch or compression along an axis may be
   * a desired effect.
   * </p>
   */
  allowWarpXYAxis?: boolean;
  /**
   * Indicates whether or not the target camera position's zoom level
   * should be snapped to layer scale levels (to allow for pixel-perfect display of raster layers).
   *
   * Only has effect on 2D maps.
   *
   * Note that this can affect the accuracy of the fit operation.
   *
   * When omitted, this defaults to
   * {@link MapNavigator.defaults defaults.snapToScaleLevels}.
   */
  snapToScaleLevels?: boolean;
  /**
   * When falsy, the fit operation will be immediate.
   * When truthy, the fit operation will be animated.
   *
   * The default value is false.
   *
   * Regardless of the value of 'animate', you have to wait for the returned Promise to resolve to ensure that the map
   * has navigated to the target position.
   * To alter the animation, you can assign an {@link MapNavigatorAnimationOptions} to this option.
   */
  animate?: MapNavigatorAnimationOptions | boolean;
}
/**
 * The options for a pan operation.
 */
export interface MapNavigatorPanOptions {
  /**
   * This {@link Point} will end up at {@link toViewLocation}
   * after the pan operation. Can be in a model, map or view reference. If the point is in a view reference,
   * the map point that corresponds to that view point is used. In 3D, this will be the point on terrain
   * at that view point.
   */
  targetLocation: Point;
  /**
   * A {@link Point} in view reference.
   * targetLocation will be at toViewLocation after the pan operation.
   * <i>Must</i> be in the view reference (reference === null, pixel coordinates).
   * When omitted, will default to the map's view center.
   */
  toViewLocation?: Point;
  /**
   * If true, the pan operation will keep yaw constant.
   * The tracked point will not remain exactly under the mouse at all times, but the camera
   * will keep the same yaw (angle to north direction, also called azimuth) while panning.
   *
   * This property has no effect on panning 2D maps.
   *
   * @default false
   * @since 2022.1
   */
  constantYaw?: boolean;
  /**
   * When falsy, the pan operation will be immediate.
   * When truthy, the pan operation will be animated.
   *
   * The default value is false.
   *
   * Regardless of the value of 'animate', you have to wait for the returned Promise to resolve to ensure that the map
   * has navigated to the target position.
   * To alter the animation, you can assign an {@link MapNavigatorAnimationOptions} to this option.
   */
  animate?: MapNavigatorAnimationOptions | boolean;
}
/**
 * The options for a zoom operation.
 */
export interface MapNavigatorZoomOptions {
  /**
   * The zoom factor to multiply the map scale with.
   * <p>
   * Uniform zooming:
   * When you assign a single, strictly positive Number to this option, that number will be used to
   * zoom in a uniform way (the scale for all axes is multiplied with this factor).
   * A factor larger than 1 will zoom in, a factor smaller than 1 will zoom out.
   * Zooming with a factor of 1 will have no effect on the map.
   * </p>
   * Non-uniform zooming (non-georeferenced, 2D views only):
   * You can use separate factors for the x- and y-axis.
   * To achieve this, you assign an object literal to the factor option.
   * The object literal has to have one or two properties:
   * <ul>
   *   <li><b>x</b> The factor to scale the x-axis with.</li>
   *   <li><b>y</b> The factor to scale the y-axis with.</li>
   * </ul>
   * Non-uniform zooming is disabled for georeferenced maps and 3D maps.
   * While it is technically possible to zoom in a non-uniform way on a georeferenced map,
   * it will cause the map to be incorrectly visualized (it distorts the properties of the map's projection).
   * Non-uniform zooming in 3D is not meaningful.
   */
  factor?: number | {
    x: number;
    y: number;
  };
  /**
   * The target scale of the zoom operation.
   * <p>
   * Uniform zooming:
   * When you assign a single, strictly positive Number to this option, that number will be used to
   * zoom in a uniform way (the scale for all axes is set to this value).
   * After the zoom operation, {@link Map.mapScale map.MapScale} will equal this value.
   * See {@link Map.mapScale map.MapScale} for additional details on map scales.
   * </p>
   * Non-uniform zooming (non-georeferenced, 2D views only):
   * You can use separate scales for the x- and y-axis.
   * To achieve this, you assign an object literal to the targetScale option.
   * The object literal has to have one or two properties:
   * <ul>
   *   <li><b>x</b> The target scale for the x-axis.</li>
   *   <li><b>y</b> The target scale for the y-axis.</li>
   * </ul>
   */
  targetScale?: number | {
    x: number;
    y: number;
  };
  /**
   * The {@link Point} to zoom in to or out from.
   * This point will remain <i>fixed on the map</i> while the scale changes.
   * Can be a view, model or map Point.
   * When omitted, will default to the map's view center.
   * <p>
   *   Note that <code>location</code> will not be moved to the center of the map!
   *   Think of it as zooming in with the scroll wheel
   *   on a location that is <i>not</i> the center of the map.
   *   In this case, <code>location</code> is the location (in pixel coordinates) of the mouse cursor.
   *   The point under the cursor remains fixed, while the scale changes.
   * </p>
   */
  location?: Point;
  /**
   * Indicates whether or not the target zoom level should be snapped
   * to layer scale levels, to allow for pixel-perfect display of raster layers.
   * Only has effect on 2D maps. Note that this flag has an effect on the target zoom level
   * of the zoom operation. When omitted, this defaults to
   * {@link MapNavigator.defaults defaults.snapToScaleLevels}.
   */
  snapToScaleLevels?: boolean;
  /**
   * When falsy, the zoom operation will be immediate.
   * When truthy, the zoom operation will be animated.
   *
   * The default value is false.
   *
   * Regardless of the value of 'animate', you have to wait for the returned Promise to resolve to ensure that the map
   * has navigated to the target position.
   * To alter the animation, you can assign an {@link MapNavigatorAnimationOptions} to this option.
   */
  animate?: MapNavigatorAnimationOptions | boolean;
}
/**
 * The options for a rotate operation.
 */
export interface MapNavigatorRotateOptions {
  /**
   * The target angle of the camera rotation (2D only).
   * The rotation of the 2D camera is measured in degrees (positive is clockwise).
   * A value of 0 means the map is not rotated ('up' in the map's reference is also 'up' on the screen).
   * After the rotate operation finishes, the map's rotation will equal this value.
   */
  targetRotation?: number;
  /**
   * The value to add to the current camera rotation (2D only).
   * The rotation of the 2D camera is measured in degrees (positive is clockwise).
   * A value of 0 means the map is not rotated ('up' in the map's reference is also 'up' on the screen).
   * After the rotate operation finishes, the camera's rotation will equal its value before the operation.
   * plus the value of deltaRotation.
   * Defaults to 0.
   */
  deltaRotation?: number;
  /**
   * The target yaw for the rotate operation (3D only).
   * Yaw is defined as the orientation (or "heading") of the map's camera
   * in the ground plane. A value of 0 points the camera towards the North pole;
   * the angle increases in clockwise direction.
   * After the rotate operation finishes, the camera yaw will equal this value.
   * Defaults to the current yaw of the map's camera.
   */
  targetYaw?: number;
  /**
   * The target pitch for the rotate operation (3D only).
   * Pitch is defined as the camera's "tilt" angle.
   * A value of 0 points the camera towards the horizon (i.e. horizontally);
   * -90 points straight down towards the ground and +90 points straight up.
   * After the rotate operation finishes, the camera pitch will equal this value.
   * Defaults to the current pitch value of the map's camera.
   */
  targetPitch?: number;
  /**
   * The value to add to the current camera yaw (3D only).
   * Yaw is defined as the orientation (or "heading") of the map's camera
   * in the ground plane. A value of 0 points the camera towards the North pole;
   * the angle increases in clockwise direction.
   * After the rotate operation finishes, the camera yaw will equal its value before from before
   * the operation, plus the value of deltaYaw.
   * Defaults to 0.
   */
  deltaYaw?: number;
  /**
   * The value to add the current camera pitch (3D only).
   * Pitch is defined as the camera's "tilt" angle.
   * A value of 0 points the camera towards the horizon (i.e. horizontally);
   * -90 points straight down towards the ground and +90 points straight up.
   * After the rotate operation finishes, the camera's pitch will equal its value from before the operation
   * plus the value of deltaPitch.
   * Defaults to 0.
   */
  deltaPitch?: number;
  /**
   * Rotation will happen around this {@link Point}.
   * Can be in a model, map or view reference.
   * When omitted, defaults the map's view center.
   */
  center?: Point;
  /**
   * When falsy, the rotate operation will be immediate.
   * When truthy, the rotate operation will be animated.
   *
   * The default value is false.
   *
   * Regardless of the value of 'animate', you have to wait for the returned Promise to resolve to ensure that the map
   * has navigated to the target position.
   * To alter the animation, you can assign an {@link MapNavigatorAnimationOptions} to this option.
   */
  animate?: MapNavigatorAnimationOptions | boolean;
}
/**
 * The options for a look from operation.
 */
export interface MapNavigatorLookFromOptions {
  /**
   * When falsy, the lookFrom operation will be immediate.
   * When truthy, the lookFrom operation will be animated.
   *
   * The default value is false.
   *
   * Regardless of the value of 'animate', you have to wait for the returned Promise to resolve to ensure that the map
   * has navigated to the target position.
   * To alter the animation, you can assign an {@link MapNavigatorAnimationOptions} to this option.
   */
  animate?: MapNavigatorAnimationOptions | boolean;
}
/**
 * An object describing the default values used in {@link MapNavigator}.
 */
export interface MapNavigatorDefaults {
  /**
   * Describes the defaults for the {@link MapNavigator.pan} operation.
   */
  pan: MapNavigatorPanOptions;
  /**
   * Describes the defaults for the {@link MapNavigator.rotate} operation.
   */
  rotate: MapNavigatorRotateOptions;
  /**
   * Describes the defaults for the {@link MapNavigator.zoom} operation.
   */
  zoom: MapNavigatorZoomOptions;
  /**
   * Describes the defaults for the {@link MapNavigator.fit} operation.
   */
  fit: MapNavigatorFitOptions;
  /**
   * Describes the defaults for the {@link MapNavigator.lookFrom} operation.
   */
  lookFrom: MapNavigatorLookFromOptions;
  /**
   * Indicates whether or not navigation operations that affect
   * scale levels ({@link MapNavigator.fit}) should
   * snap to scale levels. Enabling this ensures pixel-perfect display
   * of raster layers when fitting or zooming. Disabling this allows
   * for more fine-grained control over zoom and fit levels.
   * Initially, scale snapping is disabled.
   *
   * This property only affects 2D maps.
   *
   * Note that adding a GoogleLayer to the Map will
   * force this default to true (a GoogleLayer will not render anything
   * if the map is not exactly at the correct scale level).
   */
  snapToScaleLevels: boolean;
}
/**
 *  <code>MapNavigator</code> provides utility functions to navigate the map.
 *
 *  <p>
 *  A <code>MapNavigator</code> instance can be obtained through the
 *  {@link Map.mapNavigator map.mapNavigator} property.
 *  </p>
 *
 *  <p>
 *  All operations are supported in both 2D and 3D.
 *  All operations also work on non-georeferenced views (e.g. vertical views or timelines).
 *  </p>
 *
 *  <p>
 *  All operations can be immediate or animated.
 *  The following operations are supported:
 *  <ul>
 *    <li>{@link pan}</li> Translate the map so that a given point ends up at a certain location in the view.
 *    <li>{@link zoom}</li>  Change the scale of the map. You can either zoom with a factor or zoom up to a target scale.
 *    <li>{@link rotate}</li>  Rotate the map. You can either rotate towards a target angle or add a delta angle to the current rotation of the camera.
 *    <li>{@link fit}</li> Fit the map on a target bounds.
 *  </ul>
 *  </p>
 *
 *  <p>
 *  Most parameters take a point in either view (<code>point.reference === null</code>),
 *  model (<code>point.reference !== null</code>)
 *  or map coordinates (<code>point.reference === map.reference</code>).
 *  See the JSdoc to check in which reference a point argument can be.
 *  </p>
 *
 *
 *  <p>
 *  Note that the Map can have navigation restrictions by using constraints.
 *  Constraints can be set on the <code>MapNavigator</code> via {@link constraints mapNavigator.constraints}.
 *  A detailed description of the available constraints and their behavior can be found in the documentation of
 *  {@link MapNavigatorConstraints}
 *
 *  When these constraints are set,
 *  it is not possible to violate these constraints by using the <code>MapNavigator</code>.
 *  However, if you use the map's underlying {@link Camera camera} directly, the constraints are not applied.
 *  </p>
 *
 */
export declare class MapNavigator {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * @deprecated
   * @see {@link enabledOperations}
   */
  static ALL: number;
  /**
   * @deprecated
   * @see {@link enabledOperations}
   */
  static NONE: number;
  /**
   * <p>
   * Fits a specified area into a view using an animation. The map will
   * be modified so that the area specified by the bounds-parameters is in the center.
   * </p>
   *
   * <p>
   * It is both possible to either maintain the map's current scale ratio, or have it adapt in order to
   * obtain a perfect fit.  The scale ratio is the ratio between the scale for the x-axis
   * and the scale ratio of the y-axis.
   * <p>
   *
   *   <p>
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   * </p>
   *
   * @param bounds The area to show. It is interpreted as a 2D bounds
   *                (i.e. the depth will not be taken into account).
   * @param allowWarpXYAxis Indicates whether the scale ratio will be adapted to
   *  be able to obtain a perfect fit.  The default value is <code>false</code>.
   *  Perfect fit means the existing aspect ratio between the horizontal and
   *  vertical scale of the map will be adjusted independently.
   *  <p>
   *  Consider a map which is shown in a wide
   *  rectangular screenport (e.g. 16:9) but on which you perform a perfect fit
   *  with a square bounds. Doing so would cause a warping effect, compressing
   *  the y-axis to ensure it is in the view.  However, when the data on the
   *  map is specified in a coordinates system in which x and y do not represent
   *  the same kind of quantity, setting <code>allowWarpXYAxis</code> to
   *  <code>true</code> is a convenient way to show all data on the map in that
   *  bounds, without any extra padding and the associated loss of screen
   *  real-estate. In such a case, a stretch or compression along an axis may be
   *  a desired effect.
   *  </p>
   *  <p>
   *  This can only be set to
   *  <code>true</code> if the Map is used to visualize data
   *  that is not spatial in nature. For example,
   *  when the Map's reference axes represent units of measure like
   *  speed, distance, or volume.
   *  See {@link createCartesianReference ReferenceProvider.createCartesianReference}
   *  for more information on how to create such a reference.
   *  </p>
   *
   * @deprecated mapNavigator.fit(bounds, allowWarpXYAxis) has been deprecated. Use the new MapNavigator.fit(fitOptions instead).
   *             You can replace this call with the new equivalent {@link fit}:
   *
   * ```javascript
   * map.mapNavigator.fit({bounds: bounds, allowWarpXYAxis: allowWarpXYAxis, animate: true});
   * ```
   * @returns A promise which represents the completion of the fit operation. The promise will be
   * resolved when the fit operation has completed. The promise will be rejected when the (animated) fit operation is interrupted.
   *
   */
  fit(bounds: Bounds, allowWarpXYAxis?: boolean): Promise<void>;
  /**
   * Performs a fit operation.
   * <p/>
   * Use this operation to ensure that the map covers a certain area.
   *
   * <p>
   * <b>Note</b>: For backwards compatibility,
   * when a {@link Bounds} is passed instead of an options literal,
   * the deprecated version of fit will be used.
   * </p>
   *
   * <p>
   * After the fit operation, the view extents will fit the extents of fitOptions.target.
   * The map's rotation might be affected by the fit operation. It is not guaranteed that rotation will be preserved.
   * </p>
   *
   * @param fitOptions The options for the fit operation.
   *
   * @return A promise that will be resolved after the fit operation has finished. You have to wait for the promise to
   *   resolve, even for non-animated fits.
   *   <p>
   *   For animated fits, the returned Promise will be resolved when the fit animation
   *   has completely finished. If the fit animation is interrupted (for example, by another animation),
   *   the promise is rejected.
   *   </p>
   */
  fit(fitOptions: MapNavigatorFitOptions): Promise<void>;
  /**
   * Performs a pan operation.
   * <p/>
   * Use this operation to:
   * <ul>
   *   <li>center the map on a certain model or world location</li>
   *   <li>shift the map in a certain direction by a certain amount in pixels or world units</li>
   * </ul>
   *
   * <p>
   * After the pan operation, <code>targetLocation</code> will be at <code>toViewLocation</code>.
   * </p>
   *
   * @param panOptions The options for the pan operation
   *
   * @return A promise that will be resolved after the pan operation has finished. You have to wait for the promise to
   *   resolve, even for non-animated pan operations.
   *   <p>
   *   For animated panning, the returned Promise will be resolved when the pan animation
   *   has completely finished. If the pan animation is interrupted (for example, by another animation),
   *   the promise is rejected.
   *   </p>
   */
  pan(panOptions: MapNavigatorPanOptions): Promise<void>;
  /**
   * Performs a zoom operation.
   * <p/>
   * Use this operation to:
   * <ul>
   *   <li>zoom in or zoom out by a certain factor</li>
   *   <li>set the scale of the map to a specific scale</li>
   * </ul>
   *
   * <p>
   * You must specify either a factor or a target scale, but you can not use both in the same zoom operation.
   * </p>
   *
   * <p>
   * Can be used for both uniform zooming (same x- and y-scale, commonly used on georeferenced maps) and
   * non-uniform zooming (different x- and y-scale, commonly used for non-georeferenced maps).
   * </p>
   *
   * @param zoomOptions The options for the zoom operation
   *
   * @return A promise that will be resolved after the zoom operation has finished. You have to wait for the promise to
   *   resolve, even for non-animated zoom operations.
   *   <p>
   *   For animated zooming, the returned Promise will be resolved when the pan animation
   *   has completely finished. If the zoom animation is interrupted (for example, by another animation),
   *   the promise is rejected.
   *   </p>
   */
  zoom(zoomOptions: MapNavigatorZoomOptions): Promise<void>;
  /**
   * Performs a rotate operation.
   * Use this operation to:
   * <ul>
   *   <li>rotate to a specific orientation angle (in some projections, this is a heading or azimuth)</li>
   *   <li>rotate by a delta angle relative to the current rotation</li>
   *   <li>adapt camera pitch in 3D</li>
   * </ul>
   *
   * <p>
   * If you rotate to a target angle, you cannot rotate with a delta and vice-versa.
   * </p>
   *
   * <p>
   * 2D only options will be ignored in 3D (and vice-versa).
   * </p>
   *
   * <p>
   * Note that map rotation will be disabled (fixed to 0) in the following cases:
   * <ul>
   *  <li>A navigation bounds constraint is set on the map (cfr. {@link constraints})</li>
   *  <li>Axes are configured on the map</li>
   *  <li>There is a {@link GoogleLayer} present on the map</li>
   * </ul>
   * </p>
   *
   * @param rotateOptions The options for the rotate operation
   *
   * @return A promise that will be resolved after the rotate operation has finished. You have to wait for the promise to
   *   resolve, even for non-animated rotate operations.
   *   <p>
   *   For animated rotations, the returned Promise will be resolved when the rotate animation
   *   has completely finished. If the rotate animation is interrupted (for example, by another animation),
   *   the promise is rejected.
   *   </p>
   */
  rotate(rotateOptions: MapNavigatorRotateOptions): Promise<void>;
  /**
   * Perform an animated pan to the of the given bounded defined in the given geographic reference.
   * <p/>
   * This method differs from {@link setCenter}
   * in the fact that panning is performed through a smooth animation, while the {@link setCenter} method
   * immediately updates the map.
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param bounded
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   * @deprecated mapNavigator.panTo(bounded) has been deprecated. Use the new MapNavigator.pan(panOptions) instead.
   *             You can replace this call with the new equivalent {@link pan}:
   *
   * ```javascript
   * map.mapNavigator.pan({targetLocation: bounded.bounds.focusPoint, animate: true});
   * ```
   */
  panTo(bounded: Bounded): Promise<void>;
  /**
   * Scroll or pan the view by the given amount in pixel coordinates.
   * This method has an immediate effect and will interrupt ongoing animations.
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param deltaX the horizontal distance (in pixels).
   * @param deltaY the vertical distance (in pixels).
   * @deprecated mapNavigator.panBy(deltaX, deltaY) has been deprecated. Use the new MapNavigator.pan(panOptions) instead.
   *             You can replace this call with a {@link pan} call that pans the center of the view to an offsetted location:
   *
   * ```javascript
   * var centerOfView = createPoint(null, [map.viewSize[0] / 2, map.viewSize[1] / 2]);
   * var offsetFromCenterOfView = centerOfView.copy();
   * offsetFromCenterOfView.translate(deltaX, deltaY);
   * map.mapNavigator.pan({targetLocation: centerOfView, toViewLocation: offsetFromCenterOfView});
   * ```
   */
  panBy(deltaX: number, deltaY: number): void;
  /**
   * Position the map so that the given view point (in pixels) maps onto the given spatial coordinate.
   * This method has an immediate effect and will interrupt ongoing animations.
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @deprecated mapNavigator.setCenter() has been deprecated. Use the new MapNavigator.pan(panOptions) instead.
   *             You can replace this call with the new equivalent {@link pan}:
   *
   * ```javascript
   * map.mapNavigator.pan({targetLocation: spatialPoint, toViewLocation: viewPoint}));
   * ```
   * @param viewPoint
   * @param spatialPoint
   */
  setCenter(viewPoint: Point, spatialPoint: Point): void;
  /**
   * Perform an animated zoom so that the map has the desired scale.
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param scale the desired scale.
   *
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   * @deprecated mapNavigator.zoomTo(scale) has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({targetScale: scale, animate: true});
   * ```
   */
  zoomTo(scale: number): Promise<void>;
  /**
   * Perform an animated zoom so that the map has the desired, non-uniform scale.  Non uniform: the scale
   * to be applied on the X-axis can differ from the scale applied on the Y axis.  Scale factors for each
   * axis must be passed in the scale array.
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param  scale The desired scales for each view axis.
   *
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   *
   * @deprecated mapNavigator.zoomTo(scale) has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({targetScale: scale, animate: true});
   * ```
   */
  zoomTo(scale: [number, number]): Promise<void>;
  /**
   *  Perform an animated zoom out (by a fixed amount).
   *
   *  Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   *
   * @deprecated mapNavigator.zoomOut() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({factor: 0.5, animate: true});
   * ```
   */
  zoomOut(): Promise<void>;
  /**
   * Perform an animated zoom-out, fixing on the given view position (passed as x and y coordinates)
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param x view x-coordinate
   * @param y view y-coordinate
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   *
   * @deprecated mapNavigator.zoomOutFixing() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({factor: 0.5, location: createPoint(null, [x, y]), animate: true});
   * ```
   */
  zoomOutFixing(x: number, y: number): Promise<void>;
  /**
   * Zoom out on the given view position, with the desired scale factors.
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param x view x-coordinate
   * @param y view y-coordinate
   * @param xScaleFactor the scale factor over the X axis to apply (for example, a value of 2 halves the scale)
   * @param yScaleFactor the scale factor over the Y axis to apply (for example, a value of 2 halves the scale)
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   *
   * @deprecated mapNavigator.zoomOutFixingWithScaleFactor() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({factor: {x: 1 / xScaleFactor, y: 1 / yScaleFactor}, location: createPoint(null, [x, y]), animate: true});
   * ```
   */
  zoomOutFixingWithScaleFactor(x: number, y: number, xScaleFactor: number, yScaleFactor: number): Promise<void>;
  /**
   * Perform an animated zoom in (by a fixed amount).
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   *
   * @deprecated mapNavigator.zoomIn() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({factor: 2.0, animate: true});
   * ```
   */
  zoomIn(): Promise<void>;
  /**
   * Perform an animation zoom-in, fixing on the given view position (passed as x and y coordinates)
   *
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param x view x-coordinate
   * @param y view y-coordinate
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   *
   * @deprecated mapNavigator.zoomInFixing() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({factor: 2.0, location: createPoint(null, [x, y]), animate: true});
   * ```
   */
  zoomInFixing(x: number, y: number): Promise<void>;
  /**
   * Zoom in on the given view position, with the desired scale factors.
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param x view x-coordinate
   * @param y view y-coordinate
   * @param xScaleFactor the scale factor over the X axis to apply (for example, a value of 2 doubles the scale)
   * @param yScaleFactor the scale factor over the Y axis to apply (for example, a value of 2 doubles the scale)
   *
   * @returns A promise which represents the completion of the animation. The promise will be resolved when the animation has completed. The promise will be rejected
   * when the animation is interrupted.
   *
   * @deprecated mapNavigator.zoomInFixingWithScaleFactor() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({factor: {x: xScaleFactor, y: yScaleFactor}, location: createPoint(null, [x, y]), animate: true});
   * ```
   */
  zoomInFixingWithScaleFactor(x: number, y: number, xScaleFactor: number, yScaleFactor: number): Promise<void>;
  /**
   * Sets the scale on the map, while fixing to the given point in pixel coordinates.
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param scale the desired scale
   * @param x the x-coordinate to fix on
   * @param y the y-coordinate to fix on
   *
   * @deprecated mapNavigator.setScaleFixing() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({targetScale: scale, location: createPoint(null, [x,y]});
   * ```
   */
  setScaleFixing(scale: number, x: number, y: number): void;
  /**
   * Sets a non-uniform scale on the map, while fixing to the given point in pixel coordinates.  Non uniform: the
   * scale to be applied on the X-axis can differ from the scale applied on the Y axis.  Scale factors for
   * each axis must be applied in the scale array.
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param scale the desired scale factors in an array, one scale factor for each axis
   * @param x the x-coordinate to fix on
   * @param y the y-coordinate to fix on
   *
   * @deprecated mapNavigator.setScaleFixing() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({targetScale: {x: scale[0], y: scale[1]}, location: createPoint(null, [x,y]});
   * ```
   */
  setScaleFixing(scale: [number, number], x: number, y: number): void;
  /**
   * Sets the scale of the map.
   * This method has an immediate effect and will interrupt ongoing animations.
   * Note that this method will only have an effect if enabledOperations is set to ALL.
   *
   * @param scale the desired scale
   *
   * @deprecated mapNavigator.setScale() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({targetScale: scale});
   * ```
   */
  setScale(scale: number): void;
  /**
   * Sets the scale of the map in a non uniform way. Non uniform: the scale to be applied on the X-axis can differ
   * from the scale applied on the Y axis.  Scale factors for each axis must be passed in the scale array.
   *
   * @param scale An array containing scale factors for each axis; First element in the array contains the
   *                      scale factor for the X-axis, the second element the scale factor for the Y axis.
   *
   * @deprecated mapNavigator.setScale() has been deprecated. Use the new MapNavigator.zoom(zoomOptions) instead.
   *             You can replace this call with the new equivalent {@link zoom}:
   *
   * ```javascript
   * map.mapNavigator.zoom({targetScale: {x: scale[0], y: scale[1]}});
   * ```
   */
  setScale(scale: [number, number]): void;
  /**
   * Positions the viewer at a given eye point. This method can be used to look around freely from a fixed position.
   *
   * This method will only perform an operation if the Map's reference ({@link Map.reference}) is a geocentric 3D reference (e.g. EPSG:4978).
   * If the map is not a 3D map, this method will throw an error.
   *
   * @param eyePoint the point at which to put the eye point. The point can have any spatial reference.
   * @param yaw the desired yaw angle from the eye point to the reference point (in degrees). This is similar to turning your head left to right. 0 means looking north, and the degrees count clockwise.
   * @param pitch the desired pitch angle from the eye point to the reference point (in degrees). This value must be between -89 and 89 degrees. This is similar to nodding your head up and down. -89 means looking straight down, 0 is looking straight ahead to the horizon, and 89 is degrees is looking straight up.
   * @param roll the desired roll angle of the viewer around its line-of-sight axis (in degrees). This is similar to turning your entire head upside down (if you could). The rotation is clockwise.
   * @param options the options for the lookFrom operation
   * @return A promise that will be resolved after the lookFrom operation has finished. You have to wait for the promise to
   *   resolve, even for non-animated lookFrom operations.
   *   <p>
   *   For animated lookFrom operations, the returned Promise will be resolved when the lookFrom animation
   *   has completely finished. If the lookFrom animation is interrupted (for example, by another animation),
   *   the promise is rejected.
   *   </p>
   */
  lookFrom(eyePoint: Point, yaw: number, pitch: number, roll: number, options?: MapNavigatorLookFromOptions): Promise<void>;
  /**
   * Returns the current constraints applied on the Map
   */
  get constraints(): MapNavigatorConstraints;
  /**
   * Sets constraints on the map
   */
  set constraints(value: MapNavigatorConstraints);
  /**
   *  A property describing the currently enabled operations. Valid values
   *  are MapNavigator.ALL and MapNavigator.NONE. Set to MapNavigator.ALL by default.
   *
   *  @deprecated <code>mapNavigator.enabledOperations</code> has been deprecated.
   *              <p>
   *              This property will only be respected by the deprecated <code>MapNavigator</code> methods.
   *              The new methods ({@link pan}, {@link rotate}, {@link zoom} and {@link fit}),
   *              will ignore <code>enabledOperations</code>.
   *              </p><p>
   *              As a replacement, you can use {@link constraints} to configure bounds and scale limits
   *              to completely 'freeze' the map.
   *              </p><p>
   *              If you only want to disable user interaction, you also set a 'no-op'
   *              {@link Map.controller controller} on the map.
   *              This is a controller that consumes all gesture events, without doing anything.
   *              </p>
   */
  get enabledOperations(): number;
  set enabledOperations(operations: number);
  /**
   * An object describing the default values used in this <code>MapNavigator</code>.
   * <p>
   * Manipulate this object to change the default animation durations (or easing functions) for the different
   * MapNavigator operations.
   * </p>
   * You can assign individual properties, like so:
   *
   * ```javascript
   *   mapNavigator.defaults.pan.duration = 5000; //change the default pan duration to 5000ms
   * ```
   */
  get defaults(): MapNavigatorDefaults;
  set defaults(defaults: MapNavigatorDefaults);
}