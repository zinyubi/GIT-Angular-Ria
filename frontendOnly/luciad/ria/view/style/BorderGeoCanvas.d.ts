import { Shape } from "../../shape/Shape.js";
import { BorderIconStyle } from "./BorderIconStyle.js";
import { TextStyle } from "./TextStyle.js";
/**
 * A high-level feature non-georeferenced rendering canvas. Instead of rendering to the non-georeferenced map (e.g. a vertical view),
 * shapes will be rendered to the border of a map , at a position which is perpendicular to the shape's position on the map.
 *
 * <p>
 * To enable painting, implement the paintBorderBody method on your {@link FeaturePainter}.
 * </p>
 * @since 2014.0
 */
export interface BorderGeoCanvas {
  /**
   * Draws an icon at the location specified by the focus point of the shape parameter using the giving styling parameters.
   * The anchor point of this icon will lie at the location of the shape parameter shifted by the offset vector.
   * If a rotation angle is provided, the center of rotation will be the anchor point.
   * @param shape the shape or X,Y pixel coordinates to define were to draw the icon
   * @param style an object containing styling properties
   */
  drawIcon(shape: Shape | [number, number], style: BorderIconStyle): void;
  /**
   * Draws the given text string at the location specified by the shape parameter or X,Y pixel coordinates.
   *
   * @param shape the shape or X,Y pixel coordinates to define were to draw the text
   * @param text the text string to draw
   * @param style an object containing styling properties for the text.
   */
  drawText(shape: Shape | [number, number], text: string, style: TextStyle): void;
}