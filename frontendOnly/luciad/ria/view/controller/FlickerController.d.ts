import { GestureEvent } from "../input/GestureEvent.js";
import { HandleEventResult } from "./HandleEventResult.js";
import { Controller } from "./Controller.js";
import { Map } from "../Map.js";
import { Handle } from "../../util/Evented.js";
import { Layer } from "../Layer.js";
/**
 * Mouse controller that allows visual comparison of multiple collections of layers by quickly toggling
 * their visibility. Doing so allows easy verification of differences in the layer contents.
 *
 * <p>
 * Flickering is done by (quickly) clicking the mouse button.
 * The default behavior will increment the {@link visibleIndex} on every mouse click.
 * <p>
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://controller/flicker.gif"
 *         alt="FlickerController usage"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>FlickerController in action</td>
 *   </tr>
 * </table>
 *
 * <p>
 * Usage:
 *
 * ```javascript
 * [[include:view/controller/FlickerControllerCreateSnippets.ts_CREATE_FLICKER_CONTROLLER]]
 * ```
 * </p>
 *
 * <p>
 * Note that you can only use a FlickerController on a {@link WebGLMap}.
 * </p>
 *
 * <p>
 * The FlickerController provides no out-of-the-box UI. You can use the sample UI implementation from
 * <code>samples/common/ui/SampleFlickerUI</code> as-is. It can be re-styled using CSS variables.
 * You can also use it as a reference to create your own UI on top of the FlickerController API.
 * </p>
 *
 * <p>
 * You can customize the controller to respond to keyboard events as follows:
 * </p>
 *
 * ```javascript
 * [[include:view/controller/FlickerControllerCustomizationSnippets.ts_FLICKER_CUSTOMIZATION]]
 * ```
 *
 * @since 2021.0
 */
export declare class FlickerController extends Controller {
  /**
   * Creates a new FlickerController
   */
  constructor();
  onActivate(map: Map): void;
  onDeactivate(map: Map): Promise<void> | void;
  /**
   * Sets the layers to use. When started, only the first set of layers is visible
   * and the others are made invisible. When calling {@link visibleIndex}, the
   * layer collection at the given index is made visible, and the others are made invisible.
   *
   * <p>
   * Layers that are not mentioned in any of the layer sets, are always visible.
   * </p>
   *
   * <p>
   * If you want to flicker just one layer, put the one layer in its own layer set, and leave the other layer set empty.
   * </p>
   *
   * ```javascript
   * flickerController.layers = [[layerToFlicker], []];
   * ```
   */
  set layers(val: Layer[][]);
  get layers(): Layer[][];
  /**
   * Sets the collection of layers with the given index visible, making the layers in the
   * other collections invisible.
   *
   * @param index the index of the visible layers
   */
  set visibleIndex(index: number);
  /**
   * Returns the index of the layer collection that is visible.
   */
  get visibleIndex(): number;
  invalidate(): void;
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  /**
   * An event that is fired when the layers change.
   * @see {@link FlickerController.layers}
   * @since 2021.0
   * @event
   */
  on(event: "LayersChange", callback: (layers: Layer[][]) => void): Handle;
  /**
   * An event that is fired when the index indicating the visible set of layers is changed.
   * @see {@link FlickerController.visibleIndex}
   * @since 2021.0
   * @event
   */
  on(event: "VisibleIndexChange", callback: (index: number) => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event
   */
  on(event: "Invalidated", callback: () => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event
   */
  on(event: "Activated", callback: (map: Map) => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event
   */
  on(event: "Deactivated", callback: (map: Map) => void): Handle;
}