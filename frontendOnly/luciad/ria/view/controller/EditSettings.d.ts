import { EditHandleStyles } from "../editor/EditHandleStyles.js";
import { GestureEvent } from "../input/GestureEvent.js";
import { EditContext } from "./EditContext.js";
/**
 * Settings configured on a {@link CreateController}.
 * These settings are passed from the controller, to the {@link EditHandle handles},
 * through {@link EditContext.settings}
 *
 * @see {@link EditController.getSettings}
 * @see {@link CreateController.getSettings}
 * @since 2022.1
 */
export interface EditSettings {
  /**
   * Styles used to draw editing handles and helper shapes.
   *
   * You can override {@link CreateController.getSettings}
   * to add more styles, which can be used in custom {@link EditHandle} implementations.
   */
  styles: EditHandleStyles;
  /**
   * Indicates whether to finish editing on a single-click event, or a double click event (the default).
   *
   * @see {@link EditControllerConstructorOptions.finishOnSingleClick}
   * @see {@link CreateControllerConstructorOptions.finishOnSingleClick}
   */
  finishOnSingleClick: boolean;
  /**
   * The minimum number of points that should be allowed during editing.
   * If no minimum is defined, this is 0.
   *
   * @see {@link EditController.getMinimumPointCount}
   * @see {@link EditController.setPointCount}
   * @see {@link CreateController.getMinimumPointCount}
   * @see {@link CreateController.setPointCount}
   * @see {@link PointListCreateHandleConstructorOptions.minimumPointCount}
   */
  minimumPointCount: number;
  /**
   * The maximum number of points that should be allowed during editing.
   * If no maximum is defined, this is -1.
   *
   * @see {@link EditController.getMaximumPointCount}
   * @see {@link EditController.setPointCount}
   * @see {@link CreateController.getMaximumPointCount}
   * @see {@link CreateController.setPointCount}
   * @see {@link PointListCreateHandleConstructorOptions.maximumPointCount}
   */
  maximumPointCount: number;
  /**
   * Indicates whether to allow drawing shapes in "freehand" mode. When this is enabled,
   * the user can click / tap near the last created point and drag to draw a shape.
   * Multiple points will be inserted while the mouse is being dragged.
   *
   * When this is disabled, the user can only create (single) points by clicking / tapping the map.
   *
   * @see {@link CreateControllerConstructorOptions.freehand}
   * @see {@link PointListCreateHandleConstructorOptions.freehand}
   */
  freehand: boolean;
  /**
   * The mouse interaction radius to use, in pixels.
   *
   * This is the radius used for mouse events, to determine interaction with handles.
   *
   * @see {@link EditControllerConstructorOptions.mouseInteractionRadius}
   * @see {@link CreateControllerConstructorOptions.mouseInteractionRadius}
   * @see {@link interactsWithControllerShape}
   */
  mouseInteractionRadius: number;
  /**
   * The touch interaction radius to use, in pixels.
   *
   * This is the radius used for touch events, to determine interaction with handles.
   * Typically, this is larger than the {@link mouseInteractionRadius}.
   *
   * @see {@link EditControllerConstructorOptions.touchInteractionRadius}
   * @see {@link CreateControllerConstructorOptions.touchInteractionRadius}
   * @see {@link interactsWithControllerShape}
   */
  touchInteractionRadius: number;
}
/**
 * Returns the interaction radius of a {@link GestureEvent}.
 *
 * If it's a touch event, it returns {@link EditSettings.touchInteractionRadius}.
 * If it's a mouse event, it returns {@link EditSettings.mouseInteractionRadius}.
 * This is typically used with {@link interactsWithControllerShape}.
 *
 * @param event The event to determine an interaction radius for.
 * @param context The edit context
 * @since 2022.1
 */
export declare function getInteractionRadius(event: GestureEvent, context: EditContext): number;