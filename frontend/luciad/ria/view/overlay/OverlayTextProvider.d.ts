import { Point } from "../../shape/Point.js";
import { Evented, Handle } from "../../util/Evented.js";
import { Layer } from "../Layer.js";
import { Map } from "../Map.js";
import { OverlayTextCoordinateType } from "./OverlayTextCoordinateType.js";
/**
 * Defines a format string to be used at a given scale range.
 * @since 2022.0
 */
export interface OverlayTextSetting {
  /**
   * The scale range in which to apply the format string.
   *
   * {@link min} should be smaller than {@link max}.
   * Smaller numbers represent more zoomed out scales, larger number represent more zoomed in scales.
   * 0 represents the scale of a map zoomed out to infinity.
   * <code>Number.MAX_VALUE</code> represents the scale of a map that's zoomed in to the maximum.
   */
  scaleRange: {
    min: number;
    max: number;
  };
  format: string;
}
/**
 * Constructor options for a OverlayTextProvider
 * @since 2022.0
 */
export interface OverlayTextProviderConstructorOptions {
  /**
   * The coordinate to provide text for.
   *
   * The text can be based on the following types of coordinates:
   * <ul>
   *   <li>a fixed pixel coordinate, for example the center of the map</li>
   *   <li>the coordinate under the mouse, see {@link OverlayTextCoordinateType.MOUSE_CURSOR}</li>
   *   <li>a (part of) the coordinate that is common for all points on the map, see {@link OverlayTextCoordinateType.COMMON_MAP_COORDINATE}</li>
   * </ul>
   *
   * @default {@link OverlayTextCoordinateType.CENTER}
   */
  coordinate?: OverlayTextCoordinateType;
}
/**
 * A utility class that can be used to implement a UI component that shows an overlay text for a layer, for example
 * an overlay that shows the current MGRS grid zone.
 *
 * The text can be based on the following types of coordinates:
 * <ul>
 *   <li>a fixed pixel coordinate, for example the center of the map</li>
 *   <li>the coordinate under the mouse, see {@link OverlayTextCoordinateType.MOUSE_CURSOR}</li>
 *   <li>a (part of) the coordinate that is common for all points on the map, see {@link OverlayTextCoordinateType.COMMON_MAP_COORDINATE}</li>
 * </ul>
 *
 * This utility {@link on fires events} whenever the text changes, or the visibility of the layer changes.
 * You can use these events to update the state of your UI component.
 *
 * @since 2022.0
 */
export declare abstract class OverlayTextProvider implements Evented {
  /**
   * Constructs a new OverlayTextProvider
   * @param layer The layer to provide overlay text for
   * @param settings Specifies what format string to use at what scale range
   * @param defaultFormat The default format string. This is used if no format string was found for the current scale.
   * @param options Options for this OverlayTextProvider.
   */
  constructor(layer: Layer, settings: OverlayTextSetting[], defaultFormat: string, options?: OverlayTextProviderConstructorOptions);
  /**
   * Returns the current overlay text.
   * This changes whenever coordinate specified by {@link OverlayTextProviderConstructorOptions.coordinate} changes.
   * Ie. the map is moved (or the mouse moves if {@link OverlayTextCoordinateType.MOUSE_CURSOR}.
   */
  get text(): string;
  /**
   * Returns the current state of visibility.
   * Visible is true when:
   * <ul>
   *   <li>the layer is added to a map</li>
   *   <li>the layer's {@link Layer.visible} is true</li>
   *   <li>labeling is turned on for the current layer</li>
   * </ul>
   */
  get visible(): boolean;
  /**
   * Destroy this OverlayTextProvider. This cleans up all map / layer listeners it has set up.
   */
  destroy(): void;
  /**
   * This event fires whenever {@link OverlayTextProvider.text} changes.
   * @event
   */
  on(event: "TextChanged", callback: (newText: string) => void): Handle;
  /**
   * This event fires whenever {@link OverlayTextProvider.visible} changes.
   * @event
   */
  on(event: "VisibilityChanged", callback: (newVisibility: boolean) => void): Handle;
  /**
   * Called whenever a single (model) point needs to be formatted to a string.
   * @param modelPoint The point to format to a string
   * @param format The format string to use.
   *               This is the format string that matches the current scale range (as passed into the constructor),
   *               or the default format string if no matching scale range was found.
   */
  protected abstract formatModelPoint(modelPoint: Point, format: string): string;
  /**
   * Called whenever a common map coordinate ({@link OverlayTextCoordinateType.COMMON_MAP_COORDINATE}) needs to be formatted
   * to a string.
   * @param map A reference to the map for which to determine the common map coordinate.
   * @param format The format string to use.
   *               This is the format string that matches the current scale range (as passed into the constructor),
   *               or the default format string if no matching scale range was found.
   */
  protected abstract formatCommonMapCoordinate(map: Map, format: string): string;
  /**
   * Transform a view point (pixels) to the model reference
   * @param viewPoint A view point (pixel coordinaes) to transform to the model reference
   * @protected
   */
  protected viewPointToModel(viewPoint: Point): Point;
  /**
   * Call this to update {@link text}. For example, this is called when the map is moved.
   */
  protected update(): void;
}