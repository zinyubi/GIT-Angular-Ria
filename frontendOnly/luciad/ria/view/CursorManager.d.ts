import { Handle } from "../util/Evented.js";
/**
 * A handle returned by {@link CursorManager.addCursor}.
 * @since 2022.1
 */
export declare class CursorHandle implements Handle {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * Returns the CSS <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">cursor</a> for this handle,
   * as it was passed in {@link CursorManager.addCursor}.
   */
  get cursor(): string;
  /**
   * Removes this handle from the {@link CursorManager}.
   */
  remove(): void;
}
/**
 * The CursorManager allows to change the cursor displayed on a DOM node.
 *
 * It addresses the problem of multiple clients changing the
 * <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">cursor</a> style of an element, overriding the
 * visual feedback. The cursor manager maintains a stack of cursors, so an old cursor can be restored when a newer one becomes inactive.
 *
 * For example, a spinning icon indicates a layer that's loading.
 * Then an editor changes it to a crosshair, overriding the spinning icon.
 * When the crosshair is removed by the editor, the manager will revert to the spinning icon.
 * Without the manager, the map's cursor would not be able to revert to the spinning icon.
 *
 * This manager is used by the {@link Map.domNode DOM node}. Editors use
 * {@link addCursor} to show a new cursor on the map when handles are active.
 * They get back a {@link Handle}. By calling {@link Handle.remove handle.remove()}
 * they can detach the cursor from the map, and the last visible cursor will be shown.
 *
 * See the <a href="articles://guide/view/controllers/custom_controllers.html">Implementing custom user interaction</a>
 * guide for more information on working with cursors on the map.
 *
 * @see {@link Map.cursorManager}
 * @since 2022.1
 */
export declare class CursorManager {
  /**
   * Create a new CursorManager for a DOM node.
   * @param node The HTML element to manage cursors for
   */
  constructor(node: HTMLElement);
  /**
   * Adds a new cursor to the stack of cursors.
   * The new cursor becomes active on the managed {@link domNode DOM node}.
   * The passed <code>cssCursorStyle</code> is assigned to the
   * <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">cursor</a> style.
   * @param cssCursor the CSS cursor string to assign to the {@link domNode managed DOM node}'s <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">cursor</a> style.
   */
  addCursor(cssCursor: string): CursorHandle;
  /**
   * The DOM node managed by this CursorManager.
   */
  get domNode(): HTMLElement;
}