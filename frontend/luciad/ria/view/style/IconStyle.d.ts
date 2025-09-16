import { LineStyle } from "./LineStyle.js";
import { OcclusionMode } from "./OcclusionMode.js";
import { UnitOfMeasure } from "../../uom/UnitOfMeasure.js";
import { BloomStyle } from "./BloomStyle.js";
import { DrapeTarget } from "./DrapeTarget.js";
/**
 * Base interface for an icon style.
 */
export interface GenericIconStyle {
  /**
   * The x coordinate of the anchor for this icon. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "50%", which implies that the anchor-point is at the center of the image.
   * <p> The anchor is always defined with respect to the original image size. This means that a scaled image will automatically
   * have its anchor-point scaled.</p>
   * <p>The horizontal anchorpoint is always defined from left to right. <code>{ anchorX:"0px" }</code> is the left of the image, and positive values
   * are points to the right.</p>
   * <p>The anchor point must be within the bounds of the original image size.</p>
   *
   * By default "50%"
   */
  anchorX?: string;
  /**
   * The y coordinate of the anchor for this icon. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "50%", which implies that the anchor-point is at the center of the image.
   * <p> The anchor is always defined with respect to the original image size. This means that a scaled image will automatically
   * have its anchor-point scaled.</p>
   * <p>The vertical anchorpoint is always defined from top to bottom. <code>{ anchorY:"0px" }</code> is the top of the image, and positive values
   * are points to the bottom.</p>
   * <p>The anchor point must be within the bounds of the original image size.</p>
   *
   * By default "50%"
   */
  anchorY?: string;
  /**
   * Whether this icon should be draped on terrain, or not be draped at all.
   *
   * This property only exists for backwards compatibility. You should use {@link drapeTarget} instead.
   * <code>false</code> is equivalent to {@link DrapeTarget.NOT_DRAPED} and <code>true</code> is equivalent to
   * {@link DrapeTarget.TERRAIN}.
   *
   * This setting is only relevant for 3D geospatial maps. For 2D maps and 3D cartesian maps, this setting is ignored and {@link DrapeTarget.NOT_DRAPED} is used.
   *
   * @see {@link ShapeStyle.drapeTarget}
   * @see {@link RasterStyle.drapeTarget}
   * @see {@link TileSet3DLayer.isDrapeTarget}
   * @deprecated Use {@link drapeTarget} instead.
   */
  draped?: boolean;
  /**
   * The drape target of this icon.
   *
   * Indicates if this shape should be draped on {@link DrapeTarget.TERRAIN terrain},
   * {@link DrapeTarget.MESH 3D Tiles meshes},
   * {@link DrapeTarget.NOT_DRAPED not at all}.
   *
   * If <code>draped</code> or <code>drapeTarget</code> is not specified and the shape has zero Z, it will be draped {@link DrapeTarget.TERRAIN on terrain}.
   * If it has non-zero Z, it will {@link DrapeTarget.NOT_DRAPED not be draped}.
   *
   * This setting is only relevant for 3D geospatial maps. For 2D maps and 3D cartesian maps, this setting is ignored and {@link DrapeTarget.NOT_DRAPED} is used.
   *
   * @see {@link ShapeStyle.drapeTarget}
   * @see {@link RasterStyle.drapeTarget}
   * @see {@link TileSet3DLayer.isDrapeTarget}
   * @since 2022.1
   */
  drapeTarget?: DrapeTarget;
  /**
   * The heading of the icon, defined as an azimuth: the clockwise angle from the north direction, in degrees
   * (range <code>[0, 360[</code>). A heading of 0 means the icon will always be pointing towards the north pole.
   * A value of 90 will make the icon always point towards the east, etc.
   * A heading that is not a <code>Number</code> or <code>Number.NaN</code>, is ignored.
   *
   * <p>
   * The heading property can be used together with {@link rotation}.
   * The {@link rotation} can be used to 'correct' a left-pointing arrow icon image,
   * to make it point upwards (by setting a rotation of 90).
   * Then, using a heading of 0 makes the arrow icon always point towards the north pole.
   * </p>
   *
   * By default <code>Number.NaN</code>
   */
  heading?: number;
  /**
   * The target height of the image, with a given unit of measure.
   *
   * This can be either percentage, pixels or a length unit.
   * For example: "16px", "50%" or "25.2m".
   * Valid length units are {@link UnitOfMeasure uom}s
   * {@link getUnitOfMeasure registered in LuciadRIA}.
   * The default is "100%", which implies that the icon is painted at its original resolution.
   *
   * If this is a number, the height is interpreted in the units defined by {@link GenericIconStyle.uom uom}.
   * If no {@link GenericIconStyle.uom uom} is set, the height is interpreted in pixels.
   *
   * You cannot mix world lengths and pixels for height and {@link width}.
   * If height is expressed in a length unit, {@link width} must be as well (and vice-versa).
   */
  height?: string | number;
  /**
   * The X offset that should be applied with respect to the screen location of the point.
   * Positive values offset the icon to the right on the screen, negative values offset it to the left.
   *
   * <p>
   * This offset is applied after rotation and does not take into account any scaling performed on the image.
   * In other words, scaling and rotation are applied first. Then, this offset is applied as a post-effect.
   * </p>
   *
   * <p>
   * If this is a number, its value is interpreted in the units defined by {@link GenericIconStyle.uom uom}, which defaults to Pixels.
   * If this is a string, its value is interpreted in the units defined in the string (e.g. meters for "25m" or pixels for "25px").
   * </p>
   *
   * <p>
   * You cannot mix world lengths and pixels for offsetX and {@link offsetY}.
   * If offsetX is expressed in a length unit, {@link offsetY} must be as well (and vice-versa).
   * </p>
   *
   * <p>
   * Examples: "16px", "-25.2m".
   * The default value is 0 (no offset, the icon is painted at its anchor point).
   * </p>
   *
   */
  offsetX?: number | string;
  /**
   * The Y offset that should be applied with respect to the screen location of the point.
   * Positive values offset the icon to the bottom on the screen, negative values offset it to the top.
   *
   * <p>
   * This offset is applied after rotation and does not take into account any scaling performed on the image.
   * In other words, scaling and rotation are applied first. Then, this offset is applied as a post-effect.
   * </p>
   *
   * <p>
   * If this is a number, its value is interpreted in the units defined by {@link GenericIconStyle.uom uom}, which defaults to Pixels.
   * If this is a string, its value is interpreted in the units defined in the string (e.g. meters for "25m" or pixels for "25px").
   * </p>
   *
   * <p>
   * You cannot mix world lengths and pixels for offsetY and {@link offsetX}.
   * If offsetY is expressed in a length unit, {@link offsetX} must be as well (and vice-versa).
   * </p>
   *
   * <p>
   * Examples: "16px", "-25.2m".
   * The default value is 0 (no offset, the icon is painted at its anchor point).
   * </p>
   *
   */
  offsetY?: number | string;
  /**
   * <p>The opacity of the icon, determines how transparent an icon will be painted. It's a numeric value and needs to be specified between 0 and 1.
   * 0 indicates that the icon will be painted completely transparent and 1 indicates that the original opacity of the icon will be used.</p>
   *
   * By default 1
   */
  opacity?: number;
  /**
   * The color that is modulated with the icon. For example
   * using an icon with gray-scale colors and a red modulation color
   * will result in a resulting painted icon with red hues.
   *
   * By default "rgba(255,255,255,1)"
   * @since 2022.0
   */
  modulationColor?: string;
  /**
   * Adds a {@link BloomEffect} to the icon.
   *
   * Bloom is only supported on WebGL maps.
   *
   * @since 2022.1
   */
  bloom?: BloomStyle;
  /**
   * The rotation of the icon, specified in degrees. The default is 0, which implies no rotation to the original icon.
   * Rotations are  applied in a clock-wise fashion. Rotation of the icon happens around its anchor-point.
   *
   * By default 0
   */
  rotation?: number;
  /**
   * The line-style of a line which connects the border with the position of the feature on the map, using a perpendicular line.
   */
  stem?: LineStyle;
  /**
   * The target width of the image, with a given unit of measure.
   *
   * This can be either percentage, pixels or a length unit.
   * For example: "16px", "50%" or "25.2m".
   * Valid length units are {@link UnitOfMeasure uom}s
   * {@link getUnitOfMeasure registered in LuciadRIA}.
   * The default is "100%", which implies that the icon is painted at its original resolution.
   *
   * If this is a number, the width is interpreted in the units defined by {@link GenericIconStyle.uom uom}.
   * If no {@link GenericIconStyle.uom uom} is set, the height is interpreted in pixels.
   *
   * You cannot mix world lengths and pixels for width and {@link height}.
   * If width is expressed in a length unit, {@link height} must be as well (and vice-versa).
   */
  width?: string | number;
  /**
   * <p>The Z-order of this shape. Shapes will be painted from lowest to highest Z-order, so that shapes with a higher
   * Z-order are painted on top of shapes with a lower Z-order. The default value is 0.</p>
   *
   * By default 0
   */
  zOrder?: number;
  /**
   * <p>
   *   When this icon should be painted in 3D in relation to other 3D data.
   * </p>
   * <p>
   *   Notes:
   *   <ul>
   *     <li>Mode {@link OcclusionMode.VISIBLE_ONLY} shows only the part of the icon that is not obscured by other 3D data.  This is the default.</li>
   *     <li>Mode {@link OcclusionMode.ALWAYS_VISIBLE} shows the entire icon even if behind by other 3D data.  The icon will appear in front of other objects.</li>
   *     <li>Mode {@link OcclusionMode.OCCLUDED_ONLY} shows only the part of the icon that is behind other 3D data.
   *         You typically use this to display obscured icons in combination with another style that uses "VISIBLE" mode.</li>
   *     <li>This parameter is only relevant in 3D.</li>
   *     <li>This parameter is only applied on non-draped icons.</li>
   *   </ul>
   * </p>
   *
   * By default {@link OcclusionMode.VISIBLE_ONLY}
   * @since 2020.0
   */
  occlusionMode?: OcclusionMode;
  /**
   * Determines the interpretation of units for {@link GenericIconStyle.width width}, {@link GenericIconStyle.height height}
   * {@link GenericIconStyle.offsetX offsetX} and {@link GenericIconStyle.offsetY offsetY}.
   * When set to a length unit of measure (meters, feet,...), icons will grow and shrink as you zoom the map in and out.
   *
   * <p>
   *  <table border="0" align="center">
   *   <tr align="center">
   *     <td width="600"><img src="media://style/world-sized-icons.gif"
   *         alt="Pixel sized icon (red) vs. icon with a uom in meters (green)"
   *         width="600">
   *     </td>
   *   </tr>
   *   <tr align="center">
   *     <td>
   *       Pixel sized icon (red) vs. icon with a <code>uom</code> in meters (green).
   *       The red icon always has the same size on screen. The green icon grows and shrinks as the map
   *       is zoomed in and out.
   *     </td>
   *   </tr>
   * </table>
   *
   * <p>
   *  For georeferenced maps, supported UnitOfMeasures are:
   *  <ul>
   *   <li><code>getUnitOfMeasure("Pixels")</code></li>
   *   <li><code>UnitOfMeasure of type getQuantityKind("Length")</code>, for example getUnitOfMeasure("Meter")</li>
   *  </ul>
   * </p>
   * <p>
   *  The unit of measure applies to the {@link GenericIconStyle.width width}, {@link GenericIconStyle.height height},
   *  {@link GenericIconStyle.width offsetX} and {@link GenericIconStyle.offsetY offsetY}.
   *  The <code>uom</code> determines the interpretation of the values as pixels or as a length unit that represents
   *  the actual size of real-world objects, like for example meter of foot.
   * </p>
   * <p>
   *  The <code>uom</code> property is only supported on geographically referenced maps.
   *  Maps configured with a {@link createCartesianReference cartesian reference} do
   *  not support <code>IconStyle</code>s with a <code>uom</code> set.
   * </p>
   * <p>The property is optional and the default value is the Pixel unit.</p>
   *
   * <p>
   * Example of a icon style with a size expressed in meters:
   *
   * ```javascript
   * [[include:view/style/WorldSizedIconSnippets.ts_DRAW_WORLD_SIZED_ICON]]
   * ```
   *
   * </p>
   *
   * <p>
   * Note that you can also define a unit directly in a width or height string value:
   *
   * ```javascript
   * [[include:view/style/WorldSizedIconSnippets.ts_WORLD_SIZE_UNIT_STRING]]
   * ```
   *
   * </p>
   *
   * @since 2021.0
   */
  uom?: UnitOfMeasure;
}
/**
 * An icon style where a URL refers to an image resource.
 */
