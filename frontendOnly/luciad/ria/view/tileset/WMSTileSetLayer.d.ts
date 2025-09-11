import { RasterTileSetLayer, RasterTileSetLayerConstructorOptions } from "./RasterTileSetLayer.js";
import { WMSTileSetModel } from "../../model/tileset/WMSTileSetModel.js";
/**
 * Additional options for the {@link WMSTileSetLayer.getFeatureInfo} request.
 */
export interface WMSGetFeatureInfoOptions {
  /**
   * Overrides the default info format that was specified when the WMS model of this layer was constructed.
   */
  infoFormat?: string;
  /**
   * The maximum number of features for which you want feature information.
   */
  featureCount?: number | string;
}
/**
 * Contains the result of {@link WMSTileSetLayer.getFeatureInfo}
 */
export interface WMSGetFeatureInfoResponse {
  /**
   * The text contained in the response. The content of this text depends on the info format you requested
   * and on the implementation of the server. For instance, if your requested info format was "application/json", the
   * server could respond by:
   * <ul>
   *   <li>sending a list of properties about the feature, encoded in JSON format.</li>
   *   <li>OR, by sending the geometry of the feature in GeoJSON format.</li>
   * </ul>
   */
  text: string;
  /**
   * The HTTP status of the response
   */
  status: string;
  /**
   * A function to retrieve a specific HTTP header of the response.
   * @param name the name of the header you want to retrieve
   */
  getHeader(name: string): string | null;
}
/**
 * A <code>RasterTileSetLayer</code> that adds support for GetFeatureInfo requests to the underlying WMS server.
 * You can use the {@link getFeatureInfo} method to request additional information about features at a given
 * view location.
 * <p/>
 * Note that this can only work if the underlying {@link WMSTileSetModel} is queryable.
 */
declare class WMSTileSetLayer extends RasterTileSetLayer {
  /**
   * Creates a new WMS TileSet Layer for the given model and options.
   * @param model The <code>WMSTileSetModel</code> for this layer. To be able to use the <code>getFeatureInfo</code>
   *              method on this layer, the model should be queryable. May not be <code>null</code> or <code>undefined</code>.
   * @param options the layer options.
   */
  constructor(model: WMSTileSetModel, options?: RasterTileSetLayerConstructorOptions);
  get model(): WMSTileSetModel;
  /**
   * Reports whether you can perform getFeatureInfo queries on this layer. This depends on the WMS TileSet Model:
   * if that is queryable, this layer is queryable.
   */
  get queryable(): boolean;
  /**
   * Requests feature info at the specified view location. The layers to visualize and the layers to query
   * are specified in the model that was passed in when the layer was constructed.
   * <p/>
   * The <code>GetFeatureInfo</code> requests to the WMS server will match the <code>GetMap</code> requests for the visualization.
   * <p/>
   * This layer can only be called if:
   * <ul>
   *   <li>The WMS model of this layer is queryable</li>
   *   <li>The layer was already added to a <code>Map</code></li>
   * </ul>
   * @param viewX The x-coordinate in view reference for which to request feature information.
   * @param viewY The y-coordinate in view reference for which to request feature information.
   * @param options Additional options for the request.
   * @returns A promise to the feature info response, or <code>null</code> if the given view location
   * is not inside the bounds of this WMS layer.
   * <p/>
   * The object passed to the success callback of the promise has the structure of {@link WMSGetFeatureInfoResponse}.
   * If an error occurs, the error callback will be called with an object with the following structure:
   * <ul>
   *   <li>A property 'message': the text contained in the error.</li>
   *   <li>A property 'response': the full response object of the error. It has the same structure as the object passed
   *   directly to the success callback of the Promise (see above).</li>
   * </ul>
   *
   * ```javascript
   * var infoPromise = layer.getFeatureInfo(10, 10, {featureCount: 5});
   * infoPromise.then(
   *   function(response) {
   *     var contentType = response.getHeader("Content-Type");
   *     if (!contentType || contentType.indexOf("application/json") === -1) {
   *       // we can only handle GeoJson responses.
   *       return;
   *     }
   *     var json = response.text;
   *     JSON.parse(json);
   *     //do something with the returned content
   *   },
   *   function(error) {
   *     console.log("Error when getting feature information. HTTP status: " + error.response.status);
   *     alert("Could not get feature information: " + error.message);
   *   });
   * ```
   * @since 2015.1
   */
  getFeatureInfo(viewX: number, viewY: number, options?: WMSGetFeatureInfoOptions): Promise<WMSGetFeatureInfoResponse> | null;
}
export { WMSTileSetLayer };