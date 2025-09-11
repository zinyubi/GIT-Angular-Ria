import { GoogleMapType } from "../../model/image/GoogleImageModel.js";
import { RasterTileSetModel } from "../../model/tileset/RasterTileSetModel.js";
import { Layer } from "../Layer.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
/**
 * Constructor options for {@link GoogleLayer}.
 * @deprecated
 */
export interface GoogleLayerConstructorOptions {
  /**
   * The Google Map Type.
   */
  mapType?: GoogleMapType;
  /**
   * Configures the map style using a Google Maps style array.
   * Refer to <a href="https://developers.google.com/maps/documentation/javascript/styling#style_syntax" target="_blank">
   * Google's Styled Maps Documentation</a> for the detailed specification.
   */
  styles?: object[];
}
/**
 * <p>
 * A Google Layer allows you to embed a Google Map inside a {@link Map}.
 * </p>
 *
 * <p>
 * To be able to use this layer, you need to include the <code>Google Maps v3 API</code> on the web page.
 * Do this by adding a <code>script</code> tag to your page. For more details, check out the
 * <a href="https://developers.google.com/maps/documentation/javascript/tutorial" target="_blank">Google Map API
 * getting started documentation</a>.  Note that Google Maps has dropped support for IE11 in November 2022, so
 * GoogleLayer is no longer supported on that browser.  In IE11 you can still use a {@link GoogleImageModel}.
 * </p>
 *
 * <p>
 * A Google Map is restricted in the number of zoom levels it can show, as well as the extent of your navigation range.
 * By adding this layer to a map, the Map will be limited to these same constraints. This means that when
 * you send instructions that violate the constraints of Google Maps to the mapNavigator, for example by zooming to
 * an unsupported scale or navigating to an unsupported extent, the map will make a best effort to
 * snap to an extent and scale supported by Google Maps.
 * Because a GoogleLayer will not render anything when scale snapping is disabled,
 * {@link MapNavigator.defaults} <code>map.mapNavigator.defaults.snapToScaleLevels</code> will automatically
 * be set to 'true' when adding a GoogleLayer to the Map.
 * </p>
 *
 * <p>
 * You can also use a {@link GoogleImageModel} to add Google map data to a map.
 * The advantage is that you are not restricted by the navigation restrictions imposed by Google Maps.
 * Another advantage of using a <code>GoogleImageModel</code> rather than <code>GoogleLayer</code> is that
 * performance and memory consumption will be better.
 * </p>
 *
 * <p>
 * Please review the <a href="https://developers.google.com/maps/terms" target="_blank"> Google's Terms of Service </a>
 * carefully to determine if your application may use the Google Maps v3 API.
 * </p>
 *
 * ```javascript
 * var googleLayerOptions = {
 *   mapType: "hybrid",
 *   styles: [
 *     {
 *       featureType: "road.local",
 *       elementType: "geometry.stroke",
 *       stylers: [
 *         {color: "#282B2A"}
 *       ]
 *     }
 *   ]
 * };
 *
 * var googleLayer = new GoogleLayer(googleLayerOptions);
 * map.layerTree.addChild(googleLayer, "bottom");
 * ```
 * @deprecated Please use {@link RasterTileSetLayer} with a {@link GoogleMapsTileSetModel}
 * @since 2013.1
 *
 */
export declare class GoogleLayer extends Layer {
  /**
   * Contructs a LuciadRIA {@link Layer} that embeds a Google Map.
   * @param layerOptions configuration parameters for the {@link GoogleLayer}.
   */
  constructor(layerOptions?: GoogleLayerConstructorOptions);
  isPaintRepresentationSupported(paintRepresentation: PaintRepresentation): boolean;
  /**
   * @param darken whether or not to darken the Google layer
   * @param googMapContainer
   */
  darkenGoogleMap(darken: boolean, googMapContainer: HTMLElement): void;
  get model(): RasterTileSetModel;
  /**
   * The Google map type. Available options are "roadmap", "satellite", "hybrid", and "terrain".
   * @type String
   */
  get mapType(): GoogleMapType;
  set mapType(value: GoogleMapType);
  /**
   * The map style that will be applied to the Google Map.  The format of this property adheres to the
   * Google Maps style array as specified in the
   * <a href="https://developers.google.com/maps/documentation/javascript/styling#style_syntax" target="_blank">Google's
   * Styled Maps Documentation</a>.
   *
   * ```javascript
   * googleLayer.styles = [
   *   {
   *     featureType: "road.local",
   *     elementType: "geometry.stroke",
   *     stylers: [
   *       {color: "#282B2A"}
   *     ]
   *   }
   * ];
   * ```
   */
  get styles(): object[] | null;
  set styles(value: object[] | null);
}