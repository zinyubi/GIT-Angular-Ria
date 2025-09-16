import { PointDragHandle } from "./PointDragHandle.js";
import { BoundsResizeHandleIdentifier } from "./BoundsResizeHandleIdentifier.js";
import { EditShapeEvent } from "../../controller/EditShapeEvent.js";
import { Handle } from "../../../util/Evented.js";
import { Bounds } from "../../../shape/Bounds.js";
import { IconStyle } from "../../style/IconStyle.js";
/**
 * Handle that resizes a {@link Bounds} bounds shape.
 *
 * This handle is linked to 1 corner of the bounds, based on its {@link BoundsResizeHandleIdentifier identifier}.
 *
 * The corner handles created by the {@link BoundsEditor} can {@link flip}, which changes their {@link identifier}.
 * For example, if the one of the top corners is dragged below the bottom corners, the top and bottom handles flip their
 * {@link identifier}.
 *
 * @see {@link BoundsEditor}
 * @since 2022.1
 */
export declare class BoundsResizeHandle extends PointDragHandle {
  /**
   * Constructs a new BoundsResizeHandle.
   * @param bounds The bounds being edited by this handle
   * @param identifier The initial {@link identifier} of the bound's corner.
   * @param handleIconStyle The icon style of the point handle
   */
  constructor(bounds: Bounds, identifier: BoundsResizeHandleIdentifier, handleIconStyle?: IconStyle | null);
  /**
   * The bounds being edited by this handle
   */
  get bounds(): Bounds;
  /**
   * The identifier of this handle.
   *
   * It indicates what corner of the bounds this handle belongs to.
   */
  get identifier(): BoundsResizeHandleIdentifier;
  /**
   * Called whenever the handle should flip its {@link BoundsResizeHandleIdentifier identifier}.
   *
   * For example, if a horizontal flip occurred, and this handle was {@link BoundsResizeHandleIdentifier.LOWER_LEFT LOWER_LEFT},
   * it should change its identifier to {@link BoundsResizeHandleIdentifier.LOWER_RIGHT UPPER_LEFT}.
   *
   * @param flipHorizontal indicates whether it was a horizontal flip
   * @param flipVertical indicates whether it was a vertical flip
   */
  flip(flipHorizontal: boolean, flipVertical: boolean): void;
  /**
   * An event that is fired whenever this handle has {@link flip flipped} while dragging.
   * @event Flipped
   */
  on(event: "Flipped", callback: (flippedVertical: boolean, flippedHorizontal: boolean) => void): Handle;
  /**
   * An event that is emitted whenever this handle is {@link invalidate invalidated}.
   *
   * @event Invalidated
   */
  on(event: "Invalidated", callback: () => void): Handle;
  /**
   * An event that is emitted whenever this handle changes the shape of a feature.
   * @event EditShape
   */
  on(event: "EditShape", callback: (event: EditShapeEvent) => void): Handle;
}