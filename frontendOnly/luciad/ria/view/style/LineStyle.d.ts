import { LineMarker } from "./LineMarker.js";
import { UnitOfMeasure } from "../../uom/UnitOfMeasure.js";
import { BloomStyle } from "./BloomStyle.js";
/**
 * A <code>LineStyle</code> describes how the outline of an object should be rendered.
 * <p/>
 * A <code>LineStyle</code> is typically embedded into a {@link ShapeStyle}.
 * <p/>
 * Example of how to use a simple line style for painting:
 *
 * ```javascript
 * var shapeStyle = {
 *            stroke: {
 *             color: "rgb(100, 170, 220)",
 *             width: 4 // pixels
 *            }
 *           };
 * geoCanvas.drawShape(shape, shapeStyle);
 * ```
 */
export interface LineStyle {
  /**
   * <p>Adds a marker at the beginning of a line. This property is optional.</p>
   *
   * <p>Lines with a begin marker use complex stroking under the hood. Because complex strokes are always
   * draped on 3D maps, that means a line with this option will always be draped as well.</p>
   */
  beginMarker?: LineMarker;
  /**
   * <p>The stroke color as a CSS color string. For example <code>"rgb(125, 125, 125)"</code> or
   * <code>"rgba(125, 125, 125, 0.5)"</code>.</p>
   */
  color?: string;
  /**
   * <p>The dashing pattern of the stroke. A dashing pattern is an array that defines
   * the dash lengths and gap lengths of the dashing pattern.  Elements at even positions
   * in the array are dash lengths, elements at odd positions are gap lengths.  A length is a
   * positive number.  The array should contain an even number of elements. if not, the configured
   * dashing pattern will be concatenated twice to obtain an array with an even number of elements.</p>
   *
   * <p>For example, a dashing pattern of [10,5,6,5] will result of a dash of 10 units, followed
   * by a gap of five units followed by a dash of 6 units, followed by a gap of 5 units.  This
   * pattern will be repeated over the length of the line.
   * The unit of measure is identified by the <code>uom</code> property.</p>
   *
   * <p>Dashed lines use complex stroking under the hood. Because complex strokes are always
   * draped on 3D maps, that means a line with this option will always be draped as well.</p>
   */
  dash?: number[];
  /**
   * <p>The dash offset defines at what point in the dashing pattern to start the stroke.  The dash offset
   * is a number that points to a location in the dashing pattern, expressed in a particular unit of measure (see <code>uom</code>),
   * 0 being the beginning of the pattern.
   * That location defines the point in the dashing pattern that will correspond to the beginning of the line
   * being rendered.</p>
   *
   * <p>For example, with a dashing pattern of [10, 5] and a dash offset of 7, a line will start with
   * a dash of 3 units, a gap of 5 units, followed by a dash of 10 units, and so on.
   * The unit of measure is identified by the <code>uom</code> property.</p>
   *
   * <p>Dashed lines use complex stroking under the hood. Because complex strokes are always
   * draped on 3D maps, that means a line with this option will always be draped as well.</p>
   */
  dashOffset?: number;
  /**
   * <p>Adds a marker at the end of a line.  This property is optional.</p>
   *
   * <p>Lines with an end marker use complex stroking under the hood. Because complex strokes are always
   * draped on 3D maps, that means a line with this option will always be draped as well.</p>
   */
  endMarker?: LineMarker;
  /**
   * <p>The width of the stroke determines how thick the line will be drawn.</p>
   */
  width?: number;
  /**
   * Adds a {@link BloomEffect} to the line.
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
   *  The unit of measure applies to the <code>width</code>, <code>dash</code>, <code>dashoffset</code> and
   *  line markers' <code>size</code> properties.
   *  The <code>uom</code> determines the interpretation of the values as pixels or as a ground unit that represents
   *  the actual size of real-world objects, like for example meter or foot.
   * </p>
   * <p>
   *  The <code>uom</code> property is only supported on geographically referenced maps.
   *  Maps configured with {@link createCartesianReference cartesian reference} do
   *  not support <code>LineStyle</code>s with a <code>uom</code> set.
   * </p>
   * <p>The property is optional and the default value is the Pixel unit.</p>
   * Example of a line style with a width in meters and an arrow at the start:
   *
   * ```javascript
   * var shapeStyle = {
   *          stroke: {
   *           color: "rgb(100, 170, 220)",
   *           width: 40,
   *           uom: UnitOfMeasureRegistry.getUnitOfMeasure("Meter"),
   *           beginMarker: {
   *            size: 100,
   *            type: LineMarkerType.ARROW
   *           }
   *          }
   *        };
   * geoCanvas.drawShape(shape, shapeStyle);
   * ```
   *
   * @since 2019.0
   */
  uom?: UnitOfMeasure;
}