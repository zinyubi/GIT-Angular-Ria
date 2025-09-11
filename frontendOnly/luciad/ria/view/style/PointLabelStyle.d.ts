import { LabelStyle } from "./LabelStyle.js";
import { PinStyle } from "./PinStyle.js";
import { PointLabelPosition } from "./PointLabelPosition.js";
/**
 * This describes the general interface for a PointLabel style object.
 * <p/>
 * An object literal containing placement instructions for point-based labels.
 * All properties are optional.
 */
export interface PointLabelStyle extends LabelStyle {
  /**
   * The amount by which the label should be offset with respect to its anchor location. This value
   * describes the length in pixels of the vector that is added to the anchor location. If the given
   * value is a number, then the label will be offset in the direction of the positioning. If an
   * array of two numbers is given, then the label will be offset on each axis individually. The
   * latter is not dependent on the position. Example: offset [5,3] will move the label 5 pixels to
   * the right, and 3 pixels down.
   */
  offset?: number | number[];
  /**
   * The pin style of the label. Leave this undefined if no pin should be added.
   */
  pin?: PinStyle;
  /**
   * Defines the permitted positions when painting labels with this style.
   * This can be any of the constant values defined from {@link PointLabelPosition}, or in case multiple
   * positions are allowed a bitwise OR of these values or an array of them.
   * If it is an array, the ordering represents the priority.
   * For example the code below will allow the label to be positioned using either a NORTH or a SOUTH alignment.
   *
   * ```javascript
   * [[include:view/style/LabelStyleSnippets.ts_POINT_POSITION_LABEL_STYLE]]
   * ```
   */
  positions?: PointLabelPosition | PointLabelPosition[];
}