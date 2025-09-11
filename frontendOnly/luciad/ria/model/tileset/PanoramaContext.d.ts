/**
 * The context of a panorama. This bag of properties is passed from
 * {@link PanoramaModel.getPanoramicImage}
 * and {@link PanoramaModel.getPanoramicImageURL} to determine the URL of the image.
 * @since 2020.1
 */
export type PanoramaContext = {
  [key: string]: string | number;
};