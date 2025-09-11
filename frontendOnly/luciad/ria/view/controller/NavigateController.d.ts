import { CompositeController } from "./CompositeController.js";
import { Controller } from "./Controller.js";
/**
 * Constructor options for {@link NavigateController}.
 *
 * The specified controllers are chained in a {@link CompositeController} in the following order:
 * <ul>
 *   <li>{@link panController}</li>
 *   <li>{@link rotateController}</li>
 *   <li>{@link zoomController}</li>
 * </ul>
 *
 * @since 2024.0
 */
export interface NavigateControllerConstructorOptions {
  /**
   * The pan controller to use.
   * Defaults to a {@link PanController}.
   * If <code>null</code>, panning is disabled.
   */
  panController?: Controller | null;
  /**
   * The rotate controller to use.
   * Defaults to a {@link RotateController}.
   * If <code>null</code>, rotation is disabled.
   */
  rotateController?: Controller | null;
  /**
   * The zoom controller to use.
   * Defaults to a {@link ZoomController}.
   * If <code>null</code>, zooming is disabled.
   */
  zoomController?: Controller | null;
}
/**
 * A controller that implements the default map navigation.
 *
 * See the
 * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * dev article for a description of the default map behavior.
 *
 * You can override parts of the default navigation by specifying a custom controller as a constructor option.
 * For example, to customize panning:
 * ```javascript
 * [[include:view/controller/PanControllerSnippets.ts_CUSTOM_PAN_CONTROLLER]]
 * ```
 *
 * @since 2024.0
 */
export declare class NavigateController extends CompositeController {
  constructor(options?: NavigateControllerConstructorOptions);
  /**
   * The pan controller used by this {@link NavigateController}.
   * Defaults to a {@link PanController}.
   * If <code>null</code>, panning is disabled.
   */
  get panController(): Controller | null;
  /**
   * The rotate controller used by this {@link NavigateController}.
   * Defaults to a {@link RotateController}.
   * If <code>null</code>, rotation is disabled.
   */
  get rotateController(): Controller | null;
  /**
   * The zoom controller used by this {@link NavigateController}.
   * Defaults to a {@link ZoomController}.
   * If <code>null</code>, zooming is disabled.
   */
  get zoomController(): Controller | null;
}