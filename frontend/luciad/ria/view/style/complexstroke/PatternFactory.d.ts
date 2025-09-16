import { Pattern } from "./Pattern.js";
import { ArrowType } from "./ArrowType.js";
/**
 * An object that describes the line or outline of a pattern.
 */
export interface OutlinePatternOptions {
  /**
   * The width of the line in pixels.
   */
  width?: number;
  /**
   * The color of the line as a CSS color string.
   */
  color?: string;
}
/**
 *  An object that describes the fill of a pattern.
 */
export interface FillPatternOptions {
  /**
   * The fill color as a CSS color string.
   */
  color?: string;
}
/**
 * An object literal describing the configuration of the allow overlap pattern.
 */
export interface AllowOverlapPatternOptions {
  /**
   * The allowed overlap on the left, in pixels.
   * @default 0
   */
  overlapLeft?: number;
  /**
   * The allowed overlap on the right, in pixels.
   * @default 0
   */
  overlapRight?: number;
}
/**
 * An object literal describing the configuration of the pattern.
 */
export interface ArcPatternOptions {
  /**
   * The start angle of the arc, in degrees. A startAngle of 0 is on the baseline and the arc goes counterclockwise.
   * @default 0
   */
  startAngle?: number;
  /**
   * The angle of the arc, in degrees.
   * @default 360
   */
  angle?: number;
  /**
   * The minor radius of the arc, in pixels.
   * @default 10
   */
  minorRadius?: number;
  /**
   * The offset of the arc, relative to the base line, in pixels.
   * @default 0
   */
  offset?: number;
  /**
   * The length of the line.
   * <code>relative</code> determines what the unit of this length is.
   * @default 10
   */
  length?: number;
  /**
   * If set to true, <code>length</code> is interpreted as a value ([0, 1]) relative to the length of the entire line.
   * Otherwise, <code>length</code> is interpreted as a length in pixels.
   * @default false
   */
  relative?: boolean;
  /**
   * An object that describes the outline of the arc.
   * If no line or fill color is set, the pattern will be painted with a 1-pixel black outline.
   */
  line?: OutlinePatternOptions;
  /**
   * An object that describes the fill of the arc. If omitted, the pattern will be painted without a fill.
   */
  fill?: FillPatternOptions;
}
/**
 * An object literal describing the configuration of the pattern.
 */
export interface ArrowPatternOptions {
  /**
   * The type of arrow.
   * See {@link ArrowType} for illustrations of the different types of arrows.
   * @default {@link ArrowType.REGULAR_FILLED}
   */
  type?: ArrowType;
  /**
   * If true, the arrow is oriented towards the end of the line.
   * @default true
   */
  forward?: boolean;
  /**
   * The size (~ length) of the arrow, in pixels.
   * @default 5
   */
  size?: number;
  /**
   * The height of the arrow, in pixels. Must be strictly greater than 0.
   * If it is not set, the arrow uses a default height, depending on the arrow type(<code>type</code>).
   */
  height?: number;
  /**
   * The offset of the arrow, in pixels above the base line.
   * @default 0
   */
  offset?: number;
  /**
   * An object that describes the outline of the wave.
   * If no line or fill color is set, the pattern will be painted with a 1-pixel black outline.
   */
  line?: OutlinePatternOptions;
  /**
   * An object that describes the fill of the arrow. If omitted, the pattern will be painted without a fill.
   */
  fill?: FillPatternOptions;
}
/**
 * An object literal describing the configuration of the icon pattern.
 */
