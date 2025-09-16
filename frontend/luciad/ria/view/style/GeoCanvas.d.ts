import { Shape } from "../../shape/Shape.js";
import { ShapeStyle } from "./ShapeStyle.js";
import { IconStyle } from "./IconStyle.js";
import { Icon3DStyle } from "./Icon3DStyle.js";
import { TextStyle } from "./TextStyle.js";
import { Point } from "../../shape/Point.js";
import { PanoramaStyle } from "./PanoramaStyle.js";
import { PanoramaContext } from "../../model/tileset/PanoramaContext.js";
/**
 * A high-level geographic feature rendering canvas.
 */
export interface GeoCanvas {
  /**
   * Draws an icon at the location specified by the shape parameter using the giving styling parameters.
   *
   * @param shape the shape to draw.
   * @param iconStyle an object containing styling properties
   */
  drawIcon(shape: Shape, iconStyle: IconStyle): void;
  /**
   * Draws a 3d icon at the location specified by the shape parameter using the giving styling parameters.
   *
   * @param shape the shape to draw
   * @param iconStyle an object containing styling properties
   */
  drawIcon3D(shape: Shape, iconStyle: Icon3DStyle): void;
  /**
   * Draws the given shape using the given styling parameters.
   *
   * @param shape the shape to draw. This shape can be of type:
   * <code>POLYLINE</code>, <code>POLYGON</code>, <code>CIRCLE_BY_3_POINTS</code>, <code>CIRCLE_BY_CENTER_POINT</code>,
   * <code>ELLIPSE</code>, <code>ARC</code>, <code>CIRCULAR_ARC_BY_3_POINTS</code>, <code>CIRCULAR_ARC_BY_BULGE</code>,
   * <code>CIRCULAR_ARC_BY_CENTER_POINT</code>, <code>ARC_BAND</code>, <code>SECTOR</code>, <code>COMPLEX_POLYGON</code>,
   * <code>SHAPE_LIST</code>, <code>BOUNDS</code> or <code>ORIENTED_BOX</code> </br>
   *
   * <p>To draw a shape of type <code>POINT</code> please use {@link drawIcon} or {@link drawIcon3D}</p>
   * <p>Note: a {@link Point} shape passed to this method will be always drawn as a blue dot.</p>
   * @param style an object containing styling properties
   */
  drawShape(shape: Shape, style: ShapeStyle): void;
  /**
   * Draws the given text string at the location specified by the shape parameter.
   *
   * @param shape the focus point of the shape will be used to position the text
   * @param text the text string to draw
   * @param style an object containing styling properties for the text.
   */
  drawText(shape: Shape, text: string, style: TextStyle): void;
  /**
   * Draws a panoramic image at the specified location, using the specified rotation.
   *
   * <p>
   * LuciadRIA identifies a single panoramic tileset using the <code>context</code> object.
   * If any of the properties of this object change, LuciadRIA will load new tiles for that panoramic.
   * </p>
   *
   * @param location The sensor location of the panoramic image, ie. the center of the image.
   * @param style    Styling options for this panoramic image. Defaults to a style with opacity 1.
   * @param context  An object that provides context to the `drawPanoramic` calls.
   *                 This context object is passed to {@link PanoramaModel.getPanoramicImage}.
   *                 You decide what this object looks like, and how you use it in {@link PanoramaModel.getPanoramicImageURL}.
   *                 The context object uniquely identifies a single panoramic image tileset.
   *                 It is used to differentiate between different {@link GeoCanvas.drawPanorama drawPanorama} calls.
   *                 The keys of this object should be strings, and the values strings or numbers.
   *                 Complex object structures (nested objects) are not allowed.
   *                 By default, the context is <code>null</code>.
   *                 Example usages:
   *                    <ul>
   *                      <li>Identify the panoramic image tileset, for example:
   *                      ```
   *                      const context = {id: feature.id};
   *                      ```
   *                      </li>
   *                      <li>Identify the sub-shape of the feature (e.g. the index of a point in a point list).</li>
   *                      <li>Request a different image, for the same feature (e.g. a panoramic image at a different timestamp, or a different style)</li>
   *                    </ul>
   *
   * @since 2020.1
   */
  drawPanorama(location: Point, style?: PanoramaStyle, context?: PanoramaContext): void;
}