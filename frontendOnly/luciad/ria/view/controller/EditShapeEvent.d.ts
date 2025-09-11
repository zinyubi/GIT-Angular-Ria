import { Shape } from "../../shape/Shape.js";
/**
 * Describes the status of a shape edit.
 * @since 2022.1
 */
export declare enum EditShapeStatus {
  /**
   * Indicates that a shape edit is in progress.
   * For example, the user is still dragging an edit handle.
   */
  IN_PROGRESS = "in_progress",
  /**
   * Indicates that a shape edit has finished.
   * For example, the user has stopped dragging an edit handle.
   */
  FINISHED = "finished",
}
/**
 * Describes a shape change event, for example a change during creation or editing of a shape.
 * @see {@link EditController.on}
 * @see {@link CreateController.on}
 * @since 2022.1
 */
export interface EditShapeEvent {
  /**
   * The status of the shape edit.
   */
  status: EditShapeStatus;
  /**
   * The edited shape.
   */
  shape: Shape;
}