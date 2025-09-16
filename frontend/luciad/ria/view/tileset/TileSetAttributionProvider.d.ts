import { Layer } from "../Layer.js";
import { Evented, Handle } from "../../util/Evented.js";
import { Map } from "../Map.js";
/**
 * Attribution info for a layer
 * @since 2023.1
 */
export interface LayerAttribution {
  /**
   * The layer that this attribution info is for
   */
  layer: Layer;
  /**
   * The attribution strings for this layer.
   */
  attributionStrings: string[];
  /**
   * The attribution logos for this layer.
   */
  attributionLogos: string[];
}
/**
 * A utility class that can provide tileset attribution information for all tilesets that are visible in
 * a map.
 *
 */
declare class TileSetAttributionProvider implements Evented {
  /**
   * Creates a new tileset attribution provider for the given map.
   * @param map the map
   */
  constructor(map: Map);
  /**
   * Disposes this tileset attribution provider. Once this method has been called this instance will no longer
   * produce attribution change events.
   */
  dispose(): void;
  /**
   * Returns the current list of attribution logos. The returned list may be empty.
   *
   * @return the current list of attribution logos
   */
  getAttributionLogos(): string[];
  /**
   * Returns the current list of attribution strings. The returned list may be empty.
   *
   * @return the current list of attribution strings
   */
  getAttributionStrings(): string[];
  /**
   * Returns the current list of layer attributions. The returned list may be empty.
   *
   * @return the current list of layer attributions
   *
   * @since 2023.1
   */
  getLayerAttributions(): LayerAttribution[];
  /**
   * Event fired when the attribution logos change.
   * @param event the 'AttributionLogosChanged' event
   * @param callback the callback to be invoked when the attribution logos change. The callback gets the 'logos'
   * parameter, which is an array of strings containing the updated list of logo URLs
   * @param context value to use as this when executing callback
   */
  on(event: "AttributionLogosChanged", callback: (logos: string[]) => void, context?: any): Handle;
  /**
   * Event fired when the attribution strings change.
   * @param event the 'AttributionStringsChanged' event
   * @param callback the callback to be invoked when the attribution strings change. The callback gets the 'strings'
   * parameter, which is an array of strings containing the updated list of attribution strings
   * @param context value to use as this when executing callback
   */
  on(event: "AttributionStringsChanged", callback: (strings: string[]) => void, context?: any): Handle;
  /**
   * Event fired when the layer attributions change
   * @param event the 'LayerAttributionsChanged' event
   * @param callback the callback to be invoked when the layer attributions change. The callback gets the 'attributions'
   * parameter, which is an array of {@link LayerAttribution} containing the updated list of layer attributions
   * @param context value to use as this when executing callback
   * @since 2023.1
   */
  on(event: "LayerAttributionsChanged", callback: (attributions: LayerAttribution[]) => void, context?: any): Handle;
}
export { TileSetAttributionProvider };