export interface IconPatternOptions {
  /**
   * The image or URL of the icon.
   */
  icon: HTMLImageElement | HTMLCanvasElement | string;
  /**
   * The offset, in pixels, of the icon from the base line
   * @default 0
   */
  offset?: number;
  /**
   * Indicates if the icon should be flipped when it is turned upside down.
   * Note that the device needs to support float textures for this to work on a WebGLMap.
   * If the device does not support float textures, this option is ignored, and the icon will not be rotated up.
   * To check if float textures are supported, open the "device support" sample on the device.
   * <code>rotateUp</code> will always work on a non-WebGL Map.
   * @default false
   */
  rotateUp?: boolean;
  /**
   * Whether the icon should be requested with authentication parameters.
   * Setting this to true is required when the server requires cookies or basic HTTP authentication.
   * This flag should be set to false if the server is configured to allow cross-origin requests from all hosts.
   * Such servers reject all authenticated requests.
   * This parameter is only relevant when you are using a URL. If you use the icon using an image, the credentials are
   * automatically handled by the browser.
   */
  credentials?: boolean;
  /**
   * If <code>size</code> is specified, the height of the icon will be scaled to that size and the corresponding aspect
   * will be used for the width.
   * </p>
   * This size is interpreted in the {@link ComplexStrokedLineStyle.uom unit of measure of your line}, so it can be world-sized.
   * </p>
   * If the property is not specified then the icon is painted at its original pixel resolution.
   */
  size?: number;
  /**
   * The rotation angle around the center of the icon's image, specified in degrees.
   * Rotations are applied in a clock-wise fashion relatively to the direction of the underlying line.
   * When <code>rotateUp</code> option is set to true, the flipping occurs on the already rotated icon.
   * @default 0, which implies the icon will not be rotated.
   */
  rotation?: number;
  /**
   * The opacity of the icon, determines how transparent an icon will be painted. It is a numeric value and needs to be
   * specified between 0 and 1. 0 indicates that the icon will be painted completely transparent and 1 indicates that
   * the original opacity of the icon will be used.
   */
  opacity?: number;
}
/**
 * An object literal describing the configuration of the line pattern.
 */
export interface LinePatternOptions {
  /**
   * Sets the offset of the first point of the segment, relative to the base line.
   * @default 0
   */
  offset0?: number;
  /**
   * Sets the offset of the second point of the segment, relative to the base line.
   * @default 0
   */
  offset1?: number;
  /**
   * The length of the line.
   * <code>relative</code> determines what the unit of this length is.
   * @default 10
   */
  length?: number;
  /**
   * If set to true, <code>length</code> is interpreted as a value ([0, 1]) relative to the length of the entire line.
   * Otherwise, <code>length</code> is interpreted as a length in pixels.
   * @default false
   */
  relative?: boolean;
  /**
   * An object that describes the outline of the line.
   * If no line or fill color is set, the pattern will be painted with a 1-pixel black outline.
   */
  line?: OutlinePatternOptions;
  /**
   * An object that describes the fill of the line. If omitted, the pattern will be painted without a fill.
   */
  fill?: FillPatternOptions;
}
/**
 * An object literal describing the configuration of the parallel line pattern.
 */
export interface ParallelLinePatternOptions {
  /**
   * Sets the offset of the segment, relative to the base line.
   * @default 0
   */
  offset?: number;
  /**
   * The length of the parallel line.
   * <code>relative</code> determines what the unit of this length is.
   * @default 10
   */
  length?: number;
  /**
   * If set to true, <code>length</code> is interpreted as a value ([0, 1]) relative to the length of the entire line.
   * Otherwise, <code>length</code> is interpreted as a length in pixels.
   * @default false
   */
  relative?: boolean;
  /**
   * An object that describes the outline of the parallel line.
   * If no line color is set, the pattern will be painted with a 1-pixel black outline.
   */
  line?: OutlinePatternOptions;
}
/**
 * An object literal describing the configuration of the polyline pattern.
 */
export interface PolylinePatternOptions {
  /**
   * An array of arrays with 2 elements each. Each 2-element array represents a point on the polyline.
   */
  points: [number, number][];
  /**
   * An object that describes the outline of the line.
   * If no line or fill color is set, the pattern will be painted with a 1-pixel black outline.
   */
  line?: OutlinePatternOptions;
}
/**
 * An object literal describing the configuration of the rectangle pattern.
 */
export interface RectanglePatternOptions {
  /**
   * Sets the minimum height of the rectangle, relative to the base line.
   * This is typically a negative value.
   * @default -5
   */
  minHeight?: number;
  /**
   * Sets the maximum height of the rectangle, relative to the base line.
   * This is typically a positive value.
   * @default 5
   */
  maxHeight?: number;
  /**
   * The length of the line.
   * <code>relative</code> determines what the unit of this length is.
   * @default 10
   */
  length?: number;
  /**
   * If set to true, <code>length</code> is interpreted as a value ([0, 1]) relative to the length of the entire line.
   * Otherwise, <code>length</code> is interpreted as a length in pixels.
   * @default false
   */
  relative?: boolean;
  /**
   * An object that describes the outline of the rectangle.
   * If no line or fill color is set, the pattern will be painted with a 1-pixel black outline.
   */
  line?: OutlinePatternOptions;
  /**
   * An object that describes the fill of the line. If omitted, the pattern will be painted without a fill.
   */
  fill?: FillPatternOptions;
}
export interface ComplexStrokedTextStyle {
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
   * The font to use.
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
   * The stroke of the text. This is the outline of the text. It can partially overlap with the fill and halo.
   */
  stroke?: string;
  /**
   * the stroke width
   */
  strokeWidth?: number;
}
/**
 * An object literal describing the configuration of the text pattern.
 */
