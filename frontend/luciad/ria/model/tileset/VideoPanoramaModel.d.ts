import { PanoramaModel } from "./PanoramaModel.js";
/**
 * Creates a PanoramaModel that can be used to visualize a panoramic video recorded in pinhole projection.
 * A single level, single tile structure for the panorama is assumed.
 *
 * @param video The video.
 * @return A promise for a PanoramaModel.
 *
 * @since 2024.1
 */
export declare function createVideoPanoramaModel(video: HTMLVideoElement): Promise<PanoramaModel>;