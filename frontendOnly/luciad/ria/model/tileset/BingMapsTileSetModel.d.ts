import { AttributedTileSet, AttributionTileRegion } from "./AttributedTileSet.js";
import { TileCoordinate } from "./TileCoordinate.js";
import { UrlTileSetModel } from "./UrlTileSetModel.js";
import { Handle } from "../../util/Evented.js";
/**
 * Constructor options for {@link BingMapsTileSetModel}.
 */
export interface BingMapsTileSetModelConstructorOptions {
  /**
   * A URI referring to the logo that should be used when displaying attribution for this tileset
   */
  brandLogoUri: string;
  /**
   * The culture parameter that should be used when requesting tiles.
   */
  culture: string;
  /**
   * An array of strings containing the subdomains that may be merged with the imageUrl template.
   */
  imageUrlSubdomains?: string[];
  /**
   * An array of Objects containing imagery provider metadata.
   */
  imageryProviders?: any[];
}
/**
 * A tileset model that can access a tile server that implements the Bing Maps tile URL convention.
 */
export declare class BingMapsTileSetModel extends UrlTileSetModel implements AttributedTileSet {
  /**
   * Creates a new BingMaps Tileset model.
   * @param options An object literal specifying options for the creation of the Bing tileset model.
   **/
  constructor(options?: BingMapsTileSetModelConstructorOptions);
  getTileURL(baseURL: string, tile: TileCoordinate): string | null;
  getAttribution(regions: AttributionTileRegion[]): string[];
  getLogo(): string | null;
  /**
   * @see {@link AttributedTileSet.on}
   * @event AttributionChanged
   */
  on(event: "AttributionChanged", callback: () => void): Handle;
  /**
   * @see {@link Invalidation.on}
   * @event Invalidated
   */
  on(event: "Invalidated", callback: () => void): Handle;
}