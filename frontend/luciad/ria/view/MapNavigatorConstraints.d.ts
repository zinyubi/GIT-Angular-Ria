import { Bounds } from "../shape/Bounds.js";
/**
 * Options to configure the {@link MapNavigatorConstraints.above} constraint.
 * Note that for 3D cartesian maps, the above constraint is always disabled, regardless of the settings.
 */
export interface AboveConstraintOptions {
  /**
   * Defines whether or not the camera must stay above the terrain.
   * The default value is true, except for 3D cartesian maps where it is false.
   */
  terrain?: boolean;
  /**
   * Defines whether or not the camera must stay above a mesh in the scene.
   * The default value is false.
   */
  mesh?: boolean;
  /**
   * The minimum altitude, in meters, the camera should stay above the terrain and/or mesh.
   *
   * @default 20
   */
  minAltitude?: number;
  /**
   * The maximum altitude, in meters, the camera should stay above the terrain and/or mesh.
   *
   * Set this to <code>null</code> to disable the max altitude constraint.
   *
   * @default null
   * @since 2024.1
   */
  maxAltitude?: number | null;
}
/**
 * Options for the {@link MapNavigatorConstraints.scale} constraint.
 */
export interface ScaleConstraintOptions {
  /**
   * The minimum scale value. When a single <code>Number</code> is used, the minimum
   * scale is applied to both the x and y axis. By setting an array with two elements (e.g. [2e-8, 2e-8]),
   * the minimum scale can be configured differently for the x and y axis. The Default value is [0, 0]
   */
  minScale?: number | [number, number];
  /**
   * The maximum scale value. When a single <code>Number</code> is used, the maximum
   * scale is applied to both the x and y axis. By setting an array with two elements (e.g. [1e-3, 1e-3]),
   * the maximum scale can be configured differently for the x and y axis. The Default value is [Infinity, Infinity]
   */
  maxScale?: number | [number, number];
}
/**
 * Padding options that can be used for the {@link MapNavigatorConstraints.limitBounds} constraint.
 */
export interface PaddingConstraintOptions {
  /**
   * Left padding defined in pixels. The default value is 0.
   */
  left?: number;
  /**
   * Right padding defined in pixels. The default value is 0.
   */
  right?: number;
  /**
   * Top padding defined in pixels. The default value is 0.
   */
  top?: number;
  /**
   * Bottom padding defined in pixels. The default value is 0.
   */
  bottom?: number;
}
/**
 * Options for the {@link MapNavigatorConstraints.limitBounds} constraint.
 */
export interface LimitBoundsOptions {
  /**
   * The bounds to constrain the main camera. The default value is null
   */
  bounds?: Bounds | null;
  /**
   * The padding for the bounds constraint.
   */
  padding?: PaddingConstraintOptions;
}
/**
 * Options for {@link MapNavigatorConstraints.wrapAroundWorld} constraint.
 * @since 2023.1
 */
export interface WrapAroundWorldConstraintOptions {
  /**
   * The maximum number of worlds that can be visible on screen.
   * It must be either <code>null</code> (no limit) or a strictly positive number.
   *
   * @default 1
   */
  maxNumberOfWorlds?: number | null;
}
/**
 * <p> The following navigation constraints used to restrict navigation using {@link MapNavigator.constraints}.
 * <ul>
 *   <li>{@link above}: keeps the camera above terrain and/or above meshes.</li>
 *   <li>{@link limitBounds}: keeps the camera inside the defined bounds.</li>
 *   <li>{@link scale}: prevents the camera from zooming in or out too far.</li>
 * </ul>
 * </p>
 * Note that if you use the map's underlying {@link Camera} directly, the constraints are not applied.
 * </p>
 * <p> By default only the above terrain constraint is enabled.
 * Constraints can be enabled and disabled via {@link MapNavigator.constraints}.
 * <p>This example disables the above constraint and sets the minimum scale constraint value to 1/100000.
 * For other options check the field parameters.</p>
 *
 * ```javascript
 * mapNavigator.constraints.above = null;
 *
 * mapNavigator.constraints.scale = {
 *     minScale: 1/100000
 *   };
 * ```
 *
 * @since 2019.0
 */
