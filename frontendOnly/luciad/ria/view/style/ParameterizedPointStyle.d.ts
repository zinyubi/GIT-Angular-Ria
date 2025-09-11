/**
 * Base interface for a parameterized point style.
 */
export interface GenericParameterizedPointStyle {
  /**
   * <p>The x coordinate of the anchor for this icon. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "50%", which implies that the anchor-point is at the center of the image.</p>
  *   For example "http://www.example.com/image.png".
   * have its anchor-point scaled.</p>
   * <p>The horizontal anchor-point is always defined from left to right. <code>{ anchorX:"0px" }</code> is the left of the image, and positive values
   * are points to the right.</p>
   *
   * @default "50%"
   */
  anchorX?: string;
  /**
   * <p>The y coordinate of the anchor for this icon. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "50%", which implies that the anchor-point is at the center of the image.</p>
   * <p> The anchor is always defined with respect to the original image size. This means that a scaled image will automatically
   * have its anchor-point scaled.</p>
   * <p>The vertical anchor-point is always defined from top to bottom. <code>{ anchorY:"0px" }</code> is the top of the image, and positive values
   * are points to the bottom.</p>
   *
   * @default "50%"
   */
  anchorY?: string;
  /**
   * <p>
   * Whether the icon should be requested with authentication parameters. Setting this to true is required when the server requires cookies, basic http authentication, or OAuth authentication. This flag should be set to false if
   * the server is configured to allow cross-origin requests from all hosts. Such servers reject all authenticated requests.
   * </p>
   * <p>
   *   This parameter is only relevant when you are using the `ParameterizedPointStyle#url` property to request images. If you use the icon using the `ParameterizedPointStyle#image` property, the credentials are automatically handled by the browser.
   * </p>
   * <p>
   *   The default value is <code>false</code>
   * </p>
   *
   * @default false
   */
  credentials?: boolean;
  /**
   * <p>The target height of the image, with a given unit of measure. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "100%", which implies that the icon is painted at its original resolution.</p>
   *
   * @default "100%"
   */
  height?: string;
  /**
   * <p>The X offset in pixels that should be applied with respect to the location of the point. This offset is applied after rotation and
   * does not take into account any scaling performed on the image. The default is 0, which means that the icon is painted at its anchor-point.</p>
   *
   * @default 0
   */
  offsetX?: number;
  /**
   * <p>The Y offset in pixels that should be applied with respect to the location of the point. This offset is applied after rotation and
   * does not take into account any scaling performed on the image. The default is 0, which means that the icon is painted at its anchor-point.</p>
   *
   * @default 0
   */
  offsetY?: number;
  /**
   * <p>The rotation of the icon, specified in degrees. The default is 0, which implies no rotation to the original icon.
   * Rotations are  applied in a clock-wise fashion. Rotation of the icon happens around its anchor-point.</p>
   *
   * @default 0
   */
  rotation?: number;
  /**
   * <p>The target width of the image, with a given unit of measure. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "100%", which implies that the icon is painted at its original resolution.</p>
   *
   * @default "100%"
   */
  width?: string;
}
/**
 * A parameterized point style where a URL refers to an image resource.
 */
export interface UrlParameterizedPointStyle extends GenericParameterizedPointStyle {
  /**
   * <p>
   *   A URL referring to an image resource.
   *   For example <code>http://www.example.com/image.png</code>.
   * </p>
   * <p>
   *   This image should be a url either to a raster image, like a .png or .jpeg file, or to an image in SVG format.
   * </p>
   *
   */
  url: string;
}
/**
 * A parameterized point style that uses an Image or Canvas DOM element.
 */
export interface ImageParameterizedPointStyle extends GenericParameterizedPointStyle {
  /**
   * <p>An Image or Canvas DOM element.</p>
   * <p>
   *   This image should either be a raster image, like a .png or .jpeg file, or be an image in SVG format.
   * </p>
   *
   */
  image: HTMLImageElement | HTMLCanvasElement;
}
/**
 * A <code>ParameterizedPointStyle</code> describes how an icon should be painted by the {@link ParameterizedPointPainter}.
 * Using a <code>ParameterizedPointStyle</code>, the icon is visualized using the following steps:
 * <ol>
 *  <li>The icon is translated based on {@link GenericParameterizedPointStyle.anchorX anchorX}
 *      and {@link GenericParameterizedPointStyle.anchorY anchorY}.
 *  <li>The icon is rotated based on this style's {@link GenericParameterizedPointStyle.rotation rotation} property.
 *  <li>A translation based on this style's
 *      {@link GenericParameterizedPointStyle.offsetX offsetX} and {@link GenericParameterizedPointStyle.offsetY offsetY}
 *      is applied.
 *  <li>In 3D, an additional view displacement translation might be applied, to avoid icons sticking in terrain.
 *         This view displacement is calculated automatically.
 * </ol>
 * @since 2017.0
 */
type ParameterizedPointStyle = UrlParameterizedPointStyle | ImageParameterizedPointStyle;
export { ParameterizedPointStyle };