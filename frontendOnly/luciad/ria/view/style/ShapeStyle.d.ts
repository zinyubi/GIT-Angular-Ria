import { LineType } from "../../geodesy/LineType.js";
import { BorderStyle } from "./BorderStyle.js";
import { ComplexStrokedLineStyle } from "./complexstroke/ComplexStrokedLineStyle.js";
import { FillStyle } from "./FillStyle.js";
import { LineStyle } from "./LineStyle.js";
import { OcclusionMode } from "./OcclusionMode.js";
import { DrapeTarget } from "./DrapeTarget.js";
/**
 * <p>A <code>ShapeStyle</code> describes how a {@link Shape} should be styled.  A ShapeStyle
 * defines among others the stroke and fill styling of a shape.</p>
 * <p>
 * Example:
 * </p>
 *
 * ```javascript
 * var shapeStyle = {
 *   stroke: {
 *     color: "rgb(100, 170, 220)",
 *     width: 2.5
 *   }
 * };
 * ```
 */
export interface ShapeStyle {
  /**
   * Whether this shape should be draped on terrain, or not be draped at all.
   *
   * This property only exists for backwards compatibility. You should use {@link drapeTarget} instead.
   * <code>false</code> is equivalent to {@link DrapeTarget.NOT_DRAPED} and <code>true</code> is equivalent to
   * {@link DrapeTarget.TERRAIN}.
   *
   * If <code>draped</code> or <code>drapeTarget</code> is not specified and the shape has zero Z, it will be draped {@link DrapeTarget.TERRAIN on terrain}.
   * If it has non-zero Z, it will {@link DrapeTarget.NOT_DRAPED not be draped}.
   *
   * If you explicitly drape a 3D shape, its 2D "shadow" is painted on the terrain.
   *
   * This setting is only relevant for 3D geospatial maps. For 2D maps and 3D cartesian maps, this setting is ignored and {@link DrapeTarget.NOT_DRAPED} is used.
   *
   * @see {@link GenericIconStyle.drapeTarget}
   * @see {@link RasterStyle.drapeTarget}
   * @see {@link TileSet3DLayer.isDrapeTarget}
   * @deprecated Use {@link drapeTarget} instead.
   */
  draped?: boolean;
  /**
   * The drape target of this shape.
   *
   * Indicates if this shape should be draped on {@link DrapeTarget.TERRAIN terrain},
   * {@link DrapeTarget.MESH 3D Tiles meshes},
   * {@link DrapeTarget.NOT_DRAPED not at all}.
   *
   * If <code>draped</code> or <code>drapeTarget</code> is not specified and the shape has zero Z, it will be draped {@link DrapeTarget.TERRAIN on terrain}.
   * If it has non-zero Z, it will {@link DrapeTarget.NOT_DRAPED not be draped}.
   *
   * If you explicitly drape a 3D shape, its 2D "shadow" is painted on the terrain.
   *
   * This setting is only relevant for 3D geospatial maps. For 2D maps and 3D cartesian maps, this setting is ignored and {@link DrapeTarget.NOT_DRAPED} is used.
   *
   * @see {@link GenericIconStyle.drapeTarget}
   * @see {@link RasterStyle.drapeTarget}
   * @see {@link TileSet3DLayer.isDrapeTarget}
   * @since 2022.1
   */
  drapeTarget?: DrapeTarget;
  /**
   * An object containing the fill style properties.  This property used to be a <code>string</code> specifying the
   * fill color as a CSS color string.  The <code>string</code> option is still supported but deprecated.
   */
  fill?: FillStyle;
  /**
   * The lineType determines how lines between subsequent points will be interpreted.  Possible values are
   * {@link LineType.SHORTEST_DISTANCE SHORTEST_DISTANCE} and
   * {@link LineType.CONSTANT_BEARING CONSTANT_BEARING}.  In case the data is defined in a reference with a
   * {@link CoordinateType.GEODETIC GEODETIC} coordinate system, lines will be geodetically interpreted
   * (on an ellipsoid).  Shapes will be rendered in a cartesian manner in all other cases.
   * <p>
   * This property is optional; its defaults value is {@link LineType.SHORTEST_DISTANCE}
   */
  lineType?: LineType;
  /**
   * An object literal containing the stroke style properties.  This property used to be a <code>String</code>
   * specifying the stroke color as a CSS color string, while the width was specified using the
   * <code>strokeWidth</code> property.  The <code>stroke</code> as a <code>string</code> option, together with the
   * <code>strokeWidth</code> option is still supported but deprecated.
   * <br/>
   * Set this property to <code>null</code> to turn off the stroke. When this property is <code>undefined</code>, a default
   * stroke will be shown. This is to avoid that features on the map would be - unintentionally - invisible.
   */
  stroke?: LineStyle | ComplexStrokedLineStyle;
  /**
   * The z-order of this shape.   Shapes will be painted from lowest to highest z-order.  This property is optional
   * and defaults to <code>0</code>.
   */
  zOrder?: number;
  /**
   * <p>The style object that describes how the inner border of a closed shape is rendered.
   */
  innerBorder?: BorderStyle;
  /**
   * <p>The style object that describes how the outer border of a closed shape is rendered.
   * <p>The outer border style is limited to 20 pixels.
   */
  outerBorder?: BorderStyle;
  /**
   * <p>
   *   When this shape should be painted in 3D in relation to other 3D data.
   * </p>
   * <p>
   *   Notes:
   *   <ul>
   *     <li>Mode {@link OcclusionMode.VISIBLE_ONLY} shows only the part of the shape that is not obscured by other 3D data.  This is the default.</li>
   *     <li>Mode {@link OcclusionMode.ALWAYS_VISIBLE} shows the entire shape even if behind by other 3D data.  The shape will appear in front of other objects.</li>
   *     <li>Mode {@link OcclusionMode.OCCLUDED_ONLY} shows only the part of the shape that is behind other 3D data.
   *         You typically use this to display obscured shapes in combination with another style that uses "VISIBLE" mode.</li>
   *     <li>This parameter is only relevant in 3D.</li>
   *     <li>This parameter is only applied on non-draped shapes.</li>
   *     <li>When using extruded shapes or other non-flat shapes, a combination of "OCCLUDED_ONLY" and "VISIBLE_ONLY" only works with transparent colors.</li>
   *   </ul>
   * </p>
   *
   * @default VISIBLE
   * @since 2020.0
   */
  occlusionMode?: OcclusionMode;
}