export interface TextPatternOptions {
  /**
   * An array of strings, containing the text to display. Each element in the array is painted on a separate line.
   */
  text: string[];
  /**
   * Indicates if the text should be flipped when it is turned upside down.
   * Note that the device needs to support float textures for this to work on a WebGLMap.
   * If the device does not support float textures, this option is ignored, and the text will not be rotated up.
   * To check if float textures are supported, open the "device support" sample on the device.
   * <code>rotateUp</code> will always work on a non-WebGL Map.
   * @default true
   */
  rotateUp?: boolean;
  /**
   * The offset, in pixels, of the text from the base line.
   * @default 0
   */
  offset?: number;
  /**
   * The style of the text. Note that properties used to offset the position of the text are not supported.
   */
  textStyle?: ComplexStrokedTextStyle;
  /**
   * <p>If <code>size</code> is specified, the height of the text will be scaled to that size and the corresponding aspect
   * will be used for the width.</p>
   * <p>This size is interpreted in the {@link ComplexStrokedLineStyle.uom unit of measure of your line}, so it can be world-sized.</p>
   * If the property is not specified then the text is painted at its original pixel resolution.
   * @since 2023.0
   */
  size?: number;
}
/**
 * An object literal describing the configuration of the triangle pattern.
 */
export interface TrianglePatternOptions {
  /**
   * An array with 2 elements: the x- and y-coordinate of the first point of the triangle.
   * These coordinates are pixel values.
   */
  p0: [number, number];
  /**
   * An array with 2 elements: the x- and y-coordinate of the second point of the triangle.
   * These coordinates are pixel values.
   */
  p1: [number, number];
  /**
   * An array with 2 elements: the x- and y-coordinate of the third point of the triangle.
   * These coordinates are pixel values.
   */
  p2: [number, number];
  /**
   * An object that describes the outline of the triangle.
   * If no line or fill color is set, the pattern will be painted with a 1-pixel black outline.
   */
  line?: OutlinePatternOptions;
  /**
   * An object that describes the fill of the triangle. If omitted, the pattern will be painted without a fill.
   */
  fill?: FillPatternOptions;
}
/**
 * An object literal describing the configuration of the wave pattern.
 */
export interface WavePatternOptions {
  /**
   * This determines at which point on the sine function the wave begins.
   * 0 angle is on the baseline, 90 is above the baseline at the max amplitude.
   * A startAngle of 180 will result in a wave that starts on the baseline and will continue to the right side
   * of the line direction.
   */
  startAngle?: number;
  /**
   * The angle of the wave in degrees.
   * When values greater than 360 degrees are used the pattern keeps going, e.g. an angle of 720 will result in two complete waves.
   * @default 360
   */
  angle?: number;
  /**
   * The amplitude of the wave. This is a value in pixels, relative to the base line.
   * @default 10
   */
  amplitude?: number;
  /**
   * The length of the wave.
   * <code>relative</code> determines what the unit of this length is.
   * @default 10
   */
  length?: number;
  /**
   * If set to true, <code>length</code> is interpreted as a value ([0, 1]) relative to the length of the entire line.
   * Otherwise, <code>length</code> is interpreted as a length in pixels.
   * @default false
   */
  relative?: boolean;
  /**
   * An object that describes the outline of the wave.
   * If no line or fill color is set, the pattern will be painted with a 1-pixel black outline.
   */
  line?: OutlinePatternOptions;
  /**
   * An object that describes the fill of the wave. If omitted, the pattern will be painted without a fill.
   */
  fill?: FillPatternOptions;
}
/**
 * Creates a pattern that allows for overlap of patterns on the left and right side of the given
 * pattern. Note that this pattern can only be used in combination with patterns with a fixed
 * (non-relative) length. If this is not the case, an error is thrown.
 *
 * <p>In the following examples, two half circles are painted next to each other. This is done
 * twice. The first time, no overlap is allowed. The second time, overlap is allowed:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_ALLOW_OVERLAP]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_allowOverlap.png" alt="PatternFactory.allowOverlap illustration"/>
 *
 * @param pattern The pattern to allow overlap for. Cannot be null.
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern that allows overlap with other patterns.
 */
