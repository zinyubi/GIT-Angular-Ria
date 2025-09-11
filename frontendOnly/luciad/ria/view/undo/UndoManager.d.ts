import { Handle } from "../../util/Evented.js";
import { Undoable } from "./Undoable.js";
/**
 * A manager of {@link Undoable}s.
 *
 * You can {@link Undoable undoables}
 * that you can {@link undo} or {@link redo}.
 *
 * You can wire a keyboard shortcut, like CTRL+Z to undo, as follows:
 * ```javascript
 * [[include:core/util/SampleUndoSupport.ts_UNDO_REDO_KEYS]]
 * ```
 *
 * You usually create {@link Undoable undoables} in response to an event from the API, and then add them to an
 * UndoManager. You can find a list of common events in {@link Undoable}.
 *
 * This example shows how to create Undoables in LuciadRIA:
 *```javascript
 * [[include:core/util/SampleUndoSupport.ts_EDIT_SHAPE_UNDO]]
 * ```
 * You can find the full source, and more examples, in <code>toolbox/ria/core/util/SampleUndoSupport.ts</code>.
 *
 * See the <a href="articles://guide/view/controllers/undoredo.html">Adding undo/redo support to your application</a> guide
 * for more information on how to work with undo/redo in LuciadRIA.
 *
 * @see {@link Undoable}
 * @since 2022.1
 */
export declare class UndoManager {
  /**
   * Creates a new UndoManager instance
   * @param limit The maximum amount of {@link Undoable} this manager should track on its {@link undoStack}. Defaults to 10.
   */
  constructor(limit?: number);
  /**
   * Indicates if this UndoManager can {@link undo}.
   *
   * An UndoManager can undo when there is at least 1 {@link Undoable} on the {@link undoStack}.
   */
  canUndo(): boolean;
  /**
   * Undoes the last {@link Undoable} on the {@link undoStack}.
   * This {@link Undoable} then moves to the {@link redoStack}.
   * If an error is thrown in {@link UndoManager.undo}.
   * The {@link Undoable} still moves to the {@link redoStack}.
   */
  undo(): void;
  /**
   * Indicates if this UndoManager can {@link redo}.
   *
   * An UndoManager can redo when there is at least 1 {@link Undoable} on the {@link redoStack}.
   */
  canRedo(): boolean;
  /**
   * Redoes the last {@link Undoable} on the {@link redoStack}.
   * This {@link Undoable} then moves to the {@link undoStack}.
   * If an error is thrown in {@link UndoManager.redo}.
   * The {@link Undoable} still moves to the {@link undoStack}.
   */
  redo(): void;
  /**
   * Pushes a new item on the {@link undoStack}.
   * This discards all {@link Undoable Undoables} on the {@link redoStack}.
   *
   * If there are more {@link Undoable}
   * on the stack is removed.
   *
   * @param undoable The item to add to the {@link undoStack}
   */
  push(undoable: Undoable): void;
  /**
   * Returns the current limit of the {@link UndoManager}
   */
  get limit(): number;
  /**
   * Sets the limit of the {@link UndoManager}.
   *
   * This limits the size of the {@link undoStack}. If the size of the {@link undoStack} exceeds the limit,
   * the oldest {@link Undoable Undoables} on the stack are removed.
   *
   * If the new limit is lower than the old limit, the oldest items on the {@link undoStack} will be discarded,
   * without applying them.
   * @param limit The new limit. Must be strictly positive.
   */
  set limit(limit: number);
  /**
   * Returns a copy of the undo stack.
   * The upcoming undoable is the last element in the array.
   *
   * You can use this stack to show one or more upcoming undoables, for example in a drop-down box of an undo button.
   */
  get undoStack(): Undoable[];
  /**
   * Returns a copy of the redo stack.
   * The upcoming undoable is the last element in the array.
   *
   * You can use this stack to show one or more upcoming undoables, for example in a drop-down box of a redo button.
   */
  get redoStack(): Undoable[];
  /**
   * Resets the UndoManager.
   * This empties the {@link Undoable}s;
   */
  reset(): void;
  /**
   * An event that fires whenever the {@link undoStack} of this UndoManager changes.
   * @event UndoStackChanged
   */
  on(event: "UndoStackChanged", callback: () => void): Handle;
  /**
   * An event that fires whenever the {@link redoStack} of this UndoManager changes.
   * @event RedoStackChanged
   */
  on(event: "RedoStackChanged", callback: () => void): Handle;
  /**
   * An event that fires whenever the {@link limit} of this UndoManager changes.
   * @event LimitChanged
   */
  on(event: "LimitChanged", callback: () => void): Handle;
}