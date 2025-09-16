/**
 * An enumeration describing Selection Type
 */
export declare enum SelectionType {
  /**
   * Create a new selection, discarding the previous selected objects.
   */
  NEW = 0,
  /**
   * Add objects to the current selection.
   */
  ADD = 1,
  /**
   * Remove objects from the current selection.
   */
  REMOVE = 2,
  /**
   * If the objects are in the current selection, they are removed from it, if not, they are added
   * to the selection.
   */
  TOGGLE = 3,
}