import { BloomStyle } from "./BloomStyle.js";
import { UnitOfMeasure } from "../../uom/UnitOfMeasure.js";
/**
 * A <code>FillStyle</code> describes how an object should be filled. If the <code>FillStyle</code>
 * doesn't have one of the following properties, it is considered as an empty fill.
 * @since 2013.0
 */
export interface FillStyle {
  /**
   * The fill color as a CSS color string. For example <code>"rgb(125, 125, 125)"</code> or
   * <code>"rgba(125, 125, 125, 0.5)"</code>.
   *
   * <p>When an url or image and the fill color are specified, the fill color will be used
   * as fallback fill when the image cannot be loaded.</p>
   */
  color?: string;
  /**
   * Adds a {@link BloomEffect} to the fill.
   *
   * Bloom is only supported on WebGL maps.
   *
   * @since 2022.1
   */
  bloom?: BloomStyle;
  /**
   * A URL referring to an image resource which will be used as fill. For example <code>"resources/img/hatch.png"</code>. This property
   * cannot be combined with the <code>image</code> property.
   *
   * <p>When an url or image and the fill color are specified, the fill color will be used
   * as fallback fill when the image cannot be loaded.</p>
   */
  url?: string;
  /**
   * An Image or Canvas DOM element which will be used as fill. For example the
   * {@link HatchedImageBuilder} class can be
   * used to create such an image. This property
   * cannot be combined with the <code>url</code> property.
   *
   * <p>When an url or image and the fill color are specified, the fill color will be used
   * as fallback fill when the image cannot be loaded.</p>
   */
  image?: HTMLImageElement | HTMLCanvasElement;
  /**
   * The opacity of the image, determines how transparent an image will be painted. It's a numeric value between 0 and 1.
   * 0 indicates that the image will be painted completely transparent and 1 indicates that the original image of the icon will be used.
   *
   * <p>
   *   This parameter is only relevant when you are using an image through either the `FillStyle#url` or the `FillStyle#image` properties.
   *   If you are use using the `FillStyle#color` property, the opacity from the specified color will be used instead.
   * </p>
   *
   * By default 1 is used if not set.
   */
  opacity?: number;
  /**
   * The rotation of the image, specified in degrees. The default is 0, which implies no rotation.
   * Rotations are applied in a clock-wise fashion. Rotation of the image happens around its center point.
   *
   * <p>
   *   This parameter is only relevant when you are using an image through either the `FillStyle#url` or the `FillStyle#image` properties.
   * </p>
   *
   * By default 0 is used if not set.
   */
  rotation?: number;
  /**
   * The target width of the image, with a given unit of measure.
   *
   * This can be either percentage, pixels or a length unit.
   * For example: "16px", "50%" or "25.2m".
   * Valid length units are {@link UnitOfMeasure uom}s
   * {@link getUnitOfMeasure registered in LuciadRIA}.
   * The default is "100%", which implies that the image is painted at its original resolution.
   *
   * If this is a number, the width is interpreted in the units defined by {@link uom}.
   * If no {@link uom} is set, the height is interpreted in pixels.
   *
   * You cannot mix world lengths and pixels for width and {@link height}.
   * If width is expressed in a length unit, {@link height} must be as well (and vice-versa).
   *
   * By default "100%" is used if not set
   */
  width?: string | number;
  /**
   * The target height of the image, with a given unit of measure.
   *
   * This can be either percentage, pixels or a length unit.
   * For example: "16px", "50%" or "25.2m".
   * Valid length units are {@link UnitOfMeasure uom}s
   * {@link getUnitOfMeasure registered in LuciadRIA}.
   * The default is "100%", which implies that the image is painted at its original resolution.
   *
   * If this is a number, the height is interpreted in the units defined by {@link uom}.
   * If no {@link uom} is set, the height is interpreted in pixels.
   *
   * You cannot mix world lengths and pixels for height and {@link width}.
   * If height is expressed in a length unit, {@link width} must be as well (and vice-versa).
   */
  height?: string | number;
  /**
   * <p>
   * Whether the image should be requested with authentication parameters. Setting this to true is required when the server requires cookies, basic http authentication. This flag should be set to false if
   * the server is configured to allow cross-origin requests from all hosts. Such servers reject all authenticated requests.
   * </p>
   * <p>
   *   This parameter is only relevant when you are using the `FillStyle#url` property to request images. If you use the image using the `FillStyle#image` property, the credentials are automatically handled by the browser.
   * </p>
   *
   * By default <code>false</code> is used if not set
   */
  credentials?: boolean;
  /**
   * Determines the interpretation of units for {@link FillStyle.height height} .
   * When set to a length unit of measure (meters, feet,...), image fills will grow and shrink as you zoom the map in and out.
   *
   * <p>
   *  For georeferenced maps, supported UnitOfMeasures are:
   *  <ul>
   *   <li><code>getUnitOfMeasure("Pixels")</code></li>
   *   <li><code>UnitOfMeasure of type getQuantityKind("Length")</code>, for example getUnitOfMeasure("Meter")</li>
   *  </ul>
   * </p>
   * <p>
   *  The unit of measure applies to
   *  {@link FillStyle.height height}.
   *  The <code>uom</code> determines the interpretation of the values as pixels or as a length unit that represents
   *  the actual size of real-world objects, like for example meter or foot.
   * </p>
   * <p>
   *  The <code>uom</code> property is only supported on geographically referenced maps.
   *  Maps configured with a {@link createCartesianReference cartesian reference} do
   *  not support <code>FillStyle</code>s with a <code>uom</code> set.
   * </p>
   * <p>The property is optional and the default value is the Pixel unit.</p>
   *
   * @since 2023.0
   */
  uom?: UnitOfMeasure;
}