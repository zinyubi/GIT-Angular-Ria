/**
 * An action that can be undone and redone.
 * For example, editing a shape (see the EditController's {@link EditController.on EditShape event}).
 *
 * You usually create {@link Undoable undoables} in response to an event from the API, and then add them to an
 * UndoManager.
 *
 * This example shows how to create Undoables in LuciadRIA:
 * ```javascript
 * [[include:core/util/SampleUndoSupport.ts_EDIT_SHAPE_UNDO]]
 * ```
 * You can find the full source, and more examples in <code>toolbox/ria/core/util/SampleUndoSupport.ts</code>.
 *
 * Common events are:
 * <ul>
 *   <li>The {@link Feature feature}.</li>
 *   <li>The {@link Feature feature}.</li>
 *   <li>The {@link Feature feature}.</li>
 *   <li>The {@link Feature feature}./li>
 * <ul>
 *
 * See the <a href="articles://guide/view/controllers/undoredo.html">Adding undo/redo support to your application</a> guide
 * for more information on how to work with undo/redo in LuciadRIA.
 *
 * @see {@link UndoManager}
 * @since 2022.1
 */
export declare abstract class Undoable {
  /**
   * Creates a new Undoable
   * @param id An id for the {@link Undoable}.
   *           This id is not used by the {@link UndoManager}, but it can be useful for differentiating between
   *           {@link Undoable undoables} in your application.
   * @param label A label for the {@link Undoable}. This can be a string you display directly in the UI, or a translation key.
   */
  constructor(id: string, label: string);
  /**
   * Undoes the operation represented by this Undoable
   */
  abstract undo(): void;
  /**
   * Redoes the operation represented by this Undoable
   */
  abstract redo(): void;
  /**
   * A label for the {@link Undoable}.
   * This can be a string you display directly in the UI, or a translation key.
   */
  get label(): string;
  /**
   * An id for the {@link Undoable}.
   * This id is not used by the {@link UndoManager}, but it can be useful for differentiating between
   * {@link Undoable undoables} in your application.
   */
  get id(): string;
}