export declare function allowOverlap(pattern: Pattern, options: AllowOverlapPatternOptions): Pattern;
/**
 * Creates a pattern that appends multiple sub-patterns. Appended patterns are painted next to each other.
 *
 * <p>In the following example, 2 circular patterns are appended:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_APPEND]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_append.png" alt="PatternFactory.append illustration"/>
 *
 * @param children An array of patterns to append.
 *        Must be non-null, non-empty and cannot contain null values.
 * @return A pattern representing multiple appended patterns.
 */
export declare function append(children: Pattern[]): Pattern;
/**
 * Creates a pattern that allows the {@link ComplexStrokedLineStyle.fallback fallback pattern} to be painted on top of
 * the given pattern.</p>
 *
 * <p>Normally, a {@link ComplexStrokedLineStyle.fallback fallback pattern} is only painted where no other pattern could be painted.
 * This pattern wrapper adds an exception to this. When a pattern is wrapped with a
 * <code>combineWithFallback</code>, this pattern can be painted in addition to a
 * {@link ComplexStrokedLineStyle.fallback fallback pattern}.
 * This is useful for adding a non-filled arrowhead, as in the image example.</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_COMBINE_WITH_FALLBACK]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_combineWithFallbackStroking.png" alt="PatternFactory.combineWithFallback illustration"/>
 *
 * @param pattern The pattern to combine with the {@link ComplexStrokedLineStyle.fallback fallback pattern}. Cannot be null.
 * @return a pattern that allows the {@link ComplexStrokedLineStyle.fallback fallback pattern} to be combined with this pattern.
 */
export declare function combineWithFallback(pattern: Pattern): Pattern;
/**
 * Creates a pattern that allows the {@link ComplexStrokedLineStyle.regular regular pattern} to be painted on top of the given pattern.</p>
 *
 * <p>A {@link ComplexStrokedLineStyle.regular regular pattern} is a pattern that is repeated along the whole line.
 * Normally, a {@link ComplexStrokedLineStyle.regular regular pattern} is only painted where
 * no decorations could be painted. This pattern wrapper adds an exception to this.
 * When a pattern is wrapped with a <code>combineWithRegular</code> pattern,
 * the pattern can be painted in addition to the {@link ComplexStrokedLineStyle.regular regular pattern}.
 * This is useful for adding a non-filled arrowhead, as in the image example.</p>
 *
 * <p>Note that using this pattern wrapper implies that a
 * {@link ComplexStrokedLineStyle.fallback fallback pattern} can be painted as well
 * (if part of the {@link ComplexStrokedLineStyle.regular regular pattern} cannot be painted).</p>
 * <p>Also note that if no {@link ComplexStrokedLineStyle.regular regular pattern}
 * is specified, then this pattern is combined with the
 * {@link ComplexStrokedLineStyle.fallback fallback pattern} instead,
 * as if you are using {@link combineWithFallback} for example.</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_COMBINE_WITH_REGULAR]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_combineWithRegularStroking.png" alt="PatternFactory.combineWithRegular illustration"/>
 *
 * @param pattern The pattern to combine with the
 *        {@link ComplexStrokedLineStyle.regular regular pattern}. Cannot be null.
 * @return a pattern that allows the {@link ComplexStrokedLineStyle.regular regular pattern}
 *         to be combined with this pattern
 */
export declare function combineWithRegular(pattern: Pattern): Pattern;
/**
 * Creates a pattern with an arc or circle shape.
 *
 * <p>
 *
 * <p>Sample code:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_ARC1]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_arc.png" alt="PatternFactory.arc illustration"/>
 *
 * <p>The following snippet shows how to fill an arc:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_ARC2]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_filledArc.png" alt="Filled PatternFactory.arc illustration"/>
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern shaped like an arc or a circle.
 */
export declare function arc(options: ArcPatternOptions): Pattern;
/**
 * Creates a pattern with an arrow shape.
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_ARROW]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_arrow.png" alt="PatternFactory.arrow illustration"/>
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern shaped like an arrow.
 */
