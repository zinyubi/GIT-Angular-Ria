import { PinEndPosition } from "./PinEndPosition.js";
/**
 * This describes the general interface for a pin style object
 * <p/>
 * An object literal containing placement instructions for point-based labels.
 * All properties are optional.
 * <p/>
 *
 * <p>
 * A pin is a connecting line between the label and the anchor point of the label.
 * If the position of the label changes, so will the pin change position as well.
 * </p>
 *
 */
interface PinStyle {
  /**
   * The color of the pin. It must be a valid CSS color string.
   */
  color?: string;
  /**
   * The location of where the pin should attach to the label.
   */
  endPosition?: PinEndPosition;
  /**
   * The color of the halo. It must be a valid CSS color string.
   */
  haloColor?: string;
  /**
   * The width of the halo in pixels.
   */
  haloWidth?: number;
  /**
   * The width of the pin in pixels.
   */
  width?: number;
}
export { PinStyle };