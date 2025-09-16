/**
 * A style that can be used to stroke the outline of a shape with complex patterns.
 *
 * <p>See the
 * <a href="articles://tutorial/featurepainting/complex_strokes/complexstroking.html">
 * step-by-step guide to complex strokes</a>
 * for more information.
 * </p>
 *
 * <p>A complex stroked line style can be used on {@link ShapeStyle.stroke ShapeStyle.stroke},
 * instead of a {@link LineStyle}.</p>
 *
 * <p>
 * It is composed of a series of {@link Pattern} instances,
 * which are repeated along the line as a {@link ComplexStrokedLineStyle.fallback} pattern,
 * or which are positioned once at a specific location as {@link ComplexStrokedLineStyle.decorations decorations}.
 * </p>
 *
 * <p>
 * A complex stroked line style is a combination of 3 layers of patterns:
 * <ul>
 *  <li><b>{@link Pattern} instances
 *    that are painted  <i>once</i> at a specific position along the line.
 *    For example, an arrow at the start or end of a line or some text in the middle of the line.
 *  </li>
 *  <li><b>{@link Pattern} that is
 *    repeated infinitely along the line. For example, a dash or wave pattern.
 *  </li>
 *  <li><b>{@link Pattern} that is
 *    drawn if there is not enough room to draw {@link ComplexStrokedLineStyle.decorations decorations} or the {@link ComplexStrokedLineStyle.regular regular} pattern.
 *    This pattern is usually kept as simple as possible, for example a simple
 *    {@link parallelLine PatternFactory.parallelLine()} or a
 *    simple dash pattern.
 *  </li>
 * </ul>
 * </p>
 *
 * <b>Differences in complex stroked lines on a WebGLMap and a non-WebGLMap</b>
 * <ul>
 *  <li>On non-WebGL Maps, some complex stroked lines do not follow the curvature of the line as nicely
 *    as on WebGLMaps (for example, a squared pattern on a circle).
 *  </li>
 *  <li>{@link ComplexStrokedLineStyle.sharpAngleThreshold sharpAngleThreshold}
 *    is not supported on a non-WebGLMap.
 *  </li>
 *  <li>
 *    Complex strokes with a {@link ComplexStrokedLineStyle.uom world size} will be missing certain pattern aspects when used on a non-WebGL map.
 *  </li>
 * </ul>
 *
 * <h3>Limitations</h3>
 *
 * <b>Shader compilation in WebGL</b>
 * <p>
 *  When using a WebGLMap, keep in mind that every unique ComplexStrokedLineStyle results in new GPU shaders being compiled.
 *  If you use a lot of different ComplexStrokedLineStyle's in your application, it might take a while before
 *  all shaders are compiled. The more complex the style is, the longer the compilation will take.
 *  Once a shader is compiled, it is re-used across multiple {@link GeoCanvas.drawShape} calls.
 *  Re-submitting the same style multiple times, does not trigger a re-compilation.
 * </p>
 *
 * <b>Pattern size and line width in 3D</b>
 * <p>
 *   Due to the nature of the perspective camera in 3D and varying scale along lines, you can expect certain deformations of your pattern and/or line width
 *   when looking at the line at certain angles.  LuciadRIA tries to keep these at a minimum, but if your camera is roughly parallel with your line, you might notice these effects:
 *   <ul>
 *     <li>Your pattern is squeezed or stretched along the line.</li>
 *     <li>Your line width is smaller or wider than usual.</li>
 *   </ul>
 * </p>
 *
 * <b>Internet Explorer</b>
 * <p>
 *   The usage of complex stroked lines on a WebGLMap is prone to break on Internet Explorer.
 *   LuciadRIA generates GPU shaders based on the ComplexStrokedLineStyle.
 *   If these shaders become too complex for Internet Explorer to handle
 *   (too large or too much branching), the browser can become unresponsive.
 *   Because of those known issues, we do not recommend using complex stroked lines on a WebGLMap in Internet Explorer.
 *   As an alternative, you can use a non-WebGLMap or a simple {@link LineStyle}
 *   in Internet Explorer.
 * </p>
 *
 * <b>rotateUp in WebGL</b>
 * <p>
 *   {@link text PatternFactory.text} and
 *   {@link icon PatternFactory.icon} have a 'rotateUp' option.
 *   This option guarantees that the text or icon is always rotated upwards. This increases legibility of the text or icon.
 *   The device running the application, needs to support float textures for this option to work on a WebGLMap.
 *   If the device does not support float textures, this option is ignored, and the text/icon will not be rotated up.
 *   To check if float textures are supported, open the "device support" sample on the device.
 *   <code>rotateUp</code> will always work on a non-WebGL Map.
 * </p>
 *
 * @since 2018.1
 * @packageDocumentation
 */
