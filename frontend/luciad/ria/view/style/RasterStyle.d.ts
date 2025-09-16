import { Expression } from "../../util/expression/ExpressionFactory.js";
import { Vector3 } from "../../util/Vector3.js";
import { DrapeTarget } from "./DrapeTarget.js";
import { LineStyle } from "./LineStyle.js";
import { FillStyle } from "./FillStyle.js";
/**
 * Style for raster layers.
 *
 * For more information on how to style raster layers, see
 * <a href="articles://tutorial/rasterpainting/visualize_raster_data.html">Learn how to visualize and style raster data using a RasterTileSetLayer</a>.
 */
export interface RasterStyle {
  /**
   * A number with an opacity value between 0 and 1. 0 is fully transparent t, 1 is
   * fully opaque. By default, the value is 1.
   *
   * @default 1
   */
  alpha?: number;
  /**
   * Sets the brightness.
   * <p/>
   * The brightness is a value between 0 and 2. A value of 1 (the default) leaves the brightness
   * unchanged. Values larger than 1 makes the colors brighter, while a value smaller than 1 makes
   * the colors less bright. A value of 0 will make the raster black, while a value of 2 will make it fully white.
   * <p/>
   *
   * This is only supported on WebGL maps.
   *
   * @default 1.
   * @since 2023.1
   */
  brightness?: number;
  /**
   * Sets the contrast.
   * <p/>
   * The contrast is a value between 0 and 2. A value of 1 (the default) leaves the contrast
   * unchanged. A value larger than 1 enhances the contrast of dark colors by making them brighter,
   * while a value smaller than 1 enhances the contrast of bright colors by making them darker.
   * <p/>
   *
   * This is only supported on WebGL maps.
   *
   * @default 1
   * @since 2023.1
   */
  contrast?: number;
  /**
   * <p>Sets the color that is modulated with the raster. For example using a raster with
   * gray-scale colors and a red modulation color will result in a resulting painted raster with
   * red hues.</p>
   *
   * <p> Using a white color has no effect.</p>
   *
   * <p>The alpha component of this color will be ignored. To control the opacity of the raster use
   * {@link alpha}<p>
   *
   * This is only supported on WebGL maps.
   *
   * @default "rgb(255,255,255)"
   * @since 2023.1
   */
  modulationColor?: string;
  /**
   * An expression to displace terrain elevation data.
   * <p/>
   *  To create expressions, you must use the factory methods in the {@link ExpressionFactory} module.
   *  The expression must be well-formed and resolve to a point value.
   * <p>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than replacing the whole expression.
   *
   * ```javascript
   *   // Example of a displacement expression that pushes down everything inside a shape.
   *   var _  = ExpressionFactory;
   *   var shape = _.orientedBox(layer.orientedBox);
   *   rasterStyle.displacementExpression =  _.pushDown(shape);
   * ```
   * @default null terrain elevation is not displaced by default.
   * @since 2020.1
   */
  displacementExpression?: Expression<Vector3> | null;
  /**
   * Determines where the raster is draped on.
   *
   * This setting is only relevant for 3D maps and is ignored for 2D maps.
   *
   * Note that there is a technical limitation where you cannot drape the bottom-most
   * imagery {@link DrapeTarget.MESH 3D Tiles meshes}.
   * To work around this limitation, you can add a dummy raster layer underneath the layer you want to drape on meshes.
   * That dummy layer then becomes the bottom-most raster layer.
   * For more information, see
   * <a href="articles://faq/ogc3dtiles/draping_bottommost_raster_layer_on_3d_tiles.html">Why isn't my data being draped on OGC 3D tiles?</a>.
   *
   * @default {@link DrapeTarget.TERRAIN}
   *
   * @see {@link GenericIconStyle.drapeTarget}
   * @see {@link ShapeStyle.drapeTarget}
   * @see {@link TileSet3DLayer.isDrapeTarget}
   *
   * @since 2022.1
   */
  drapeTarget?: DrapeTarget;
  /**
   * The {@link LineStyle line style} used when the raster data extent is shown when zoomed out far.
   *
   * When this property is <code>undefined</code>, a default red outline will be shown. This is to avoid that the raster on the map would be - unintentionally - invisible.
   * Set this property to an empty object literal to turn off the outline.
   *
   * This setting is only relevant for WebGL maps.
   *
   * @since 2023.0
   */
  lineStyle?: LineStyle;
  /**
   * The {@link FillStyle fill style} used when the raster data extent is shown when zoomed out far.
   *
   * When this property is <code>undefined</code>, a default red hatched area will be shown. This is to avoid that the raster on the map would be - unintentionally - invisible.
   * Set this property to an empty object literal to turn off the fill.
   *
   * This setting is only relevant for WebGL maps.
   *
   * @since 2023.0
   */
  fillStyle?: FillStyle;
}