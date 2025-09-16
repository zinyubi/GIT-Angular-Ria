/**
 * The options for the {@link ProjectionTarget.ALL_SURFACES} projection target.
 *
 * @since 2020.1
 * @see {@link ProjectionTarget}
 */
export interface ProjectionTargetAllSurfaceOptions {
  /**
   * Target specifies on which target surfaces to project.
   */
  target: ProjectionTarget.ALL_SURFACES;
}
/**
 * The options for the {@link ProjectionTarget.CLOSEST_SURFACE} projection target.
 *
 * @since 2020.1
 * @see {@link ProjectionTarget}
 */
export interface ProjectionTargetClosestSurfaceOptions {
  /**
   * Target specifies on which target surfaces to project.
   */
  target: ProjectionTarget.CLOSEST_SURFACE;
  /**
   * The opacity of the base layer.
   * The base layer concept is explained in the {@link ProjectionTarget} documentation.
   * Defaults to 0.
   * @see {@link ProjectionTarget}
   */
  baseOpacity?: number;
}
/**
 * Describes on which surfaces a panorama can project.
 *
 * The two options are {@link ProjectionTarget.ALL_SURFACES ALL_SURFACES} and {@link ProjectionTarget.CLOSEST_SURFACE CLOSEST_SURFACE}.
 *
 * The difference between these is most apparent when the camera is not at a panoramic position, e.g. when transitioning between 2 panoramas or
 * when freely moving the camera.  In these cases, the camera typically can see things that are not visible in the panoramic position
 * and thus the panoramas do not cover these areas.<br/>
 *
 * When projecting on all surfaces, the resulting view may be somewhat confusing because walls and objects do not block the projection. <br/>
 *
 * When projecting on the closest surface, the geometries in the vicinity of the panorama are taken into account.  This means the
 * projection only covers what is actually visible for that panorama.  For example, if there is wall in the panorama
 * and that wall is also in the loaded geometry data, the projection will cover the wall but nothing behind the wall.
 * The images below illustrate the difference.
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td><img src="media://panoramics/allsurfaces.png" alt="Example scene with projection target ALL_SURFACES"></td>
 *     <td><img src="media://panoramics/closestsurface.png" alt="Example scene with projection target CLOSEST_SURFACE"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>ALL_SURFACES</td>
 *     <td>CLOSEST_SURFACE</td>
 *   </tr>
 * </table>
 *
 * Using {@link ProjectionTarget.CLOSEST_SURFACE CLOSEST_SURFACE}, the panoramas are painted in 2 distinct steps.  This has a consequence to opacity styling.<br/>
 * <ol>
 *   <li>First, a base layer is painted.  In this layer, when certain areas are in line-of-sight of multiple panoramas, the
 *       images of the closest panorama are used.  So a single panorama is used for every projected pixel but different pixels may be projected from different panoramas.
 *       The base layer is typically used when showing overviews of multiple panoramas or when transitioning between 2 panoramas.<br/>
 *       You can adjust the opacity of the base layer with the {@link ProjectionTargetClosestSurfaceOptions.baseOpacity baseOpacity} property.
 *       By default this is set to 0 so only the layer explained next, in item 2, is visible.  This makes the default behavior of {@link ProjectionTarget.CLOSEST_SURFACE CLOSEST_SURFACE} more
 *       consistent with the behavior of {@link ProjectionTarget.ALL_SURFACES ALL_SURFACES}.</li>
 *   <li>On top of the base layer, a layer is painted in which all the panoramas in line-of-sight are used.  If for a certain pixel multiple panoramas are in line-of-sight,
 *       they are painted on top of each other.  You can use {@link PanoramaStyle.opacity opacity} to blend these panoramas however you like.</li>
 * </ol>
 *
 * Note that using {@link ProjectionTarget.CLOSEST_SURFACE CLOSEST_SURFACE} has a performance impact.<br/>
 * Also note that {@link ProjectionTarget.CLOSEST_SURFACE CLOSEST_SURFACE} has a fixed, finite accuracy.
 * The calculations to determine the closest surface may introduce some visual artifacts in some scenarios.
 *
 * @since 2020.1
 */
