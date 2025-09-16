import { CompositeController } from "./CompositeController.js";
import { Controller } from "./Controller.js";
/**
 * Constructor options for {@link DefaultController}.
 *
 * The specified controllers are chained in a {@link CompositeController} in the following order:
 * <ul>
 *   <li>{@link selectController}</li>
 *   <li>{@link contextMenuController}</li>
 *   <li>{@link navigateController}</li>
 *   <li>{@link hoverController}</li>
 * </ul>
 *
 * Setting an option to <code>null</code> will disable that behavior.
 * If an option is not specified (<code>undefined</code>), a default controller is used.
 * Check the documentation of the individual options for details.
 *
 * @since 2024.0
 */
export interface DefaultControllerConstructorOptions {
  /**
   * The navigate controller to use.
   * Defaults to a {@link NavigateController}.
   * If <code>null</code>, navigation is disabled.
   */
  navigateController?: Controller | null;
  /**
   * The hover controller to use.
   * Defaults to a {@link HoverController}.
   * If <code>null</code>, hovering is disabled.
   */
  hoverController?: Controller | null;
  /**
   * The select controller to use.
   * Defaults to a {@link SelectController}.
   * If <code>null</code>, selection is disabled.
   */
  selectController?: Controller | null;
  /**
   * The context menu controller to use.
   * Defaults to a {@link ContextMenuController}.
   * If <code>null</code>, opening context menu's is disabled.
   */
  contextMenuController?: Controller | null;
}
/**
 * A controller that implements the default map behavior.
 *
 * See the
 * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * dev article for a description of the default map behavior.
 *
 * You can override parts of the default behavior by specifying a custom controller as a constructor option.
 * For example, to customize selection:
 * ```javascript
 * [[include:view/controller/SelectControllerSnippets.ts_CUSTOM_SELECT_CONTROLLER]]
 * ```
 *
 * @see {@link Map.defaultController}
 * @see {@link NavigateController}
 * @since 2024.0
 */
export declare class DefaultController extends CompositeController {
  constructor(options?: DefaultControllerConstructorOptions);
  /**
   * The select controller of this {@link DefaultController}.
   * If <code>null</code>, selection is disabled.
   * Defaults to a {@link SelectController}.
   */
  get selectController(): Controller | null;
  /**
   * The context menu controller of this {@link DefaultController}.
   * If <code>null</code>, opening context menu's is disabled.
   * Defaults to a {@link ContextMenuController}.
   */
  get contextMenuController(): Controller | null;
  /**
   * The navigate controller of this {@link DefaultController}.
   * If <code>null</code>, navigation is disabled.
   * Defaults to a {@link NavigateController}.
   */
  get navigateController(): Controller | null;
  /**
   * The hover controller of this {@link DefaultController}.
   * If <code>null</code>, hovering is disabled.
   * Defaults to a {@link HoverController}.
   */
  get hoverController(): Controller | null;
}