/**
 *
 */
import { UnitOfMeasure } from "../../../uom/UnitOfMeasure.js";
import { Decoration } from "./Decoration.js";
import { Pattern } from "./Pattern.js";
import { BloomStyle } from "../BloomStyle.js";
export interface ComplexStrokedLineStyle {
  /**
   * The decorations to be painted along the line.
   *
   * <p>
   * A decoration is a {@link Pattern} that is painted once
   * at a specific position along the line.
   * </p>
   *
   * <p>
   * This property is optional. If it is omitted, no decorations will be painted along the line.
   * </p>
   *
   */
  decorations?: Decoration[];
  /**
   * The pattern that is repeated along the line. A {@link regular} pattern is painted where no
   * {@link decorations decoration} is painted, because decorations have priority over the regular pattern.
   *
   * <p>
   * If there is not enough space to place the {@link regular} pattern, the {@link fallback} pattern
   * is painted.
   * </p>
   *
   * <p>
   * Some patterns influence whether the fallback pattern is painted or not, and
   * where it is painted. For more information, see the
   * {@link combineWithFallback} and
   * {@link combineWithRegular}
   * pattern wrappers.
   * </p>
   *
   * @see {@link combineWithRegular combineWithRegular}
   */
  regular?: Pattern | null;
  /**
   * The pattern that is painted if no {@link decorations decoration} or {@link regular} pattern
   * can be painted. This can happen if a line is too curved, or if there is not enough space to paint the
   * {@link regular} pattern.
   *
   * <p>
   * Some patterns influence whether the fallback pattern is painted or not, and
   * where it is painted. For more information, see the
   * {@link combineWithFallback} and
   * {@link combineWithRegular}
   * pattern wrappers.
   * </p>
   *
   * @see {@link combineWithFallback combineWithFallback}
   * @see {@link combineWithRegular combineWithRegular}
   */
  fallback?: Pattern;
  /**
   * The threshold that is used to determine if angles are sharp or not. It is interpreted as an angle in
   * degrees between two line segments. In the context of complex stroking, sharp corners are handled differently
   * than non-sharp corners.
   *
   * <p>In general, a non-sharp corner is handled as if there were no corner at all. This means that any stroke can just
   * be painted along the corner. As a side-effect, strokes may be deformed. This deformation will be small
   * for corners that are close to 180 degrees wide, meaning for line segments that are almost parallel. The deformation
   * can become quite large for sharper corners though, so take care when you adjust this value.</p>
   *
   * <p>On the other hand, when a corner is considered sharp, strokes will not be deformed, but they may be dropped
   * instead.</p>
   *
   * <p>This setting is useful when complex strokes use a uniform shape and color, for example.
   * When you are painting an airspace border using a rectangular stroke along the length of the line, you can set
   * the threshold to 0, for instance.</p>
   *
   * <p>The value should always be in the <code>[0, 180]</code> degrees range.
   * The default value is <code>155</code> degrees.</p>
   *
   * <p>Note that this setting <b>is only supported on a {@link WebGLMap}</b>.
   * On a non-WebGLMap, this threshold is ignored.
   *
   * @default 155
   */
  sharpAngleThreshold?: number;
  /**
   * Adds a {@link BloomEffect} to the complex stroked line.
   *
   * Bloom is only supported on WebGL maps.
   *
   * @since 2022.1
   */
  bloom?: BloomStyle;
  /**
   * <p>Determines the interpretation of units for style properties that express sizes.
   *  Supported UnitOfMeasures are:
   *  <ul>
   *   <li><code>UnitOfMeasureRegistry.getUnitOfMeasure("Pixels")</code></li>
   *   <li><code>UnitOfMeasure of type QuantityKindRegistry.getQuantityKind("Length")</code>, for example UnitOfMeasureRegistry.getUnitOfMeasure("Meter")</li>
   *  </ul>
   * </p>
   * <p>
   *  The unit of measure applies to the <code>width</code> and <code>size</code> properties of the pattern and decorations.
   *  The <code>uom</code> determines the interpretation of the values as pixels or as a ground unit that represents
   *  the actual size of real-world objects, like for example meter or foot.
   * </p>
   * <p>
   *  The <code>uom</code> property is only supported on geographically referenced maps.
   *  Maps configured with {@link createCartesianReference cartesian reference} do
   *  not support <code>LineStyle</code>s with a <code>uom</code> set.
   * </p>
   * <p>The property is optional and the default value is the Pixel unit.</p>
   * <p>
   *   Limitation: complex strokes with a world size will be missing certain pattern aspects when used on a non-WebGL map.
   * </p>
   *
   * @default undefined, interpreted as pixels
   * @since 2023.0
   */
  uom?: UnitOfMeasure;
}