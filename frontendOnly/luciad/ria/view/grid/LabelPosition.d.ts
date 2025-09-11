/**
 * An enumeration describing label positions for a grid. All positions are indicative, since label placement is
 * also affected by other factors (such as available screen space or presence of other labels).
 */
export declare enum LabelPosition {
  /**
   * "AUTO" LayerType. A default labeling for a grid line. The first available labeling position will be used.
   */
  AUTO = "AUTO",
  /**
   * "ALL_SIDES". A label is placed on both ends of the line.
   */
  ALL_SIDES = "ALL_SIDES",
}