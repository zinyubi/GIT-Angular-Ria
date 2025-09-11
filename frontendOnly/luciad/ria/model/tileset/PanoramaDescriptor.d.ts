import { PanoramicImageProjection } from "./PanoramicImageProjection.js";
import { PanoramaTileSetStructure } from "./PanoramaTileSetStructure.js";
import { PanoramaType } from "./PanoramaType.js";
import { PanoramaImageryType } from "./PanoramaImageryType.js";
/**
 * Describes a panorama.
 * @since 2020.1
 */
export interface PanoramaDescriptor {
  type: PanoramaType;
  structure: PanoramaTileSetStructure;
  /**
   * The kind of imagery of the panorama.
   * By default, static imagery is assumed.
   *
   * @default PanoramaImageryType.IMAGE
   * @since 2024.1
   */
  imageryType?: PanoramaImageryType;
}
/**
 * Describes a cubemap panorama.
 *
 * Every face of the cubemap is put in a separate image (tileset).
 *
 * The orientation of the cubemap images is as follows:
 *
 * <ul>
 *   <li>Front face: The positive Y-direction goes through the center of this face.
 *       <img src="media://panoramics/front.jpg" alt="Cubemap front face">
 *   </li>
 *   <li>Back face: The negative Y-direction goes through the center of this face.
 *       <img src="media://panoramics/back.jpg" alt="Cubemap back face">
 *   </li>
 *   <li>Right face: The positive X-direction goes through the center of this face.
 *       <img src="media://panoramics/right.jpg" alt="Cubemap right face">
 *   </li>
 *   <li>Left face: The negative X-direction goes through the center of this face.
 *       <img src="media://panoramics/left.jpg" alt="Cubemap left face">
 *   </li>
 *   <li>Top face: The positive Z-direction goes through the center of this face.
 *       <img src="media://panoramics/top.jpg" alt="Cubemap top face">
 *   </li>
 *   <li>Bottom face: The negative Z-direction goes through the center of this face.
 *       <img src="media://panoramics/bottom.jpg" alt="Cubemap bottom face">
 *   </li>
 * </ul>
 * @since 2020.1
 */
export interface CubeMapPanoramaDescriptor extends PanoramaDescriptor {
  type: PanoramaType.CUBE_MAP;
  /**
   * The projection used in the faces of the cubemap.
   * Defaults to a {@link PinholePanoramicImageProjection} with a horizontal field-of-view of 90 degrees.
   */
  projection?: PanoramicImageProjection;
}
/**
 * Describes a panorama that has a single image as its data source (as opposed to a cube map that has 6 images as its source).
 * @since 2020.1
 */
export interface SingleImagePanoramaDescriptor extends PanoramaDescriptor {
  type: PanoramaType.SINGLE_IMAGE;
  /**
   * The projection type used in the image. Defaults to an {@link EquirectangularPanoramicImageProjection}
   * where the projection center / forward direction is in the center of the image.
   */
  projection: PanoramicImageProjection;
}