export declare function arrow(options: ArrowPatternOptions): Pattern;
/**
 * Creates a pattern that ensures that sub-patterns are always painted together.
 *
 * <p>By making a composed pattern ({@link compose}, {@link append}, {@link repeat},...)
 * atomic, you ensure that the composed pattern is never broken apart during painting. The sub-patterns will always
 * be painted together, or not at all.</p>
 *
 * <p>In the example image, the circle patterns are appended. When they are not atomic, the
 * sub-strokes of the 'append' pattern can be dropped individually. This is what happens in the
 * first pattern. If there is not enough room for a circle to be placed, it is dropped.</p>
 *
 * <p>However, in an atomic pattern, all sub-patterns of the 'append' stroke are dropped
 * together if one of them does not have enough space. This is useful when you are appending multiple
 * patterns, where it is important that all sub-patterns are always visible at the same time.</p>
 *
 * <p>Sample code:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_ATOMIC]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_atomic.png" alt="PatternFactory.atomic illustration"/>
 *
 * @param pattern The pattern to make atomic. Cannot be null.
 * @return An atomic version of the wrapped pattern.
 */
export declare function atomic(pattern: Pattern): Pattern;
/**
 * Creates a new pattern that consists of sub-patterns that are painted on top of each other.
 *
 * <p>When multiple patterns are composed, they are painted on top of each other. If one of the strokes has a
 * different length than the other strokes, it is aligned to the center of the largest stroke.</p>
 *
 * <p>In the following example, a horizontal red line and half a red circle are composed:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_COMPOSE]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_compose.png" alt="PatternFactory.compose illustration"/>
 *
 * @param children An array of patterns to compose.
 *        Must be non-null, non-empty and cannot contain null values.
 * @return  A new pattern that composes a number of sub-patterns.
 */
export declare function compose(children: Pattern[]): Pattern;
/**
 * Creates a gap pattern, which does not paint anything.
 *
 * <p>A gap pattern occupies space only. It can be used to add space in between other strokes, for example.</p>
 *
 * <p>The following example shows a circle stroke, with a gap at its left and right:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_GAP]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_gap.png" alt="PatternFactory.gap illustration"/>
 *
 * @param length The length of the gap.
 *        <code>relative</code> determines what the unit of this length is.
 * @param relative If set to true, <code>length</code> is interpreted as a value ([0, 1]) relative to the length of
 *        the entire line. Otherwise, <code>length</code> is interpreted as a length in pixels. Defaults to false.
 * @return A gap pattern.
 */
export declare function gap(length: number, relative?: boolean): Pattern;
/**
 * Creates a pattern with a line segment shape.
 *
 * <p>A line segment is defined by:</p>
 *
 * <ul>
 *   <li>a length, meaning the distance between its two points, see <code>length</code></li>
 *   <li>the offsets of the start and end points with respect to the base line. See <code>offset0</code> and <code>offset1</code></li>
 *   <li>styling properties: <code>line.color</code> and <code>line.width</code></li>
 * </ul>
 *
 * <p>Note that a filled line pattern is very similar to a {@link triangle filled triangle}, in the sense
 * that both can be used to fill areas. The difference is that the filled triangle
 * pattern is a general triangle, while this stroke represents an area between a line and the base
 * line. Because this stroke is faster to evaluate, it is advised for use whenever possible. In cases
 * where a more complicated area needs to be filled, the filled triangle stroke can be used
 * instead.</p>
 *
 * <p>Sample code snippet to make a non-filled line:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_LINE1]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_line.png" alt="PatternFactory.line illustration"/>
 *
 * <p>Sample code snippet to make a filled line:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_LINE2]]
 * ```
 *
 * <p>Results in</p>
 *
 * <img src="media://complexstroke/complexStroke_filledLine.png" alt="Filled PatternFactory.line illustration"/>
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern shaped as a line segment.
 */
export declare function line(options: LinePatternOptions): Pattern;
/**
 * Creates a pattern with a line segment shape that is parallel to the base line.
 *
 * <p>Sample code snippet to make a parallelLine:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_PARALLEL_LINE]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_parallelLine.png" alt="PatternFactory.parallelLine illustration"/>
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern that is shaped as a line segment, parallel to the base line.
 */
export declare function parallelLine(options?: ParallelLinePatternOptions): Pattern;
/**
 * Creates a pattern with a polyline shape.
 *
 * <p>This is demonstrated in the following sample code:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_POLYLINE]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_polyline.png"/>
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern with a polyline shape.
 */
export declare function polyline(options: PolylinePatternOptions): Pattern;
/**
 * Creates a pattern with a rectangle shape.
 *
 * <p>Sample code snippet to make a non-filled rectangle:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_RECTANGLE1]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_rect.png" alt="PatternFactory.rectangle illustration"/>
 *
 * <p>Sample code snippet to make a filled rectangle</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_RECTANGLE2]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_filledRect.png" alt="Filled PatternFactory.rectangle illustration"/>
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern with a rectangle shape.
 */
