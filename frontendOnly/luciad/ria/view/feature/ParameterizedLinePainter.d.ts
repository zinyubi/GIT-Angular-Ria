import { LineType } from "../../geodesy/LineType.js";
import { Feature } from "../../model/feature/Feature.js";
import { Shape } from "../../shape/Shape.js";
import { ColorMap } from "../../util/ColorMap.js";
import { Layer } from "../Layer.js";
import { Map } from "../Map.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { DensitySettings, FeaturePainter, PaintState } from "./FeaturePainter.js";
import { DrapeTarget } from "../style/DrapeTarget.js";
/**
 * An object describing a mapping of property values to colors used in {@link ParameterizedLinePainterConstructorOptions}.
 */
export interface PropertyColorExpression {
  /**
   * The name of the property as a string.
   */
  property: string;
  /**
   * The value of the property. Can be any type.
   */
  value: any;
  /**
   * The color as a CSS color string, or <code>null</code> to hide features.
   */
  color: string;
}
/**
 * An object literal containing the {@link ParameterizedLinePainter}'s parameters.
 */
export interface ParameterizedLinePainterConstructorOptions {
  /**
   * The list of property names that will be used in the {@link ParameterizedLinePainter.propertyColorExpressions}.
   * If a property is ever to be used in the {@link ParameterizedLinePainter.propertyColorExpressions},
   * it <b>must</b> be listed in this array.
   */
  properties?: string[];
  /**
   * An array of objects describing a mapping of property values to colors.
   * See {@link ParameterizedLinePainter.propertyColorExpressions}.
   */
  propertyColorExpressions?: PropertyColorExpression[];
  /**
   * A function that returns a range value as a number for a given point on a line.
   * The user of this class is free to choose the range of values.
   * If no rangePropertyProvider is passed, range filtering is disabled ({@link rangeWindow} will be ignored).
   * You can not modify the rangePropertyProvider after the {@link ParameterizedLinePainter} has been constructed.
   *
   * @param feature The feature for which to determine a value.
   * @param shape The shape for which to determine a value.
   * @param pointIndex The index of the point in the shape for which to determine a value.
   */
  rangePropertyProvider?: (feature: Feature, shape: Shape, pointIndex: number) => number;
  /**
   * The start / end value for range filtering as an array with two values.
   */
  rangeWindow?: [number, number];
  /**
   * The default line color, represented as a CSS color string.
   */
  defaultColor?: string | null;
  /**
   * The color to paint selected lines with, represented as a CSS color string.
   */
  selectionColor?: string | null;
  /**
   * The {@link ColorMap} that maps a range value to a modulation color.
   * <code>null</code> (the default) to disable.
   */
  rangeColorMap?: ColorMap | null;
  /**
   * The line width, in pixels.
   * @default 1.
   */
  lineWidth?: number;
  /**
   * Whether these lines should be draped on top of the terrain or not.
   *
   * This property only exists for backwards compatibility. You should use {@link drapeTarget} instead.
   * <code>false</code> is equivalent to {@link DrapeTarget.NOT_DRAPED} and <code>true</code> is equivalent to
   * {@link DrapeTarget.TERRAIN}.
   *
   * @default false
   * @deprecated Use {@link drapeTarget} instead.
   */
  draped?: boolean;
  /**
   * Whether these lines should be draped on top of the terrain or a 3D tiles mesh (or both).
   *
   * @default {@link DrapeTarget.NOT_DRAPED}
   * @since 2022.1
   */
  drapeTarget?: DrapeTarget;
  /**
   * Determines how lines between subsequent points will be interpreted.
   */
  lineType?: LineType;
}
/**
 * A ParameterizedLinePainter allows you to visualize line datasets with dynamic styling and filtering, as well as per-pixel styling. <p/>
 * This painter uses the graphics hardware to efficiently switch styling and filtering. <p/>
 * <h3>Highlights</h3>
 * <ul>
 *   <li><i>Property filtering</i>: efficiently filter on {@link propertyColorExpressions}.</li>
 *   <li><i>Property styling</i>: efficiently choose and switch colors based on {@link propertyColorExpressions}.</li>
 *   <li><i>Range filtering</i>: filter parts of a line based on a {@link rangeWindow range}.</li>
 *   <li><i>Per-pixel coloring</i>: per-pixel color along a line based on a varying property with a {@link rangeColorMap}.</li>
 *   <li><i>Density</i>: this painter can be combined with {@link FeaturePainter.density}.
 *   Note that in this case, the alpha value of the final color is used as a weight in the density. The color itself is discarded.</li>
 * </ul>
 * <p/>
 * Note that this painter does not allow overriding of {@link FeaturePainter}.
 * All styling is configured by setting this object's properties. <p/>
 * See also {@link TrajectoryPainter} for a painter with similar capabilities. <p/>
 *
 * <b>Limitations:</b>
 * <ul>
 *   <li>This painter can only be used on a {@link WebGLMap}.</li>
 *   <li>This painter does not support labels. You should not override {@link paintLabel}.</li>
 * </ul>
 * <p/>
 */
