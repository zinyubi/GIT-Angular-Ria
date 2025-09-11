import { Evented, Handle } from "../../util/Evented.js";
/**
 * An object describing the tile region for which the attribution strings should be retrieved.
 * @see {@link AttributedTileSet.getAttribution}
 * @since 2023.1
 */
export interface AttributionTileRegion {
  /**
   * The level for which to retrieve attribution.
   */
  level: number;
  /**
   * The x coordinate for which to retrieve attribution.
   */
  x: number;
  /**
   * The y coordinate for which to retrieve attribution.
   */
  y: number;
  /**
   * The width of the region, in amount of tiles, for which to retrieve attribution.
   */
  width: number;
  /**
   * The height of the region, in amount of tiles, for which to retrieve attribution.
   */
  height: number;
}
/**
 * A tile set that contains data that is possibly copyrighted. The methods of this interface
 * allow users to retrieve copyright related information that should be displayed when using
 * the data contained in this tile set.
 */
export interface AttributedTileSet extends Evented {
  /**
   * Returns a list of attribution strings that should be displayed when using the specified
   * subset of this tile set.
   * @param regions the tile regions for which the attribution strings should be retrieved
   * @return a (possibly empty) list of attribution strings
   */
  getAttribution(regions: AttributionTileRegion[]): string[];
  /**
   * Returns a URL referring to a graphical logo of the copyright owner of this data. If a logo is not available
   * this method will return <code>null</code>.
   * @return a URL referring to a graphical logo or <code>null</code>.
   */
  getLogo(): string | null;
  /**
   * An event that is emitted whenever the attributions returned by {@link getAttribution} has changed from within the model.
   * For example, after a download of attributions has finished, {@link getAttribution} needs to be re-evaluated.
   * @param event The 'AttributionChanged' event.
   * @param callback the callback to be invoked when the attributions of the model changed.
   * @since 2024.0
   */
  on(event: "AttributionChanged", callback: () => void): Handle;
}