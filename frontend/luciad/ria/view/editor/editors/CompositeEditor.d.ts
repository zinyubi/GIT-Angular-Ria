import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
/**
 * An {@link Editor} that delegates to a list of other editors.
 *
 * The first editor in the list of {@link delegates} that {@link canEdit can edit} the feature or shape, is used
 * to create handles.
 *
 * @since 2022.1
 */
export declare class CompositeEditor extends Editor {
  /**
   * Constructs a new CompositeEditor
   * @param delegates The list of {@link Editor editors} to delegate to
   */
  constructor(delegates: Editor[]);
  /**
   * Indicates which features/shapes this editor can edit.
   *
   * Returns true if there's an {@link Editor.canEdit can edit}.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Delegates the {@link saveState} call to the first delegate editor for which {@link canEdit} returns <code>true</code>.
   *
   * @since 2024.0
   */
  saveState(context: EditContext): any;
  /**
   * Delegates the {@link restoreState} call to the first delegate editor for which {@link canEdit} returns <code>true</code>.
   *
   * @since 2024.0
   */
  restoreState(savedState: any, context: EditContext): void;
  /**
   * Creates the handles that allow modifying the edited (or created) features's shape properties.
   *
   * The first editor in the list of {@link delegates} that {@link canEdit can edit} the feature or shape, is used
   * to {@link Editor.getEditHandles create edit handles}.
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates the shape translation handle.
   *
   * This is a handle that allows translation (moving) of an entire shape / feature.
   *
   * The first editor in the list of {@link delegates} that {@link canEdit can edit} the feature or shape, is used
   * to {@link Editor.createTranslateHandle create the translate handle}.
   */
  createTranslateHandle(context: EditContext): EditHandle | null;
  /**
   * Returns a handle that is used to create the given feature.
   *
   * The first editor in the list of {@link delegates} that {@link canEdit can edit} the feature or shape, is used
   * to return the {@link Editor.getCreateHandle create handle}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
  /**
   * The list of delegates used by this editor.
   *
   * You can set another list of delegates after construction, but it should not be set while creation
   * or editing is in progress (ie. while this editor is in use by a {@link CreateController}).
   */
  get delegates(): Editor[];
  set delegates(delegates: Editor[]);
}