import { UnitOfMeasure } from "../../uom/UnitOfMeasure.js";
/**
 * A <code>BorderStyle</code> describes how the inner or outer border of a closed shape is rendered.
 *
 * <p> Borders are rendered only for closed shapes, for instance: polygon, circle, ellipse, buffer, arc band.
 * Non-closed shapes, such as polylines, points, or arcs, are painted without border.
 * Extruded shapes are visualized with borders only on 2D maps.</p>
 *
 * <p> The inner border stroke is drawn on the inner side of shape and the outer border stroke is drawn on the outer side of shape.
 * If shape style is defined with the fill, stroke, inner and outer border style then the borders are drawn
 * after rendering the fill style and before rendering the stroke style.</p>
 *
 * <p><img src="media://feature/borderPainter.png" alt="Border Painter" width="400px"/></p>
 *
 * @since 2019.0
 * ```javascript
 * // ShapeStyle object literal that uses Border style to draw inner and outer border
 * var style = {
 *   innerBorder: {
 *     color: "rgba(12, 2, 110, 0.25)",
 *     width: 12
 *   },
 *   outerBorder: {
 *     color: "rgba(12, 2, 110, 0.5)",
 *     width: 3
 *   },
 *   stroke: { width: 2 }
 * };
 * ```
 */
export interface BorderStyle {
  /**
   * The CSS color string of the border.
   */
  color: string;
  /**
   * The width of the border.
   */
  width: number;
  /**
   * <p>The <code>uom</code> determines the interpretation of the <code>width</code> as pixels or as a ground unit that
   *  represents  the actual size of real-world objects, like for example meter of foot.</p>
   * <p>Supported UnitOfMeasures are:
   *  <ul>
   *   <li><code>UnitOfMeasureRegistry.getUnitOfMeasure("Pixels")</code></li>
   *   <li><code>UnitOfMeasure of type QuantityKindRegistry.getQuantityKind("Length")</code></li>
   *  </ul>
   * </p>
   * <p>
   *  The <code>uom</code> property is only taken into account on geographically referenced maps.
   * </p>
   * <p>The property is optional and the default value is the Pixel unit.</p>
   */
  uom?: UnitOfMeasure;
}