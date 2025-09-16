import { OcclusionMode } from "./OcclusionMode.js";
import { DrapeTarget } from "./DrapeTarget.js";
/**
 * <p>
 * A <code>TextStyle</code> describes how text should be formatted on the map.
 * </p>
 * <p>
 * <code>TextStyle</code> is not an actual type in the LuciadRIA API. This is only documentation of the
 * the expected structure of an object in order to be considered a <code>TextStyle</code>.
 * </p>
 *
 * <p>
 * All properties are optional.
 * </p>
 * @since 2012.1
 */
export interface TextStyle {
  /**
   * The baseline alignment of the text for the vertical anchoring of the text.. Allowed values are <code>top</code>,
   * <code>hanging</code>, <code>middle</code>, <code>alphabetic</code>, <code>ideographic</code> and
   * <code>bottom</code>. For more information about these values, please visit the
   * <a href="http://www.w3schools.com/tags/canvas_textbaseline.asp">W3 documentation</a> for the html5 canvas "textBaseline" property.
   */
  alignmentBaseline?: string;
  /**
   * The rotation of the text, clockwise in degrees. The text is rotated in view-space. This means the angle is not an
   * orientation of the text with regards to the Earth's coordinate system, but a rotation in the plane of the screen.
   * An angle with value 0 means the text is oriented straight up.
   */
  angle?: number;
  /**
   * The fill color as a CSS color string. This is the color of the text itself.
   */
  fill?: string;
  /**
   * The font to use, as a CSS font string.
   */
  font?: string;
  /**
   * The halo color as a CSS color string. This is an outline around the text.
   */
  halo?: string;
  /**
   * The halo width.
   */
  haloWidth?: number;
  /**
   * The X offset in pixels that should be applied with respect to the location
   * specified by the shape parameter.
   */
  offsetX?: number;
  /**
   * the Y offset in pixels that should be applied wrt the location specified by the shape parameter.
   * specified by the shape parameter.
   */
  offsetY?: number;
  /**
   * The stroke of the text. This is the outline of the text. It can partially overlap with the fill and halo.
   */
  stroke?: string;
  /**
   * the stroke width
   */
  strokeWidth?: number;
  /**
   * The horizontal anchoring of the text for the given location.
   * Allowed values are <code>"start"</code>, <code>"end"</code>, <code>"left"</code>, <code>"right"</code> and <code>"center"</code>.
   * The <code>"left"</code> or <code>"start"</code> means that the text will be anchored at the first character of the text-string.
   * The <code>"right"</code> or <code>"end"</code> means the text will be anchored at the last character of the string.
   * The <code>"center"</code> means the text will be centered on the anchor. The default value is <code>start</code>.
   *
   * <p> The value for <code>textAnchor</code> controls also how every element of a multi-line text is horizontally aligned.
   *
   * <p> <img src="media://style/drawTextWithTextAnchor.png" alt="Multi-line text with different textAnchor values"/>
   */
  textAnchor?: string;
  /**
   * The Z-order of this shape. Shapes will be painted from lowest to highest Z-order.
   */
  zOrder?: number;
  /**
   * <p>
   *   When this text should be painted in 3D in relation to other 3D data.
   * </p>
   * <p>
   *   Notes:
   *   <ul>
   *     <li>Mode {@link OcclusionMode.VISIBLE_ONLY} shows only the part of the text that is not obscured by other 3D data.  This is the default.</li>
   *     <li>Mode {@link OcclusionMode.ALWAYS_VISIBLE} shows the entire text even if behind by other 3D data.  The text will appear in front of other objects.</li>
   *     <li>Mode {@link OcclusionMode.OCCLUDED_ONLY} shows only the part of the text that is behind other 3D data.
   *         You typically use this to display obscured shapes in combination with another style that uses "VISIBLE" mode.</li>
   *     <li>This parameter is only relevant in 3D.</li>
   *     <li>This parameter is only applied on non-draped shapes.</li>
   *     <li>When using extruded shapes or other non-flat shapes, a combination of "OCCLUDED_ONLY" and "VISIBLE_ONLY" only works with transparent colors.</li>
   *   </ul>
   * </p>
   *
   * @default VISIBLE
   * @since 2021.0
   */
  occlusionMode?: OcclusionMode;
  /**
   * <p>Whether this text should be draped on top of the terrain.
   * <p>This property only exists for backwards compatibility. You should use {@link drapeTarget} instead.
   * <p>By default, a shape is draped if it has undefined or zero Z.
   * Otherwise it will not be draped.
   * <p>You can override the default behaviour by setting this flag true or false.
   * If you explicitly drape a 3D shape, its 2D "shadow" is painted on the terrain.
   * <p>This setting is only relevant for 3D maps and is ignored for 2D maps.
   * @since 2021.0
   * @deprecated Use {@link drapeTarget} instead.
   */
  draped?: boolean;
  /**
   * <p>Whether the text should be draped on top of the terrain or a 3D tiles mesh (or both).
   * <p>By default, a shape is draped if it has undefined or zero Z.
   * Otherwise it will not be draped.
   * <p>You can override the default behaviour by setting this flag.
   * If you explicitly drape a 3D shape, its 2D "shadow" is painted on the terrain.
   * <p>This setting is only relevant for 3D maps and is ignored for 2D maps.
   * @since 2022.1
   */
  drapeTarget?: DrapeTarget;
}