/**
 * An enumeration of line types that can be used with the geodesy API.
 */
export declare enum LineType {
  /**
   * A line that follows the shortest path between the two points it connects, along the curvature of the globe.
   */
  SHORTEST_DISTANCE = 1,
  /**
   * A line that follows a constant bearing (angle).
   */
  CONSTANT_BEARING = 2,
}