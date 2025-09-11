import { UrlTileSetModel } from "./UrlTileSetModel.js";
import { AttributedTileSet, AttributionTileRegion } from "./AttributedTileSet.js";
import { Handle } from "../../util/Evented.js";
/**
 * A tileset model that can access tiles from <a href="https://developers.google.com/maps/documentation/tile/2d-tiles-overview">Google 2D Map Tiles API</a>.
 * Its constructor should not be called directly. Instead, use the static {@link createGoogleMapsTileSetModel} method:
 * ```javascript
 * [[include:model/tileset/GoogleMapsTileSetModelSnippets.ts_CREATE]]
 * ```
 * More information on how to use this model can be found in
 * <a href="articles://tutorial/googlemaps/visualize_google_data.html">Visualizing Google 2D Tiles</a>
 * @since 2024.0
 */
export declare class GoogleMapsTileSetModel extends UrlTileSetModel implements AttributedTileSet {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
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
/**
 * <a href="https://developers.google.com/maps/documentation/tile/session_tokens#session_token_request">
 *   Google Map Tiles - 2D Tiles - Display options</a>
 * When creating a 2D Google Map Tiles model, there are a number of display options:
 * <ul>
 *   <li>{@link mapType}</li>
 *   <li>{@link language}</li>
 *   <li>{@link region}</li>
 *   <li>{@link imageFormat}</li>
 *   <li>{@link scale}</li>
 *   <li>highDpi: we don't expose this option as this isn't necessary for hiDPI support in LuciadRIA. Use 'scale' instead to enlarge text and lines in tiles.</li>
 *   <li>{@link layerTypes}</li>
 *   <li>{@link styles}</li>
 *   <li>{@link overlay}</li>
 * </ul>
 * @since 2024.0
 */
export interface GoogleMapsTileSetModelCreateOptions {
  /**
   * The type of base map. This value can be one of the following: roadmap, satellite, terrain
   * <ul>
   *   <li>roadmap: The standard Google Maps painted map tiles.</li>
   *   <li>satellite: Satellite imagery.</li>
   *   <li>terrain: Terrain imagery. When selecting terrain as the map type, you must also include the layerRoadmap layer type
   *   (described in the Optional fields section).</li>
   * </ul>
   * @default "roadmap"
   */
  mapType?: "roadmap" | "satellite" | "terrain";
  /**
   * An IETF language tag that specifies the language used to display information on the tiles.
   * For example, en-US specifies the English language as spoken in the United States.
   * @default "en-US"
   */
  language?: string;
  /**
   * A Common Locale Data Repository region identifier (two uppercase letters) that represents the physical location of the user.
   * For example, US.
   * @default "US"
   */
  region?: string;
  /**
   * Specifies the file format to return. Valid values are either jpeg or png.
   * JPEG files don't support transparency, therefore they aren't recommended for overlay tiles.
   * If you don't specify an imageFormat, then the best format for the tile is chosen automatically.
   * @default undefined, which means Google will automatically choose the best format.
   */
  imageFormat?: "jpeg" | "png";
  /**
   * Scales-up the size of map elements (such as road labels), while retaining the tile size and coverage area of the default tile.
   * Increasing the scale also reduces the number of labels on the map, which reduces clutter.
   * @default undefined, which mean Google will apply a scale factor of 1x.
   */
  scale?: "scaleFactor1x" | "scaleFactor2x" | "scaleFactor4x";
  /**
   * An array of values that specifies the layer types added to the map. Valid values are:
   *
   * <ul>
   *   <li>layerRoadmap Required if you specify terrain as the map type.
   *   Can also be optionally overlaid on the satellite map type. Has no effect on roadmap tiles.</li>
   *   <li>layerStreetview Shows Street View-enabled streets and locations using blue outlines on the map.</li>
   *   <li>layerTraffic Displays current traffic conditions.
   * </ul>
   * @default "layerRoadmap" for mapType "roadmap", undefined for other mapTypes,
   *           which means Google will not add any extra overlays.
   */
  layerTypes?: ("layerRoadmap" | "layerStreetview" | "layerTraffic")[];
  /**
   * An array of JSON style objects that specify the appearance and detail level of map features such as roads,
   * parks, and built-up areas. Styling is used to customize the standard Google base map.
   * The styles parameter is valid only if the map type is roadmap. For the complete style syntax, see the
   * <a href="https://developers.google.com/maps/documentation/tile/style-reference">Style Reference</a>.
   * @default undefined, which means Google will not apply custom styling.
   */
  styles?: string;
  /**
   * A boolean value that specifies whether layerTypes should be rendered as a separate overlay (when true),
   * or combined with the base imagery (when false). When true, the base map isn't displayed.
   * If you haven't defined any {@link layerTypes} this value is ignored.
   * If you defined {@link layerTypes} and {@link overlay} is <code>true</code>, you get transparent Google 2D Tiles ("png").
   * In this case you can display two or more raster layers on top of each other.
   * Google 2D Tiles layer containing satellite data for example. You must configure such overlay raster layers
   * with {@link LayerType.STATIC} or {@link LayerType.DYNAMIC}. Those are the layer types that you can place on top of
   * {@link LayerType.BASE} layers.
   * @default undefined, which means Google will treat this as false.
   */
  overlay?: boolean;
}
/**
 * Creates a Google tileset model for the given options.
 * @param apiKey A valid Google Map API key
 * @param options An object literal {@link GoogleMapsTileSetModelCreateOptions} specifying options for the
 * creation of the Google tileset model.
 * @return A promise for a GoogleMapsTileSetModel. If the model cannot be created then the promise is rejected
 * with an {@link !Error Error} if the apiKey is not defined, or if the options combination is not supported.
 * @since 2024.0
 */
export declare function createGoogleMapsTileSetModel(apiKey: string, options?: GoogleMapsTileSetModelCreateOptions): Promise<GoogleMapsTileSetModel>;