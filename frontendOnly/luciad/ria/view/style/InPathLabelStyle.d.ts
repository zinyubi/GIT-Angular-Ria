import { LabelStyle } from "./LabelStyle.js";
/**
 * This describes the general interface for an InPathLabel style object.
 * <p/>
 * An object literal containing placement instructions for label placement inside a closed shape (for example, a Polygon).
 */
export interface InPathLabelStyle extends LabelStyle {
  /**
   * The flag to indicate if the label location should be recalculated to remain in the view
   * if its shape is partially visible. By default, the flag is enabled.
   * <p><b>NOTE:</b> This flag is not supported in a hardware-accelerated map.</p>
   */
  inView?: boolean;
  /**
   * The flag that indicates if the label should be painted outside the bounds of its painted shape.
   * When the value is "true" then the label is painted only if it is inside the painted shape's bounds.
   * By default, the flag is disabled, which means this restriction is not applied.
   * <p><b>NOTE:</b> This flag is not supported in a hardware-accelerated map.</p>
   *
   * @since 2017.1
   */
  restrictToBounds?: boolean;
}