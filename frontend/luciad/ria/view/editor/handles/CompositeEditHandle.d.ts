import { ContextMenu } from "../../ContextMenu.js";
import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { GeoCanvas } from "../../style/GeoCanvas.js";
import { EditHandle } from "../EditHandle.js";
import { LabelCanvas } from "../../style/LabelCanvas.js";
/**
 * Composes a list of {@link EditHandle edit handles}.
 *
 * As opposed to {@link CascadingEditHandle}, the handles are all drawn at once.
 * Once a handle starts {@link HandleEventResult.EVENT_HANDLED handling} events,
 * it becomes 'active'. While active, it has priority over other handles when handling events.
 * Once it {@link HandleEventResult.EVENT_IGNORED stops handling events}, the handle becomes inactive,
 * which means that it no longer has priority over other handles.
 *
 * @since 2022.1
 */
export declare class CompositeEditHandle extends EditHandle {
  /**
   * Creates a new CompositeEditHandle.
   * @param handles The list of handles to compose in this CompositeEditHandle
   */
  constructor(handles: EditHandle[]);
  /**
   * The list of handles that this CompositeEditHandle delegates to.
   *
   * Note that the setter has side effects. Do not modify the list of handles in-place (e.g. <code>push()</code> new
   * handles to the array after the setter has been called).
   */
  protected get handles(): ReadonlyArray<EditHandle>;
  protected set handles(handles: ReadonlyArray<EditHandle>);
  /**
   * The index of the active handle.
   *
   * The active handle is the handle that is currently handling gesture events.
   * It takes priority over other handles, as long as it is handling events.
   * Once it stops handling events (when it returns {@link HandleEventResult.EVENT_IGNORED}),
   * the composite will forward events to other handles, which can become active.
   *
   * -1 if no handle is currently active.
   */
  protected set activeHandleIndex(index: number);
  /**
   * Draws handle shapes on the map.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
  /**
   * Draws handle labels on the map.
   *
   * {@link EditHandle} in the list of {@link handles}.
   */
  onDrawLabel(labelCanvas: LabelCanvas, context: EditContext): void;
  /**
   * Indicates whether the feature being created or edited, should be painted by the controller.
   *
   * By default, if one of the delegate {@link handles}' {@link shouldPaintFeature} returns <code>true</code>,
   * this also returns <code>true</code>. Otherwise <code>false</code> is returned.
   *
   * @since 2024.0
   */
  shouldPaintFeature(context: EditContext): boolean;
  /**
   * Called when (another) handle changes the feature or shape, as indicated by the {@link EditHandle.on "EditShape"} event.
   *
   * {@link EditHandle} in the list of {@link handles}.
   */
  update(): void;
  /**
   * Called when a {@link ContextMenu} is populated.
   *
   * This calls {@link onCreateContextMenu} for all {@link handles delegate handles}.
   */
  onCreateContextMenu(gestureEvent: GestureEvent, context: EditContext, contextMenu: ContextMenu, onDone: () => void): void;
  /**
   * Handles the given {@link EditContext context}.
   *
   *
   * It forwards the event to all {@link findInteractionHandles interaction handles}. If one the
   * {@link findInteractionHandles interaction handles} then handles the event, that handle becomes the
   * {@link activeHandleIndex active handle} until it deactivates
   * (returns {@link HandleEventResult.REQUEST_DEACTIVATION} or ignores an event).
   */
  onGestureEvent(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Finds the handles to interact with, based on a given input event.
   *
   * @param event The event to find handles for
   * @param context The edit context
   *
   * @return handles that are close to the mouse cursor / finger.
   */
  findInteractionHandles(event: GestureEvent, context: EditContext): EditHandle[];
  /**
   * Returns the mouse <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">cursor</a> to show.
   *
   * If there is an {@link activeHandleIndex active handle}, its cursor is returned.
   * Otherwise, the first {@link findInteractionHandles interaction handle}'s cursor is used.
   */
  getCursor(event: GestureEvent, context: EditContext): string | null;
}