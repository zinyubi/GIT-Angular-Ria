import { Shape } from "../../shape/Shape.js";
import { PointLabelStyle } from "./PointLabelStyle.js";
/**
 * A high-level canvas to draw text labels in the border of a map.
 * To enable painting, implement the paintBorderLabel method on your {@link FeaturePainter}.
 *
 * @since 2014.0
 */
export interface BorderLabelCanvas {
  /**
   * Draw a HTML label at the specified position. The html should be a text-string and
   * should not contain dynamic content.
   * @param html The HTML to place on the map. It may contain HTML markup and CSS styling
   *                      properties.
   * @param shape The shape for which the label should be drawn.
   * @param labelStyle An object containing labeling properties.
   *                                                       Note that the <code>padding</code>
   *                                                       property is not supported. Use CSS padding
   *                                                       and margin properties to simulate padding.
   */
  drawLabel(html: string, shape: Shape, labelStyle: PointLabelStyle): void;
}