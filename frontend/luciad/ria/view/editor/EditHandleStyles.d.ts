import { ShapeStyle } from "../style/ShapeStyle.js";
import { IconStyle } from "../style/IconStyle.js";
/**
 * The styles used for drawing handle icons and helper shapes.
 *
 * @see {@link EditControllerConstructorOptions.handleIconStyle}
 * @see {@link EditControllerConstructorOptions.helperStyle}
 * @see {@link CreateControllerConstructorOptions.handleIconStyle}
 * @see {@link CreateControllerConstructorOptions.helperStyle}
 *
 * @since 2022.1
 */
export interface EditHandleStyles {
  /**
   * The style used to draw "helper" shapes.
   * Typically, these are shapes that are not interactive, but help the user edit or create the shape.
   *
   * An example is a "helper" base shape that's drawn when editing an extruded shape, or the full circle
   * that's drawn when editing a circular arc.
   *
   * @see {@link EditControllerConstructorOptions.helperStyle}
   * @see {@link CreateControllerConstructorOptions.helperStyle}
   */
  helperStyle: ShapeStyle;
  /**
   * The icon style used to draw point handles.
   *
   * @see {@link EditControllerConstructorOptions.handleIconStyle}
   * @see {@link CreateControllerConstructorOptions.handleIconStyle}
   */
  handleIconStyle: IconStyle;
}