import { HttpRequestOptions } from "../../util/HttpRequestOptions.js";
import { Feature } from "../feature/Feature.js";
import { PanoramaContext } from "./PanoramaContext.js";
import { CubeMapPanoramaDescriptor, SingleImagePanoramaDescriptor } from "./PanoramaDescriptor.js";
import { PanoramaModel, PanoramicImageTileRequest } from "./PanoramaModel.js";
/**
 * A {@link PanoramaModel} that understands the LuciadFusion panorama feature structure and images location.
 *
 * Example usage:
 * ```javascript
 * [[include:model/tileset/FusionPanoramaModelSnippets.ts_CREATE]]
 * ```
 *
 * @since 2020.1
 */
export declare class FusionPanoramaModel extends PanoramaModel {
  /**
   * Creates a FusionPanoramaModel
   * @param urlToImagesOrCubeMapJson The path to where the images are stored, typically just strip the "cubemap.json".  You can also pass the full path to the cubemap.json file.
   * @param options request options for the tileset. See {@link HttpRequestOptions}.
   */
  constructor(urlToImagesOrCubeMapJson: string, options?: HttpRequestOptions);
  getPanoramaDescriptor(feature: Feature, context: PanoramaContext): CubeMapPanoramaDescriptor | SingleImagePanoramaDescriptor | null;
  getPanoramicImageURL(request: PanoramicImageTileRequest): string | null;
}