export interface UrlIconStyle extends GenericIconStyle {
  /**
   * <p>A URL referring to an image resource For example <code>http://www.example.com/image.png</code>.</p>
   * <p>
   *   This image should be a url either to a raster image, like a .png or .jpeg file, or to an image in SVG format.
   * </p>
   */
  url: string;
  /**
   * <p>
   * Whether the icon should be requested with authentication parameters. Setting this to true is required when the server requires cookies, basic http authentication. This flag should be set to false if
   * the server is configured to allow cross-origin requests from all hosts. Such servers reject all authenticated requests.
   * </p>
   * <p>
   *   This parameter is only relevant when you are using the `IconStyle#url` property to request images. If you use the icon using the `IconStyle#image` property, the credentials are automatically handled by the browser.
   * </p>
   * <p>
   *   The default value is <code>false</code>
   * </p>
   **/
  credentials?: boolean;
}
/**
 * An icon style that uses an Image or Canvas DOM element.
 */
export interface ImageIconStyle extends GenericIconStyle {
  /**
   * <p>An Image or Canvas DOM element.</p>
   * <p>
   *   This image should either be a raster image, like a .png or .jpeg file, or be an image in SVG format.
   * </p>
   */
  image: HTMLImageElement | HTMLCanvasElement;
}
/**
 * An <code>IconStyle</code> describes how an icon should be painted.
 * Using a <code>IconStyle</code>, the icon is visualized using the following steps:
 * <ol>
 *  <li>The icon is translated based on {@link GenericIconStyle.anchorX anchorX}
 *      and {@link GenericIconStyle.anchorY anchorY}.
 *  <li>The icon is rotated based on this style's {@link GenericIconStyle.rotation rotation} property.
 *      If {@link GenericIconStyle.heading heading} is a non-NaN Number,
 *      a rotation based on the heading is added to this rotation as well.
 *  <li>A translation based on this style's
 *      {@link GenericBorderIconStyle.offsetX offsetX} and {@link GenericBorderIconStyle.offsetY offsetY}
 *      is applied.
 *  <li>In 3D, an additional view displacement translation might be applied, to avoid icons sticking in terrain.
 *      This view displacement is calculated automatically, based on the combined size and anchors of all (non-draped) icons.
 * </ol>
 *
 * <p>
 * The icon can be either view-sized (pixels) or world-sized (meters, feet,...). A view-sized icon will always have
 * the same size on the screen. A world-sized icon grows and shrinks as you zoom in and out.
 * See {@link GenericIconStyle.uom} for more information on how to draw world-sized icons.
 * </p>
 */
export type IconStyle = UrlIconStyle | ImageIconStyle;