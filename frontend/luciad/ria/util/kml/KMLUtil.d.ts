import { KMLGroundOverlayFeature } from "../../model/kml/KMLGroundOverlayFeature.js";
import { Layer } from "../../view/Layer.js";
import { LayerConstructorOptions } from "../../view/LayerTreeNode.js";
import { Map } from "../../view/Map.js";
import { HttpRequestOptions } from "../HttpRequestOptions.js";
import { DrapeTarget } from "../../view/style/DrapeTarget.js";
/**
 * Options for {@link createGroundOverlayLayer}.
 * @since 2021.0
 */
export interface CreateGroundOverlayLayerOptions {
  /**
   * Options to pass to layer constructions. See {@link LayerConstructorOptions}.
   */
  layerOptions?: LayerConstructorOptions;
  /**
   * HTTP request options used to download the image. See {@link HttpRequestOptions}.
   */
  requestOptions?: HttpRequestOptions;
  /**
   * A signal that can be used to abort the image request.
   */
  abortSignal?: AbortSignal;
  /**
   * The drape target of the ground overlay.
   *
   * @default DrapeTarget.TERRAIN
   * @see {@link KMLLayer.drapeTarget}
   * @since 2022.1
   */
  drapeTarget?: DrapeTarget;
}
/**
 * Creates a layer to visualize a {@link KMLGroundOverlayFeature}.
 *
 * ```javascript
 *  [[include:view/kml/KMLGroundOverlayFeatureSnippets.ts_CREATEGROUNDOVERLAY_EXAMPLE]]
 * ```
 * By default, this function will use the {@link KMLFeatureProperties.name} as the layer's
 * {@link LayerConstructorOptions.label label} and {@link KMLFeatureProperties.visibility}
 * as the layer's {@link LayerConstructorOptions.visible visible} flag.
 * You can override this default behavior by specifying a {@link LayerConstructorOptions.label label} or
 * {@link LayerConstructorOptions.visible visible} flag in the
 * {@link CreateGroundOverlayLayerOptions.layerOptions layerOptions}.
 *
 * @param map The map that the ground overlay will be visualized on.
 * @param groundOverlayFeature The {@link KMLGroundOverlayFeature ground overlay feature} to visualize.
 * @param options Options for the created layer. Use this to set a layer id, label or visibility. It takes precedence
 *                over the default behavior (which uses the groundOverlayFeature's visibility and name).
 * @since 2021.0
 */
export declare function createGroundOverlayLayer(map: Map, groundOverlayFeature: KMLGroundOverlayFeature, options?: CreateGroundOverlayLayerOptions): Promise<Layer>;