declare class ParameterizedLinePainter extends FeaturePainter {
  /**
   * Creates a new ParameterizedLinePainter.
   *
   * <h3>Examples</h3>
   * <h4>Specifying filtering and styling based on feature properties</h4>
   * You can specify simple expressions to determine the visibility and color based on feature properties.
   * Use a <code>null</code> color to hide features.
   *
   * ```javascript
   * // Create a painter, specify that we will filter on "airline" and "destination"
   * const linePainter = new ParameterizedLinePainter({
   *          properties: ["airline", "destination"],
   *          defaultColor: "rgb(255, 255, 255)"
   *       });
   *
   * // At runtime, immediately change styling and filtering
   * linePainter.propertyColorExpressions = [
   *      {property: "destination", value: "Brussels", color: "rgb(255, 0, 0")},  // Destination Brussels = red
   *      {property: "destination", value: "London", color: "rgb(0, 255, 0")}     // Destination London = green
   * ];
   * linePainter.defaultColor = null;                                             // Hide all the rest
   *
   * // At runtime, immediately change styling and filtering
   * linePainter.propertyColorExpressions = [
   *      {property: "airline", value: "Brussels Airlines", color: "rgb(255, 0, 0")},  // Brussels Airlines = red
   * ];
   * linePainter.defaultColor = "rgb(0, 0, 255)";                                      // All the rest = blue
   * ```
   *
   * <h4>Specifying per-point range value and continuously change range window</h4>
   *
   * ```javascript
   * // Create a painter, specify a provider that can calculate a value per point of a line
   * const linePainter = new ParameterizedLinePainter({
   *   lineWidth: 2,
   *   rangePropertyProvider: function(feature, shape, pointIndex) {
   *     return feature.properties.fuelconsumptions[pointIndex];
   *   },
   *   rangeColorMap: ColorMap.createGradientColorMap([
   *          {level: 0,    color: "rgba(0, 0, 255, 0.0)"},  // 0..100: blue
   *          {level: 100,  color: "rgba(0, 0, 255, 1)"},    // 100..500: blue to green
   *          {level: 500,  color: "rgba(0, 255, 0, 1)"},    // 500..1000: green to red
   *          {level: 1000, color: "rgba(255, 0, 0, 1)"}]),  // 1000+: red
   *   rangeWindow: [0, 5000]
   * });
   *
   * // Update the painter when the user updates the min/max fuel consumption window in the UI (e.g. on slider drag)
   * fuelConsumptionSlider.onChange(function(min, max) {
   *   linePainter.rangeWindow = [min, max];
   * });
   * ```
   *
   * @param options An object literal containing the {@link ParameterizedLinePainter}'s parameters.
   */
  constructor(options: ParameterizedLinePainterConstructorOptions);
  /**
   * An array of objects describing a mapping of property values to colors.
   * The mapping can be read as: <i>if property x equals value y, use color z. Else if property p equals value v use color c...</i>.
   * When multiple entries result in a color for an object, the first entry of the possible entries in the array will be used.
   *
   * @default <code>[]</code>
   */
  get propertyColorExpressions(): PropertyColorExpression[];
  set propertyColorExpressions(propertyColorExpression: PropertyColorExpression[]);
  /**
   * The default line color, represented as a CSS color string.
   * If no color can be determined using the {@link propertyColorExpressions}, this color is used.
   *
   * @default <code>rgb(0, 0, 255)</code> (Opaque blue)
   */
  get defaultColor(): string | null;
  set defaultColor(defaultColor: string | null);
  /**
   * The color to paint selected lines with, represented as a CSS color string.
   * For selected objects, selectionColor overrides the color determined by the {@link propertyColorExpressions}.
   *
   * @default <code>rgb(255, 0, 0)</code> (Opaque red)
   */
  get selectionColor(): string | null;
  set selectionColor(selectionColor: string | null);
  /**
   * The {@link ColorMap} that for each pixel in a line maps its range value to a color. <p/>
   * This allows you to change the color along the line based on a varying property, such a fuel consumption. <p/>
   * The resulting color is a modulation color: it is "multiplied" with the {@link defaultColor}, or color based on
   * the {@link propertyColorExpressions}.
   * Typically, either the normal color is white and the range color is not, or vice-versa:
   * <ul>
   *   <li>If the normal color is white, the range color becomes the final color.</li>
   *   <li>If the range color is white, it's opacity (alpha) value is used together with the normal color.</li>
   *   <li>If neither are white, the final color is a multiplication of the two colors.
   * </ul>
   * Set a falsy value to disable color modulation over the range window.
   *
   * @default <code>null</code>
   */
  get rangeColorMap(): ColorMap | null;
  set rangeColorMap(rangeColorMap: ColorMap | null);
  /**
   * The start / end values for the window of the range property filter. <p/>
   * Parts of a line whose range values are outside this range window are not painted. <p/>
   * This must be an array with two values.  The end value should be larger than the start value.
   *
   * @default <code>[0, Number.MAX_VALUE]</code>
   */
  get rangeWindow(): [number, number];
  set rangeWindow(range: [number, number]);
  /**
   * Set or get the density painting settings on this painter.  Use <code>null</code> to disable density painting.
   * <p/>
   * The setting affects all features in the layer associated with this painter.
   * <p/>
   * The density settings object has one property: <code>colorMap</code>, the {@link ColorMap color map}
   * used to map density values to color.
   * <p/>
   * The density at a particular location is the sum of the value of alpha channel for all overlapping objects. So for
   * a single opaque object you would get a density value of 1.0, for 2 opaque objects 2.0, etc.
   * <br/>
   * Example:
   *
   * ```javascript
   *   var painter = new FeaturePainter();
   *   painter.paintBody = ... // customize painter as usual
   *   painter.density = {
   *     colorMap: ColorMap.createGradientColorMap([
   *       {level:  0, color: "rgba(  0,   0,   0, 0.0)"}, // no objects       -> Transparent
   *       {level:  1, color: "rgba(  0, 255,   0, 0.5)"}, // 1 opaque object  -> Transparent green
   *       {level: 10, color: "rgba(255, 255, 255, 1.0)"}  //10 opaque objects -> White
   *     ])
   *   };
   * ```
   *
   * <p/>
   * Notes when using density painting:
   * <ul>
   *   <li>Density painting works for all kinds of objects: points/icons, lines and areas.</li>
   *   <li>The color aspect of the styling provided in {@link paintBody} is ignored.  The alpha value of the color is used as a per-feature weight.</li>
   *   <li>If you paint icons, you can leave out the icon image.  You will automatically get a gradient icon.  You can still adapt the size with the {@link GenericIconStyle.width width} and {@link GenericIconStyle.height height} style properties.</li>
   * </ul>
   * <p/>
   * This property is only supported on a {@link WebGLMap}, and is ignored otherwise.
   */
  get density(): DensitySettings | null;
  set density(value: DensitySettings | null);
  /**
   * Do not override this method.
   */
  paintBody(geoCanvas: GeoCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState): void;
  /**
   * Not applicable for {@link ParameterizedLinePainter}
   */
  paintLabel?(): void;
  /**
   * Not applicable for {@link ParameterizedLinePainter}
   */
  paintBorderBody?(): void;
  /**
   * Not applicable for {@link ParameterizedLinePainter}
   */
  paintBorderLabel?(): void;
}
export { ParameterizedLinePainter };