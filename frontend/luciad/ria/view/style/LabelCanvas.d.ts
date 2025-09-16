import { Shape } from "../../shape/Shape.js";
import { InPathLabelStyle } from "./InPathLabelStyle.js";
import { OnPathLabelStyle } from "./OnPathLabelStyle.js";
import { PointLabelStyle } from "./PointLabelStyle.js";
/**
 * <p>A high-level canvas to draw text labels on a map. To enable painting, implement the paintLabel method on your {@link FeaturePainter}.
 * Within this method, you can make one or more draw* calls on the LabelCanvas. Each such call will attempt to place
 * a label on screen. However, this does not necessarily mean that every label will be visible on screen.
 * Visibility of a label depends on styling properties such as label-priority, label-grouping and whether you want
 * to avoid overlapping labels by the de-cluttering mechanism.
 * </p>
 * <p>In a 3D scene, the label placement procedure hides labels when the label's shape,
 * the shape that is used by the label command, is obscured by other objects.
 * Although, if the corresponding shape's body is painted with the {@link OcclusionMode.ALWAYS_VISIBLE}
 * or {@link OcclusionMode.OCCLUDED_ONLY} style, then the label stays visible too.
 * </p>
 * <p>For more information on the behaviour of label placement, please refer to {@link LabelStyle}.</p>
 */
export interface LabelCanvas {
  /**
   * Draw a HTML label on the map at the specified position. The html should be a text-string and
   * should not contain dynamic content.
   *
   * @param html The HTML to place on the map. It may contain HTML markup and CSS styling properties.
   * @param shape The shape for which the label should be drawn.
   * @param labelStyle An object containing labeling properties.
   *        Note that the <code>padding</code> property is not supported. Use CSS padding
   *        and margin properties to simulate padding.
   */
  drawLabel(html: string | HTMLElement, shape: Shape, labelStyle: PointLabelStyle): void;
  /**
   * Draw a HTML label on the map inside the shape. The html should be a text-string and should
   * not contain dynamic content.
   *
   * @param html The HTML to place on the map. It may contain HTML markup and CSS styling
   *                      properties.
   * @param shape The shape along which the label should be drawn.
   * @param labelStyle an object containing labeling properties.
   */
  drawLabelInPath(html: string | HTMLElement, shape: Shape, labelStyle: InPathLabelStyle): void;
  /**
   * Draw a HTML label on the map along the specified shape. The html should be a text-string and
   * should not contain dynamic content.
   *
   * @param html The HTML to place on the map. It may contain HTML markup and CSS styling properties.
   * @param shape The shape in which to place the label.
   * @param labelStyle an object containing labeling properties.
   */
  drawLabelOnPath(html: string | HTMLElement, shape: Shape, labelStyle: OnPathLabelStyle): void;
}