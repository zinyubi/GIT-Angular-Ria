import { EditHandle } from "../EditHandle.js";
import { GeoCanvas } from "../../style/GeoCanvas.js";
import { EditContext } from "../../controller/EditContext.js";
import { LabelCanvas } from "../../style/LabelCanvas.js";
import { ContextMenu } from "../../ContextMenu.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { HandleEventResult } from "../../controller/HandleEventResult.js";
/**
 * A collection of {@link EditHandle edit handles} that become active one-by-one.
 *
 * As opposed to {@link CompositeEditHandle}, only one handle is active at a time.
 * Once a handle {@link HandleEventResult.REQUEST_FINISH finishes}, the next one becomes active.
 *
 * This can be especially useful for creation.
 * Every step of the creation process corresponds to one handle. When the first handle deactivates,
 * the next handle is used, and so on. A {@link CreateByTemplateHandle} is an example
 * of a cascading handle. First, a {@link PointCreateHandle point is created} to position the template.
 * After the template is positioned, the {@link CreateByTemplateHandle} delegates to the shape's
 * {@link Editor.getEditHandles edit handles} so the user can further adapt the template to the desired shape.
 *
 * @since 2024.0
 */
export declare class CascadingEditHandle extends EditHandle {
  constructor(handles: EditHandle[]);
  /**
   * The list of handles that this CascadingEditHandle delegates to.
   */
  protected get handles(): ReadonlyArray<EditHandle>;
  /**
   * The index of the currently active handle.
   * @since 2024.0
   */
  get index(): number;
  set index(val: number);
  /**
   * Delegates to the currently active handle's onDraw.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
  /**
   * Delegates to the currently active handle's onDrawLabel.
   */
  onDrawLabel(labelCanvas: LabelCanvas, context: EditContext): void;
  /**
   * Delegates to the currently active handle's shouldPaintFeature.
   * @since 2024.0
   */
  shouldPaintFeature(context: EditContext): boolean;
  /**
   * Delegates to all handles' update.
   */
  update(): void;
  /**
   * Delegates to the currently active handle's onCreateContextMenu.
   */
  onCreateContextMenu(event: GestureEvent, context: EditContext, contextMenu: ContextMenu, onDone: () => void): void;
  /**
   * Delegates to the currently active handle's onGestureEvent.
   *
   * Once the currently active handle {@link HandleEventResult.REQUEST_FINISH finishes},
   * the next handle becomes active.
   */
  onGestureEvent(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Delegates to the currently active handle's getCursor.
   */
  getCursor(event: GestureEvent, context: EditContext): string | null;
}