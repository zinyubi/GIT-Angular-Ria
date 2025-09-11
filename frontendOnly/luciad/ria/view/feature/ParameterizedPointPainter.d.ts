import { Feature } from "../../model/feature/Feature.js";
import { Shape } from "../../shape/Shape.js";
import { Color, Expression } from "../../util/expression/ExpressionFactory.js";
import { Layer } from "../Layer.js";
import { Map } from "../Map.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { ParameterizedPointStyle } from "../style/ParameterizedPointStyle.js";
import { DensitySettings, FeaturePainter, PaintState } from "./FeaturePainter.js";
import { DrapeTarget } from "../style/DrapeTarget.js";
/**
 * An object literal containing the color, icon and scale expression to use when painting points.
 */
export interface PointStyleExpressions {
  /**
   * The color expression to use when painting (regular) points.
   */
  colorExpression?: Expression<Color>;
  /**
   * The icon expression used to define (regular) icons.
   */
  iconExpression?: Expression<ParameterizedPointStyle>;
  /**
   * The scale expression used to scale (regular) icons. See {@link ParameterizedPointPainter.scaleExpression scaleExpression}.
   */
  scaleExpression?: Expression<number>;
}
/**
 * An object literal containing the {@link ParameterizedPointPainter}'s parameters.
 */
export interface ParameterizedPointPainterConstructorOptions {
  /**
   * The attributes that can be used in expressions, and how the values of the attributes should be found.
   * Each entry in the object literal should use the desired name of the attribute as key, and either the
   * name of a feature property or a function that calculates the attribute value given a feature.
   * <br/>
   * Only numeric attributes are supported. If you want to use feature properties
   * based on other kinds of objects, you will need to map these to numbers in a function you provide.
   * <br/>
   * If an attribute is ever to be used in any kind of expression,
   * it <b>must</b> be specified in this object literal.
   */
  attributes?: {
    [attritubeName: string]: string | ((feature: Feature) => any);
  };
  /**
   * An object literal containing the color, icon and scale expression to use when painting (regular) points.
   */
  regular?: PointStyleExpressions;
  /**
   * An object literal containing the color, icon and scale expression to use when painting selected points.
   */
  selected?: PointStyleExpressions;
  /**
   * The expression used to filter points.
   */
  visibilityExpression?: Expression<boolean>;
  /**
   * Defines how the headings of the (icons of the) points should be found.
   * You can provide either the name of a feature property or a function that calculates the heading given a feature.
   * For more information on the meaning of the heading property, see {@link GenericIconStyle.heading heading}.
   */
  heading?: string | ((feature: Feature) => number);
  /**
   * Whether the (icons of the) points should be draped on top of the terrain or a 3D tiles mesh (or both).
   * This setting is only relevant for 3D maps and is ignored for 2D maps.
   * If used, the height of points is discarded.
   *
   * This property only exists for backwards compatibility. You should use {@link DrapeTarget} instead.
   * <code>false</code> is equivalent to {@link DrapeTarget.NOT_DRAPED} and <code>true</code> is equivalent to
   * {@link DrapeTarget.TERRAIN}.
   *
   * @default false
   * @deprecated Use {@link drapeTarget} instead.
   */
  draped?: boolean;
  /**
   * Whether the (icons of the) points should be draped on top of the terrain or a 3D tiles mesh (or both).
   * This setting is only relevant for 3D maps and is ignored for 2D maps.
   * If used, the height of points is discarded.
   *
   * @default DrapeTarget.NOT_DRAPED
   * @since 2022.1
   */
  drapeTarget?: DrapeTarget;
}
/**
 * ParameterizedPointPainter allows you to visualize point data sets.
 * <p/>
 * This painter uses the graphics hardware to efficiently switch styling and filtering.
 * <p/>
 * <p/>
 * Note that this painter does not allow overriding of {@link paintBody},
 * unlike the usual {@link FeaturePainter}.
 * All styling is configured by setting the properties on this painter.
 * This painter can also be combined with {@link ParameterizedPointPainter.density regular density painting}.
 * Note that in this case, the alpha value of the final color is used as a weight in the density.  The color itself is discarded.
 * <p/>
 * This painter supports labels, which take the visibility expression into account.
 * To do so, implement {@link FeaturePainter}s.
 * However, the labels are evaluated and drawn using the normal cpu-based algorithms.
 * <p/>
 * <b>Limitations:</b>
 * <ul>
 *   <li>Only numeric attributes are supported.</li>
 *   <li>This painter can only be used on a {@link WebGLMap}.</li>
 *   <li>Any labels are evaluated and drawn using the normal cpu-based algorithms.</li>
 *   <li>This painter does not support models that have a {@link getHeightAboveTerrainReference above terrain} height reference.
 *       If you use this painter for such a model, the painter will throw an exception the first time it needs to paint.</li>
 * </ul>
 */
