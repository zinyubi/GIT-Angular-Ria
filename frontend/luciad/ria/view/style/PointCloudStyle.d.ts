import { Color, Expression } from "../../util/expression/ExpressionFactory.js";
import { ScalingMode } from "./ScalingMode.js";
import { Vector3 } from "../../util/Vector3.js";
import { PointCloudPointShape } from "./PointCloudPointShape.js";
import { DensitySettings } from "../feature/FeaturePainter.js";
/**
 * This is the general interface that describes a PointCloud style object.
 * <p/>
 * The PointCloud style object defines styling expressions used by {@link TileSet3DLayer} layer to style PointCloud data.
 * All properties are optional.
 * @since 2018.0
 */
export interface PointCloudStyle {
  /**
   * An expression to specify what colors to apply to PointClouds points.
   * <p/>
   *  To create expressions, you must use the factory methods in the {@link ExpressionFactory} module.
   *  The expression must be well-formed and resolve to a color value.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than replacing the whole expression.
   * <p/>
   * Note that alpha component in color is ignored, color will be fully opaque.
   * <p/>
   *
   * @default <code>null</code> If not set, points use colors as defined in the PointCloud data.
   */
  colorExpression?: Expression<Color> | null;
  /**
   * The expression that determines the scale factor to apply to PointClouds points.
   * <p>
   *   <ul>
   *     <li>Scale <code>1</code> corresponds to the default size of the point that is calculated based on the
   *     {@link pointSize} value.</li>
   *     <li>Scale <code>is smaller than 1</code> will shrink the point size.</li>
   *     <li>Scale <code>is greater than 1</code> will enlarge the point size.</li>
   *   </ul>
   * </p>
   * <p>
   * To create expressions, you must use the factory methods in the {@link ExpressionFactory} module.
   * The expression must be well-formed and resolve to a number value.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than replacing the whole expression.
   *
   * @default 1 If not set. The point size is not rescaled by the expression.
   */
  scaleExpression?: Expression<number> | null;
  /**
   * An expression to filter PointClouds points.
   * <p/>
   *  To create expressions, you must use the factory methods in the {@link ExpressionFactory} module.
   *  The expression must be well-formed and resolve to a boolean value.
   * <p>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than replacing the whole expression.
   *
   * @default true PointCloud points are visible by default.
   */
  visibilityExpression?: Expression<boolean> | null;
  /**
   * An expression to displace points.
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
   *   meshStyle.displacementExpression =  _.pushDown(shape);
   * ```
   * @default null points are not displaced by default.
   * @since 2022.0
   */
  displacementExpression?: Expression<Vector3> | null;
  /**
   * The scaling mode identifies the way point cloud data points are scaled for visualization.
   * Note: The initial point size, that is calculated based on the scaling mode, is additionally modified by the results of the scaleExpression.
   * The scale expression is used as a multiplier on top of internal point size of 3.
   *
   * @default ScalingMode.ADAPTIVE_WORLD_SIZE By default OGC 3D Tiles are scaled using {@link ScalingMode.PIXEL_SIZE}.
   * @deprecated Use {@link pointSize} instead.
   */
  scalingMode?: ScalingMode | null;
  /**
   * Specify the point cloud dot size.
   * <p>
   * Choose one of the following modes:
   *   <ul>{@link ScalingMode.PIXEL_SIZE PIXEL_SIZE}: the dots have a fixed size in pixels, specified by <code>pixelSize</code>.  The default is 3 pixels.</ul>
   *   <ul>{@link ScalingMode.WORLD_SIZE WORLD_SIZE}: the dots have a fixed size in meters, specified by <code>worldSize</code>.
   *       Additionally, you can specify a <code>minimumPixelSize</code>, so your points are never too small.</ul>
   *   <ul>{@link ScalingMode.ADAPTIVE_WORLD_SIZE ADAPTIVE_WORLD_SIZE}: the dots have size in meters, computed from the tile's density.
   *       Additionally, you can specify a <code>minimumPixelSize</code>, so your points are never too small.
   *       You can tune the computed world size with the <code>worldScale</code> parameter.
   *       This is the preferred mode for LuciadFusion OGC 3D Tiles point clouds as well as HSPC point clouds.
   *       </ul>
   * <p>
   * Any {@link scaleExpression} is applied on top of the base size given here.
   * <p>
   * Note that the points will have a maximum size that is platform-dependent, usually around 60 pixels.
   *
   * @since 2022.0
   */
  pointSize?: null | {
    mode: ScalingMode.PIXEL_SIZE;
    pixelSize?: number;
  } | {
    mode: ScalingMode.WORLD_SIZE;
    worldSize: number;
    minimumPixelSize?: number;
  } | {
    mode: ScalingMode.ADAPTIVE_WORLD_SIZE;
    worldScale?: number;
    minimumPixelSize?: number;
  };
  /**
   * Enable a graphical post-processing effect to intelligently fill or "in-paint" small holes or gaps between your points.
   * <p>
   * This helps creating a visually closed surface.
   * It works best if you already have high-density point cloud: you can use a small point size to retain visual detail and reduce overlap, but still avoid see-through effects.
   * <p>
   * The effect works well for 1, 2 or 3 pixels.
   * You can go higher, but depending on your dataset the quality can degrade.
   * <p>
   * The effect generally has only a little overhead and impact on performance.
   * <p>
   * The default is <code>0</code>, disabled.
   *
   * @since 2022.0
   */
  gapFill?: number;
  /**
   * This option influences how points are drawn, specifically when they overlap.
   * <p>
   * <ul>
   *   <li>When using {@link PointCloudPointShape.DISC DISC}, overlap can result in a more pixelated, low-resolution display even if you have high point density.</li>
   *   <li>When using {@link PointCloudPointShape.SPHERE SPHERE}, overlap results in a high quality visual coverage of your data, but at the cost of performance.</li>
   * </ul>
   * <p>
   * The visual effect is most noticeable if you have large points (&gt; 4 pixels) and a high point density.
   * When you have small points (&lt; 5 pixels), we recommend to use <code>DISC</code>.
   * <p>
   * The default is <code>DISC</code> for HSPC, <code>SPHERE</code> for OGC 3D Tiles.
   *
   * @since 2022.0
   */
  pointShape?: PointCloudPointShape;
  /**
   * Draw point cloud dots based on the direction of their normal vector.
   *
   * Point orientation is available only if the dataset has normal vector values.
   * If the dataset doesn't have normals, this parameter is ignored.
   *
   * The effect has a little overhead and impact on performance.
   *
   * Enabled by default.
   *
   * @since 2024.0
   */
  normalOriented?: boolean;
  /**
   * Set or get the density painting settings for a point cloud.  Use <code>null</code> to disable density painting.
   * <p/>
   * The density settings object has one property: <code>colorMap</code>, the {@link ColorMap color map}
   * used to map density values to color.
   * <p/>
   * The density at a particular location is the sum of the alpha channel values for all overlapping objects. For
   * a single opaque object you would get a density value of 1.0, for 2 opaque objects 2.0, etc.
   * <br/>
   * <p/>
   * Density painting notes:
   * <ul>
   *   <li>The color aspect of the points is ignored.  The alpha value of the color is used as a per-point weight.</li>
   *   <li>Density is not computed across multiple point cloud layers.</li>
   *   <li>Gap filling does not work with density painting and will be ignored if density is set.</li>
   *   <li>{@link PointCloudPointShape.SPHERE SPHERE} is not compatible with density painting and will be ignored.</li>
   *   <li>{@link PointCloudStyle.blending blending} setting is not compatible with density and will be ignored.</li>
   * </ul>
   * <p/>
   *
   * For more information, see the article
   *     <a href="articles://howto/ogc3dtiles/density_painting_point_cloud.html">
   *     Density painting of point cloud data</a>
   *
   * @default null
   * @since 2024.0
   */
  density?: DensitySettings | null;
  /**
   * Enable a post-processing effect that blends overlapping points to present a smoother surface.
   *
   * It has an impact on performance. The frame rate can decrease by 30% to 40%.
   *
   * <p>
   *   It's best to increase the size of points so that more points blend together.
   * </p>
   * <ul>
   *   <li> The blending effect can't be used together with density setting. Blending will be disabled if density is enabled.</li>
   *   <li> The transparency setting is ignored when blending is enabled.</li>
   *   <li> Using blending with {@link PointCloudPointShape.SPHERE SPHERE} shape doesn't improve the blending effect's quality — consider choosing either blending or SPHERE.</li>
   * </ul>
   *
   * @since 2024.0
   */
  blending?: boolean;
}