/**
 * Enumerates possible text overlay coordinates
 * @since 2022.0
 */
export declare enum OverlayTextCoordinateType {
  /**
   * The coordinate at the center of the map
   */
  CENTER = 1,
  /**
   * The coordinate at the (center) top of the map.
   */
  TOP = 2,
  /**
   * The coordinate at the top right corner of the map.
   */
  TOP_RIGHT = 3,
  /**
   * The coordinate at the (center) right of the map.
   */
  RIGHT = 4,
  /**
   * The coordinate at the bottom right corner of the map.
   */
  BOTTOM_RIGHT = 5,
  /**
   * The coordinate at the (center) bottom of the map.
   */
  BOTTOM = 6,
  /**
   * The coordinate at the bottom left corner of the map.
   */
  BOTTOM_LEFT = 7,
  /**
   * The coordinate at the (center) left of the map.
   */
  LEFT = 8,
  /**
   * The coordinate at the top left corner of the map.
   */
  TOP_LEFT = 9,
  /**
   * The coordinate under the mouse cursor.
   */
  MOUSE_CURSOR = 10,
  /**
   * The (part of) the coordinate that is common for all (visible) points on the map.
   */
  COMMON_MAP_COORDINATE = 11,
}