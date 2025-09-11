import { LabelStyle } from "./LabelStyle.js";
import { PathLabelPosition } from "./PathLabelPosition.js";
import { PathLabelRotation } from "./PathLabelRotation.js";
import { OnPathLabelRepeatOptions } from "./OnPathLabelRepeatOptions.js";
/**
 * An object literal defining placement instructions for label positioning along a path
 * (e.g., along a line's path or along a polygon's boundary).
 *
 * Use constants from {@link PathLabelPosition} to set the position of a label.
 *
 * Use {@link OnPathLabelRepeatOptions} to set options for repeating labels along a path.
 * When this property is not provided, the label is placed at a single location.
 * LuciadRIA optimizes label positioning by assessing its visibility.
 * If the initial position leads to the label being outside the view or colliding with other elements as determined
 * by the decluttering algorithm, LuciadRIA will find an alternative position.
 */
export interface OnPathLabelStyle extends LabelStyle {
  /**
   * Determines positions for label placement with this style.
   * You can use any constant from {@link PathLabelPosition},
   * combine constants using a bitwise OR operation for multiple permissible positions,
   * or provide an array of constants. For example, <code>PathLabelPosition.BELOW | PathLabelPosition.ABOVE</code>
   * will permit both BELOW and ABOVE alignments for the label.
   * If an array is used, the order represents positioning priority.
   * If no positions are specified, the default position is CENTER.
   *
   * Note: The <code>perpendicularOffset</code> property takes precedence over the <code>positions</code> property.
   *
   * ```javascript
   * [[include:view/style/LabelStyleSnippets.ts_PATH_POSITION_LABEL_STYLE]]
   * ```
   */
  positions?: PathLabelPosition | PathLabelPosition[];
  /**
   * The label rotation setting for this label style.
   * Note that this parameter only affects on-path labeling!
   * This parameter is optional. The default is {@link PathLabelRotation.FIXED_LINE_ANGLE}.
   */
  rotation?: PathLabelRotation;
  /**
   * The object that controls how the label is repeated alongside the path.
   * If this property is missing a single label is placed along a path.
   */
  repeat?: OnPathLabelRepeatOptions;
  /**
   * Defines the perpendicular distance from the path at which a label will be placed. This distance is expressed in pixels.
   * If the value is positive, labels are placed above the path. Negative numbers mean that labels are placed below the path.
   * The <code>positions</code> property is disregarded when the <code>perpendicularOffset</code> property is a non-zero value.
   */
  perpendicularOffset?: number;
}