declare class ParameterizedPointPainter extends FeaturePainter {
  /**
   * Creates a new ParameterizedPointPainter.
   *
   * <h3>Examples</h3>
   * <h4>Specifying filtering and styling based on feature properties</h4>
   * You can specify {@link Expression expressions} to determine the color, icon, scale or visibility of a point.
   * These expressions can be based on feature properties.
   *
   * ```javascript
   * //Create a painter.
   * //Use a green color for regular points.
   * //Filter points based on the "speed" attribute.  Only show points if their "speed" is greater than 200.
   * //The 200 value is the current value of a parameter.
   * //Parameters can be updated very efficiently so the threshold can be updated later on very quickly.
   * //Specify that we will (at some point) use attributes "speed" and "calculated".
   * //The values of the "speed" attribute will correspond to the "velocity" feature property,
   * //i.e. to feature.properties["velocity"];
   * //The values for the "calculated" attribute will be the values returned by the given function.
   * var _ = ExpressionFactory;
   * var speedThreshold = _.numberParameter(200);
   * var parameterizedPointPainter = new ParameterizedPointPainter({
   *          regular: {
   *            colorExpression: color("rgb(0, 255, 0, 1)")
   *          },
   *          visibilityExpression: _.gt(_.attribute("speed"), speedThreshold),
   *          attributes: {
   *            speed: "velocity",
   *            calculated: function(feature, shape) {
   *              //calculate the attribute value here.
   *              return ...;
   *            }
   *          }
   *       });
   *
   * //At runtime, immediately change styling and filtering.
   * parameterizedPointPainter.colorExpression = color("rgb(255, 0, 0, 1)");
   * parameterizedPointPainter.visibilityExpression = boolean(false);
   * //If you want to update the styling very often, e.g. based on a slider, consider using parameters in your expressions.
   * //Changing the values of parameters is more efficient than changing expressions.
   * //So, for example, updating the speed threshold:
   * speedThreshold.value = 300;
   * ```
   *
   * @param options An object literal containing the {@link ParameterizedPointPainter}'s parameters.
   *
   * @see {@link ExpressionFactory}
   */
  constructor(options?: ParameterizedPointPainterConstructorOptions);
  /**
   *  An expression to specify what colors to apply to points.
   * <p/>
   *  To create expressions, you must use {@link ExpressionFactory}.
   *  The expression must be well-formed and resolve to a color.
   * <p/>
   * Note that any attribute used in the expressions <i>must</i> be specified in the constructor parameter <code>attributes</code>.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than changing expressions.
   * <p/>
   *
   * @default <code>rgb(255, 255, 255)</code> (Opaque white)
   */
  get colorExpression(): Expression<Color>;
  set colorExpression(colorExpression: Expression<Color>);
  /**
   *  An expression to specify what colors to apply to selected points.
   * <p/>
   *  To create expressions, you must use {@link ExpressionFactory}.
   *  The expression must be well-formed and resolve to a color.
   * <p/>
   * Note that any attribute used in the expressions <i>must</i> be specified in the constructor parameter <code>attributes</code>.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than changing expressions.
   * <p/>
   * @default <code>rgb(0, 0, 255)</code> (Opaque blue)
   */
  get selectedColorExpression(): Expression<Color>;
  set selectedColorExpression(selectedColorExpression: Expression<Color>);
  /**
   * An expression to define icons.
   * <p/>
   *  To create expressions, you must use {@link ExpressionFactory}.
   *  The expression must be well-formed and resolve to an {@link icon icon expression}.
   * <p/>
   * Note that any attribute used in the expressions <i>must</i> be specified in the constructor parameter <code>attributes</code>.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than changing expressions.
   * <p/>
   */
  get iconExpression(): Expression<ParameterizedPointStyle>;
  set iconExpression(iconExpression: Expression<ParameterizedPointStyle>);
  /**
   *  An expression to define selected icons.
   * <p/>
   *  To create expressions, you must use {@link ExpressionFactory}.
   *  The expression must be well-formed and resolve to an {@link icon icon expression}.
   * <p/>
   * Note that any attribute used in the expressions <i>must</i> be specified in the constructor parameter <code>attributes</code>.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than changing expressions.
   * <p/>
   */
  get selectedIconExpression(): Expression<ParameterizedPointStyle>;
  set selectedIconExpression(iconExpression: Expression<ParameterizedPointStyle>);
  /**
   *  The expression that determines the scale factor to apply to the icons.
   *  <p>
   *    <ul>
   *      <li>Scale <code>1</code> corresponds to the original size of the icon.</li>
   *      <li>Scale <code><1</code> will shrink the icon.</li>
   *      <li>Scale <code>>1</code> will enlarge the icon.</li>
   *    </ul>
   *  </p>
   *  <p>
   *  If not set, icons are never re-scaled.
   *  </p>
   *
   * <p/>
   *  To create expressions, you must use {@link ExpressionFactory}.
   *  The expression must be well-formed and resolve to a number.
   * <p/>
   * Note that any attribute used in the expressions <i>must</i> be specified in the constructor parameter <code>attributes</code>.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than changing expressions.
   * <p/>
   * @default 1
   */
  get scaleExpression(): Expression<number>;
  set scaleExpression(scaleExpression: Expression<number>);
  /**
   *  The expression that determines the scale factor to apply to the selected icons.
   *  <p>
   *    <ul>
   *      <li>Scale <code>1</code> corresponds to the original size of the icon.</li>
   *      <li>Scale <code><1</code> will shrink the icon.</li>
   *      <li>Scale <code>>1</code> will enlarge the icon.</li>
   *    </ul>
   *  </p>
   *  <p>
   *  If not set, icons are never re-scaled.
   *  </p>
   *
   * <p/>
   *  To create expressions, you must use {@link ExpressionFactory}.
   *  The expression must be well-formed and resolve to a number.
   * <p/>
   * Note that any attribute used in the expressions <i>must</i> be specified in the constructor parameter <code>attributes</code>.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than changing expressions.
   * <p/>
   *
   * @default 1
   */
  get selectedScaleExpression(): Expression<number>;
  set selectedScaleExpression(scaleExpression: Expression<number>);
  /**
   *  An expression to filter points.
   * <p/>
   *  To create expressions, you must use {@link ExpressionFactory}.
   *  The expression must be well-formed and resolve to a boolean.
   * <p/>
   * Note that any attribute used in the expressions <i>must</i> be specified in the constructor parameter <code>attributes</code>.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than changing expressions.
   * <p/>
   *
   * @default true
   */
  get visibilityExpression(): Expression<boolean>;
  set visibilityExpression(visibilityExpression: Expression<boolean>);
  get density(): DensitySettings | null;
  set density(densityMap: DensitySettings | null);
  /**
   * Do not override this (as with a {@link FeaturePainter}).
   * All parameterized point styling is configured by setting {@link ParameterizedPointPainter}'s properties.
   */
  paintBody(aGeoCanvas: GeoCanvas, aObject: Feature, aShape: Shape, aLayer: Layer, aMap: Map, aPaintState: PaintState): void;
}
export { ParameterizedPointPainter };