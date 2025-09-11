import { Feature } from "../../model/feature/Feature.js";
import { Shape } from "../../shape/Shape.js";
import { LineType } from "../../geodesy/LineType.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { Layer } from "../Layer.js";
import { Map } from "../Map.js";
import { FeaturePainter, PaintState } from "./FeaturePainter.js";
import { DrapeTarget } from "../style/DrapeTarget.js";
/**
 * An object describing a mapping of property values to colors used in {@link TrajectoryPainterConstructorOptions}
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
 * An object literal containing the {@link TrajectoryPainter} constructor's parameters.
 */
export interface TrajectoryPainterConstructorOptions {
  /**
   * The list of property names that will be used in the {@link propertyColorExpressions propertyColorExpressions}.
   * If a property is ever to be used in the {@link propertyColorExpressions propertyColorExpressions},
   * it <b>must</b> be listed in this array.
   */
  properties?: string[];
  /**
   * An array of objects describing a mapping of property values to colors.
   */
  propertyColorExpressions?: PropertyColorExpression[];
  /**
   * A function that returns time as a number for a given point on a trajectory.</p>
   * The user of this class is free to choose the range of time values. However the values should not be too big
   * because they are internally converted to 32-bit floating-point numbers. For example do not use the time in
   * milliseconds from epoch (e.g. 1970) but instead use the time in seconds from the start of the first day in
   * your data set.</p>
   * If no timeProvider is passed, time filtering is disabled ({@link timeWindow} will be ignored).</p>
   * You can not modify the timeProvider after the {@link TrajectoryPainter} has been constructed.
   *
   * @param feature The feature for which to determine a time.
   * @param shape The shape for which to determine a time.
   * @param pointIndex The index of the point in the shape for which to determine a time.
   */
  timeProvider?: (feature: Feature, shape: Shape, pointIndex: number) => number;
  /**
   * The start / end value for time filtering as an array with two values.
   */
  timeWindow?: [number, number];
  /**
   * The weight to apply to parts of lines outside of the configured time window.
   */
  outsideTimeRangeWeight?: number;
  /**
   * The default line color of trajectories, represented as a CSS color string.
   */
  defaultColor?: string | null;
  /**
   * The color to paint selected trajectories with, represented as a CSS color string.
   */
  selectionColor?: string | null;
  /**
   * The line width, in pixels, to paint trajectories with.
   * @default 1
   */
  lineWidth?: number;
  /**
   * Whether these lines should be draped on top of the terrain or not.
   *
   * This property only exists for backwards compatibility. You should use {@link drapeTarget} instead.
   * <code>false</code> is equivalent to {@link DrapeTarget.NOT_DRAPED} and <code>true</code> is equivalent to
   * {@link DrapeTarget.TERRAIN}.
   *
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
 * TrajectoryPainter.
 *
 * This painter uses the graphics hardware to efficiently switch styling and filtering. <p/>
 * <h3>Highlights</h3>
 * <ul>
 *   <li><i>Property filtering</i>: efficiently filter on {@link propertyColorExpressions}.</li>
 *   <li><i>Property styling</i>: efficiently choose and switch colors based on {@link propertyColorExpressions}.</li>
 *   <li><i>Time filtering</i>: filter parts of a line based on a {@link timeWindow}.</li>
 *   <li><i>Density</i>: overlapping trajectories are automatically painted with more intense color.</li>
 *   <li><i>Trajectory head and trail highlighting</i>: the part of the line close to the current time range end is emphasized, the tail is faded out.</li>
 * </ul>
 * <p/>
 * Note that this painter does not allow overriding of {@link FeaturePainter}.
 * All styling is configured by setting this object's properties. <p/>
 *
 * See also {@link ParameterizedLinePainter} for a painter with similar capabilities for more generic line datasets. <p/>
 *
 * <b>Limitations:</b>
 * <ul>
 *   <li>This painter can only be used on a {@link WebGLMap}.</li>
 *   <li>This painter cannot be combined with {@link FeaturePainter.density} based on a color map.
 *       Instead, density is automatically applied using a gradient per color (default and in the expressions).</li>
 *   <li>You can only use two different colors in {@link propertyColorExpressions} or {@link defaultColor}.
 *       You can re-use the same color multiple times though.
 *       For example, you can have two rules that colors red, two that color green, two that hide elements and a default color green.
 *       This limitation exists to allow efficient density using color gradients.</li>
 *   <li>This painter does not support labels. You should not override {@link paintLabel}.</li>
 * </ul>
 */
declare class TrajectoryPainter extends FeaturePainter {
  /**
   * Creates a new TrajectoryPainter.
   *
   * <h3>Examples</h3>
   * <h4>Specifying filtering and styling based on feature properties</h4>
   * You can specify simple expressions to determine the visibility and color based on feature properties.
   * Use a <code>null</code> color to hide features.<p/>
   *
   * ```javascript
   * // Create a painter, specify that we will filter on "airline" and "destination"
   * const trajectoryPainter = new TrajectoryPainter({
   *   properties: ["airline", "destination"],
   *   defaultColor: "rgb(255, 255, 255)"
   * });
   *
   * // At runtime, immediately change styling and filtering
   * trajectoryPainter.propertyColorExpressions = [
   *   {property: "destination", value: "Brussels", color: "rgb(255, 0, 0")},  // Destination Brussels = red
   *   {property: "destination", value: "London", color: "rgb(0, 255, 0")}     // Destination London = green
   * ];
   * trajectoryPainter.defaultColor = null;                                       // Hide all the rest
   *
   * // At runtime, immediately change styling and filtering
   * trajectoryPainter.propertyColorExpressions = [
   *   {property: "airline", value: "Brussels Airlines", color: "rgb(255, 0, 0")},  // Brussels Airlines = red
   * ];
   * trajectoryPainter.defaultColor = "rgb(0, 0, 255)";                                // All the rest = blue
   * ```
   *
   * <h4>Specifying per-point time and continuously change time window</h4><p/>
   *
   * ```javascript
   * // Create a painter, specify a provider that can calculate time per point of a line
   * const trajectoryPainter = new TrajectoryPainter({
   *   lineWidth: 1,
   *   timeProvider: function(feature, shape, pointIndex) {
   *     return feature.properties.timestamps[pointIndex];
   *   },
   *   timeWindow: [0, 3600]
   * });
   *
   * // Update the painter when the users updates the time window in the UI (e.g. on slider drag)
   * timeSlider.onChange(function(startTime, endTime) {
   *   trajectoryPainter.timeWindow = [startTime, endTime];
   * });
   * ```
   *
   * @param {TrajectoryPainterConstructorOptions} options An object literal containing the {@link TrajectoryPainter}'s parameters.
   */
  constructor(options?: TrajectoryPainterConstructorOptions);
  /**
   * The start / end values for the window of the time filter. <p/>
   * This setting only has effect if you have set a timeProvider in the constructor. <p/>
   * This must be an array with two values. <p/>
   * The end value should be larger than the start value.
   *
   * @default <code>[0, Number.MAX_VALUE]</code>
   */
  get timeWindow(): [number, number];
  set timeWindow(range: [number, number]);
  /**
   * The weight of parts of lines that are outside of the configured time windows. <p/>
   * Use 0 to completely discard these parts, so that they don't count in the density. <p/>
   * Use a number > 0 (for example 0.05) to let these parts add to the density.
   * They will form a hazy image of all the lines, whether "active" or not. <p/>
   * Note that numbers lower than 0.004 are treated as 0 (they map to 0 when representing it as a single byte).
   *
   * @default <code>0.01</code> (1%)
   */
  get outsideTimeRangeWeight(): number;
  set outsideTimeRangeWeight(timeWeight: number);
  /**
   * An array of objects describing a mapping of property values to colors. <p/>
   * Each object in the array describes a single entry in the map and has the following structure:
   * <ul>
   *   <li><b>property</b> The name of the property as a string.</li>
   *   <li><b>value</b> The value of the property. Can be any type.</li>
   *   <li><b>color</b> The color as a CSS color string, or <code>null</code> to hide features.</li>
   * </ul>
   * The mapping can be read as: <i>if property x equals value y, use color z. Else if property p equals value v use color c...</i>.<p/>
   *
   * When multiple entries result in a color for a trajectory, the first entry of the possible entries in the array will be used. <p/>
   *
   * Note that any property used in the expressions <i>must</i> be specified in the constructor parameter
   * {@link TrajectoryPainterConstructorOptions.properties}. <p/>
   *
   * You can only use two different colors in {@link propertyColorExpressions} or {@link defaultColor}.
   * You can re-use the same color multiple times though.
   *
   * @default <code>[]</code> (no expressions, defaultColor is used)
   */
  get propertyColorExpressions(): PropertyColorExpression[];
  set propertyColorExpressions(propertyColorExpression: PropertyColorExpression[]);
  /**
   * The default line color of trajectories, represented as a CSS color string.<p/>
   * If no color can be determined using the {@link propertyColorExpressions}, this color is used to paint the trajectory. <p/>
   * Use <code>null</code> to hide features that do not match any {@link propertyColorExpressions}. <p/>
   * You can only use two different colors in {@link propertyColorExpressions} or {@link defaultColor}.
   * You can re-use the same color multiple times though.
   *
   * @default <code>rgb(255, 255, 255)</code> (white) when {@link TrajectoryPainterConstructorOptions.defaultColor} is not defined.
   */
  get defaultColor(): string | null;
  set defaultColor(defaultColor: string | null);
  /**
   * The color to paint selected trajectories with, represented as a CSS color string. <p/>
   * For selected objects, selectionColor overrides the color determined by the {@link propertyColorExpressions}.
   *
   * @default <code>rgb(255, 0, 0)</code> (red) when {@link TrajectoryPainterConstructorOptions.selectionColor} is not defined.
   */
  get selectionColor(): string | null;
  set selectionColor(selectionColor: string | null);
  get density(): null;
  /**
   * Do not override this property.
   */
  set density(v: null);
  /**
   * Do not override this method.
   */
  paintBody(geoCanvas: GeoCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState): void;
  /**
   * Not applicable for {@link TrajectoryPainter}
   */
  paintLabel?(): void;
  /**
   * Not applicable for {@link TrajectoryPainter}
   */
  paintBorderBody?(): void;
  /**
   * Not applicable for {@link TrajectoryPainter}
   */
  paintBorderLabel?(): void;
}
export { TrajectoryPainter };