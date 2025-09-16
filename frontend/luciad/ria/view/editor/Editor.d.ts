import { EditHandle } from "./EditHandle.js";
import { EditContext } from "../controller/EditContext.js";
/**
 * An Editor describes how features or shapes should be edited and created.
 *
 * It creates {@link EditHandle handles} that are used by the {@link EditController} to edit {@link Feature features}
 * and the {@link CreateController} to create new {@link Feature features}.
 *
 * Edit handles generally correspond to the shape of the feature being edited.
 * For example, to edit a four-sided polygon, an {@link Editor} might create five
 * handles: four to move each of the individual vertices of the polygon (see {@link getEditHandles}), and a fifth one to move
 * the polygon as a whole (see {@link createTranslateHandle}).
 *
 * For more information, check out the
 * <a href="articles://tutorial/view/controllers/custom_editing.html">Customizing creation and editing</a> guide.
 *
 * @see {@link EditHandle}
 * @see {@link EditController}
 * @see {@link CreateController}
 * @see {@link ShapeEditor}
 *
 * @since 2022.1
 */
export declare class Editor {
  /**
   * Creates a new Editor instance
   */
  constructor();
  /**
   * Indicates which features/shapes this editor can edit.
   *
   * The default implementation always returns <code>false</code>.
   *
   * @param context The context to check.
   *               It has references to the {@link FeatureLayer layer},
   *               {@link Feature feature} and {@link Shape shape} being edited.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a save state of the feature in the given context being edited.
   *
   * This save state is used to revert back to the initial state when editing is cancelled (ie. the controller deactivates without finishing) or restarted.
   * When editing is cancelled, {@link restoreState} is called to revert the {@link EditContext.feature edited feature}
   * back to its initial state.
   *
   * The default implementation saves a copy of the feature's shape.
   * If your editor / handles change other feature properties, you can override {@link saveState} and
   * {@link restoreState} to save and restore these additional properties as well.
   *
   * @param context The editing context.
   * @return The save state. By default, this is a copy of the feature's shape.
   *
   * @since 2024.0
   */
  saveState(context: EditContext): any;
  /**
   * Restores the {@link EditContext.feature feature} of the given context to a previously saved state.
   *
   * This applies the saved state that was created by {@link saveState} to the context's {@link EditContext.feature}.
   * It is used to revert back to the initial state when editing is cancelled (ie. the controller deactivates without finishing) or restarted.
   * When editing is cancelled, {@link restoreState} is called to revert the {@link EditContext.feature edited feature}
   * back to its initial state.
   *
   * The default implementation updates the {@link EditContext.feature feature}'s shape to the shape that was returned by the {@link saveState} method
   * If your editor / handles change other feature properties, you can override {@link saveState} and
   * {@link restoreState} to save and restore these additional properties as well.
   *
   * @param savedState The state that was saved, as returned by {@link saveState}.
   * @param context The editing context.
   *
   * @since 2024.0
   */
  restoreState(savedState: any, context: EditContext): void;
  /**
   * This method is called by {@link EditController} to retrieve the handles for editing.
   *
   * For example, point list translation/insertion/deletion handles, handles to modify a circles center and radius,...
   * By default, all editors include a {@link createTranslateHandle shape translation handle}.
   *
   * This is also used for creation, when the {@link CreateByTemplateHandle "create-by-template"} approach is used to
   * create new shapes.
   *
   * @param context The context to retrieve the handles for.
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates the shape translation handle.
   *
   * This is a handle that allows translation (moving) of an entire shape / feature.
   *
   * @param context The context to retrieve the shape translate handle for
   */
  createTranslateHandle(context: EditContext): EditHandle | null;
  /**
   * Returns a handle that is used to create the given object.
   *
   * @param context the edit context
   * @return an editing handle that is used to initialize the state of the object
   *         being created.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}