export declare function rectangle(options: RectanglePatternOptions): Pattern;
/**
 * Creates a pattern that repeats a pattern a fixed number of times.
 *
 * <p>Note that with this pattern, there is no guarantee that the given number of
 * patterns is actually painted. This also depends on the line on which the complex stroke
 * is painted. For example, if the line is too short, not all the patterns may fit on it.
 * If one of the repeated patterns crosses a sharp corner, it may
 * be omitted as well. In that case, the {@link ComplexStrokedLineStyle.regular regular} or
 * {@link ComplexStrokedLineStyle.fallback fallback} patterns may be painted instead.</p>
 *
 * <p>In the following example, a circular stroke is repeated 3 times:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_REPEAT]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_repeat.png" alt="PatternFactory.repeat illustration"/>
 *
 * @param pattern The pattern to repeat. Cannot be null.
 * @param count The number of times to repeat the pattern. Must be greater than or equal to 1.
 * @return A pattern that repeats another pattern a fixed number of times
 */
export declare function repeat(pattern: Pattern, count: number): Pattern;
/**
 * Creates a pattern that repeats a pattern over a given length.
 *
 * <p>In the following example, a circular stroke is repeated over half the line:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_REPEAT_OVER_LENGTH]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_repeatOver.png" alt="PatternFactory.repeatOverLength illustration"/>
 *
 * @param pattern The pattern to repeat. Cannot be null.
 * @param length The length over which to repeat the pattern. <code>relative</code> determines what the unit of this length is.
 * @param relative If set to true, <code>length</code> is interpreted as a value ([0, 1]) relative to the length of
 *        the entire line. Otherwise, <code>length</code> is interpreted as a length in pixels. Defaults to false.
 * @return A pattern that repeats another pattern over a given length.
 */
export declare function repeatOverLength(pattern: Pattern, length: number, relative?: boolean): Pattern;
/**
 * Creates a pattern containing text.
 *
 * <p>This is demonstrated in the following sample code:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_TEXT]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_text.png" alt="PatternFactory.text illustration"/>
 *
 * Note that the following TextStyle properties, affecting the position of the text, are ignored:
 * <ul>
 *   <li>{@link TextStyle.alignmentBaseline alignmentBaseline}</li>
 *   <li>{@link TextStyle.textAnchor textAnchor}</li>
 *   <li>{@link TextStyle.offsetX offsetX}</li>
 *   <li>{@link TextStyle.offsetY offsetY}</li>
 * </ul>
 *
 * To offset text vertically, use <code>offset</code>.
 * To offset text horizontally, use {@link append} to insert a
 * {@link gap gap pattern} before the text pattern.
 *
 * @param options An object literal describing the configuration of the pattern.
 */
export declare function text(options: TextPatternOptions): Pattern;
/**
 * Creates a pattern with a triangle shape.
 *
 * <p>This is demonstrated in the following sample code:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_TRIANGLE1]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_triangle.png" alt="PatternFactory.triangle illustration"/>
 *
 * <p>The following snippet shows how to fill a triangle:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_TRIANGLE2]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_filledTriangle.png" alt="PatternFactory.filledTriangle illustration"/>
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern with a triangle shape.
 */
export declare function triangle(options: TrianglePatternOptions): Pattern;
/**
 * Creates a pattern with a wave shape.
 *
 * <p>This is demonstrated in the following sample code:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_WAVE1]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_wave.png"/>
 *
 * <p>The following snippet shows how to fill a wave:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_WAVE2]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_filledWave.png"/>
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern for a wave shape.
 */
export declare function wave(options: WavePatternOptions): Pattern;
/**
 * Creates a pattern containing an icon.
 * <p>This is demonstrated in the following sample code:</p>
 *
 * ```javascript
 * [[include:view/style/PatternFactorySnippets.ts_ICON]]
 * ```
 *
 * <p>Results in:</p>
 *
 * <img src="media://complexstroke/complexStroke_icon.png" alt="PatternFactory.icon illustration"/>
 *
 * To offset the icon vertically, use <code>offset</code>.
 * To offset the icon horizontally, use {@link append} to insert a {@link gap} before the icon pattern.
 *
 * @param options An object literal describing the configuration of the pattern.
 * @return A pattern containing an icon.
 */
export declare function icon(options: IconPatternOptions): Pattern;