export declare enum ProjectionTarget {
  /**
   * Project everywhere.  Geometries do not block the projection.
   */
  ALL_SURFACES = "ALL_SURFACES",
  /**
   * Project on the closest surface only.  No projection on geometries behind the closest surface.
   */
  CLOSEST_SURFACE = "CLOSEST_SURFACE",
}
/**
 * You can re-orient the panorama imagery with these properties if it doesn't align with the environment as-is for example.
 *
 * If your panorama doesn't span the entire 360 degrees but is limited in field-of-view and thus is also pointing in some direction,
 * you can configure the imagery with these properties.
 *
 * @since 2024.1
 */
export interface PanoramaOrientation {
  /**
   * This is an angle, in degrees, indicating the horizontal span over which imagery should be visible.
   *
   * If you only know the aspect ratio (width/height) and {@link fovY}, you can derive fovX as follows:
   * ```javascript
   *  const DEG2RAD = Math.PI / 180;
   *  const RAD2DEG = 180 / Math.PI;
   *  const fovX = 2 * Math.atan(Math.tan(fovY * DEG2RAD / 2) * aspectRatio) * RAD2DEG;
   * ```
   *
   * A value of 0 indicates that the imagery has no limited horizontal field of view.
   * The imagery spans the entire 360 degrees (horizontally) around its location.
   *
   * @default 0
   */
  fovX?: number;
  /**
   * This is an angle, in degrees, indicating the vertical span (or field-of-view) over which imagery should be visible.
   *
   * If you only know the aspect ratio (width/height) and {@link fovX}, you can derive fovY as follows:
   * ```javascript
   *  const DEG2RAD = Math.PI / 180;
   *  const RAD2DEG = 180 / Math.PI;
   *  const fovY = 2 * Math.atan(Math.tan(fovX * DEG2RAD / 2) / aspectRatio) * RAD2DEG;
   * ```
   *
   * A value of 0 indicates that the imagery has no limited vertical field of view.
   * The imagery spans the entire 180 degrees (vertically) around its location.
   *
   * @default 0
   *
   */
  fovY?: number;
  /**
   * This is an angle, in degrees, from the north direction (0 = north), increasing clockwise (90 = east).
   * Defaults to 0 (facing north).
   * For 3D cartesian references, the y-direction serves as the north direction.
   */
  yaw?: number;
  /**
   * This is an angle, in degrees, relative to the horizon, also known as "tilt". A value of 0 points towards the horizon (meaning a horizontal position).
   * -90 points the imagery straight down towards the ground and +90 straight up, towards the sky.
   * For 3D cartesian references, -90 points in the negative z direction and +90 in the positive z direction.
   *
   * @default 0
   */
  pitch?: number;
  /**
   * This is an angle, in degrees, representing a rotation around the forward direction, also known as "bank".
   * Negative angles bank left; positive angles bank right.
   *
   * @default 0
   */
  roll?: number;
}
/**
 * Styling options for panoramas.
 * @see {@link GeoCanvas.drawPanorama}
 * @since 2020.1
 */
export interface PanoramaStyle {
  /**
   * The opacity of the panorama. Defaults to 1.
   */
  opacity?: number;
  /**
   * The opacity of the panorama in areas where there is no geometry to project on.
   * This is usually the sky.  Defaults to 1.
   */
  skyOpacity?: number;
  /**
   * The orientation of the panorama. This is an angle, in degrees, from the north direction (0 = north), increasing clockwise (90 = east).
   * Defaults to 0 (facing north).
   * Alternatively, you can supply a {@link PanoramaOrientation} for full configurability.
   */
  orientation?: number | PanoramaOrientation;
  /**
   * Describes the projection details for the panorama. <br/>
   */
  projection?: ProjectionTargetAllSurfaceOptions | ProjectionTargetClosestSurfaceOptions;
}