export interface MapNavigatorConstraints {
  /**
   * <p>The above constraint can be used to constrain the camera to remain above the terrain and/or mesh in a 3D map.
   * For 3D cartesian maps, the above constraint is always disabled, regardless of what is configured.
   * </p>
   *
   * <p>This constraint is only applicable to 3D WebGL maps (3D hardware accelerated maps).</p>
   *
   * <p>The above camera constraint can be configured with the {@link AboveConstraintOptions}</p>
   *
   * When set to null {@link AboveConstraintOptions.terrain} and {@link AboveConstraintOptions.mesh} will be set to false
   * and {@link AboveConstraintOptions.minAltitude} set to 0.
   *
   * ```javascript
   * The following example applies above terrain constraints and sets the minimum altitude to 20m
   * mapNavigator.constraints = {
   *     above: {
   *       terrain: true,
   *       mesh: false,
   *       minAltitude: 20
   *     }
   * }
   * ```
   *
   */
  above?: AboveConstraintOptions | null;
  /**
   * <p>The bounds constraint can be used to restrict navigation to the specified bounds.
   * By default this constraint is disabled.</p>
   *
   * <p>This constraint only works in 2D</p>
   *
   * <p>The {@link LimitBoundsOptions} can be used to configure the bounds constraint:</p>
   *
   * <p>When set to null, all values will be restored to their default values.</p>
   *
   * <p>A conflict may occur when you have set both a scale and a bounds constraint. This can happen when, for example, the 'maxScale'
   * constraint is set to a country level scale, while the bounds constraint is set to the bounds of a city. In such a case,
   * the bounds constraint is respected over the `maxScale`.To prevent such inconsistencies, it is best to use either the bounds
   * constraint or the scale constraint to restrict the zooming behavior of the map.</p>
   *
   * <p>If this constraint is enabled, map rotation is not possible.</p>
   *
   * <p>The following example configures the bounds constraint with bounds and a padding for the top and right
   * side of 5 pixels.</p>
   *
   * ```javascript
   * mapNavigator.constraints = {
   *  limitBounds: {
   *    bounds: createBounds( ReferenceProvider.getReference("CRS:84"), [50, 4, 20, 20]),
   *    padding: {
   *      right: 5,
   *      top: 5
   *    }
   *   }
   *  }
   * ```
   *
   */
  limitBounds?: LimitBoundsOptions | null;
  /**
   *
   * <p>The scale constraint can be used to restrict the map to a min/max scale. By default the scale constraint is
   * disabled.</p>
   *
   * <p>The scale value is the ratio between the distance, as it is measured on the screen of the device, to
   * the distance in the real world.</p>
   *
   * <p>This constraint only works in 2D.</p>
   *
   * The scale constraint can be configured with the {@link ScaleConstraintOptions}.
      * <p>When set to null, all values will be restored to their default values.</p>
   *
   * <p>A conflict may occur when you have set both a scale and a bounds constraint. This can happen when, for example, the 'maxScale'
   * constraint is set to a country level scale, while the bounds constraint is set to the bounds of a city. In such a case,
   * the bounds constraint is respected over the `maxScale`.To prevent such inconsistencies, it is best to use either the bounds
   * constraint or the scale constraint to restrict the zooming behavior of the map.</p>
   *
   * The following example shows how to configure the scale constraint:
   *
   * ```javascript
   * mapNavigator.constraints = {
   *  scale: {
   *    minScale: 2e-8,
   *    maxScale: 1e-4
   *  }
   * }
   * ```
   */
  scale?: ScaleConstraintOptions | null;
  /**
   * A constraint that applies to {@link Map.wrapAroundWorld} maps.
   *
   * By default, a constraint is active that limits the max number of visible worlds to 1.
   * This constraint only has effect on maps that have {@link Map.wrapAroundWorld} enabled.
   *
   * Usage:
   *
   * ```javascript
   * [[include:view/WrapAroundSnippets.ts_MAP_WRAPAROUND_CONSTRAINT]]
   * ```
   *
   * For more information on working with maps that wrap around the dateline, check out the
   * <a href="articles://howto/view/map_wraparound.html">Configuring a map to wrap around the dateline</a> guide.
   *
   * @since 2023.1
   */
  wrapAroundWorld?: WrapAroundWorldConstraintOptions | null;
}