import { LineStyle } from "./LineStyle.js";
/**
 * Base interface for a border icon style.
 */
export interface GenericBorderIconStyle {
  /**
   * The x coordinate of the anchor for this icon. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "50%", which implies that the anchor-point is at the center of the image.
   * <p> The anchor is always defined with respect to the original image size. This means that a scaled image will automatically
   * have its anchor-point scaled.</p>
   * <p>The horizontal anchorpoint is always defined from left to right. <code>{ anchorX:"0px" }</code> is the left of the image, and positive values
   * are points to the right.</p>
   */
  anchorX?: string;
  /**
   * The y coordinate of the anchor for this icon. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "50%", which implies that the anchor-point is at the center of the image.
   * <p> The anchor is always defined with respect to the original image size. This means that a scaled image will automatically
   * have its anchor-point scaled.</p>
   * <p>The vertical anchorpoint is always defined from top to bottom. <code>{ anchorY:"0px" }</code> is the top of the image, and positive values
   * are points to the bottom.</p>
   *
   */
  anchorY?: string;
  /**
   * The target height of the image, with a given unit of measure. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "100%", which implies that the icon is painted at its original resolution.
   */
  height?: string;
  /**
   * The X offset in pixels that should be applied with respect to the location of the point. This offset is applied after rotation and
   * does not take into account any scaling performed on the image. The default is 0, which means that the icon is painted at its anchor-point.
   */
  offsetX?: number;
  /**
   * The Y offset in pixels that should be applied with respect to the location of the point. This offset is applied after rotation and
   * does not take into account any scaling performed on the image. The default is 0, which means that the icon is painted at its anchor-point.
   */
  offsetY?: number;
  /**
   * The rotation of the icon, specified in degrees. The default is 0, which implies no rotation to the original icon. Rotations are
   * applied in a clock-wise fashion. Rotation of the icon happens around its anchor-point.
   */
  rotation?: number;
  /**
   * The line-style of a line which connects the border with the position of the feature on the map, using a perpendicular line.
   */
  stem?: LineStyle;
  /**
   * The target width of the image, with a given unit of measure. This can be either percentage or pixels. Example: "16px", or "50%". The default
   * is "100%", which implies that the icon is painted at its original resolution.
   */
  width?: string;
  /**
   * The Z-order of this shape. Shapes will be painted from lowest to highest Z-order, so that shapes with a higher
   * Z-order are painted on top of shapes with a lower Z-order. The default value is 0.
   */
  zOrder?: number;
}
/**
 * A border icon style that uses an Image or Canvas DOM element.
 */
export interface ImageBorderIconStyle extends GenericBorderIconStyle {
  /**
   * An Image or Canvas DOM element.
   */
  image: HTMLImageElement | HTMLCanvasElement;
}
/**
 * A border icon style where a URL refers to an image resource.
 */
export interface UrlBorderIconStyle extends GenericBorderIconStyle {
  /**
   * A URL referring to an image resource For example <code>http://www.example.com/image.png</code>.
   */
  url: string;
}
/**
 * An style that describes how an icon should be painted on a {@link BorderGeoCanvas}
 */
export type BorderIconStyle = ImageBorderIconStyle | UrlBorderIconStyle;