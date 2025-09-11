/**
 * A <code>TileData</code> javascript object literal contains the data of an imagery tile and has the necessary
 * metadata properties to process the data.
 *
 * Tile data can be one of the following options:
 *
 * <ul>
 *   <li>HTML5 Image</li>
 *   <li>Compressed image (e.g. png)</li>
 *   <li>Raw uncompressed image</li>
 * </ul>
 *
 * Depending on the type of data, the properties on this object literal are mandatory or ignored. The following table
 * gives an overview of which properties are mandatory in each case.
 * <p/>
 *
 * <table border="1">
 *  <tr>
 *    <th>Use case</th>
 *    <th>data</th>
 *    <th>mimeType</th>
 *    <th>pixelFormat</th>
 *    <th>width/height</th>
 *  </tr>
 *  <tr>
 *    <td>HTML5 Image</td>
 *    <td>Must be an <code>Image<code> object.</td>
 *    <td>Not Allowed</td>
 *    <td>Not Allowed</td>
 *    <td>Not Allowed</td>
 *  </tr>
 *  <tr>
 *    <td>Compressed image</td>
 *    <td>Must be an <code>ArrayBuffer<code> containing the bytes of the compressed image.</td>
 *    <td>Mandatory</td>
 *    <td>Not Allowed</td>
 *    <td>Not Allowed</td>
 *  </tr>
 *  <tr>
 *    <td>Raw uncompressed image</td>
 *    <td>Must be an <code>ArrayBuffer<code> of which the bytes match the pixel format.</td>
 *    <td>Not Allowed</td>
 *    <td>Mandatory</td>
 *    <td>Mandatory</td>
 *  </tr>
 * </table>
 * <p/>
 * <p/>
 * Examples:
 *
 * ```javascript
 * var html5ImageTileData = {
 *  data: Image
 * }
 * ```
 * </p>
 * ```javascript
 * var pngTileData = {
 *  data: arrayBuffer,
 *  mimeType: "image/png"
 * }
 * ```
 * </p>
 * ```javascript
 * var rgbaTileData = {
 *  data: arrayBuffer,
 *  pixelFormat: PixelFormat.RGB_888,
 *  width: 256,
 *  height:256
 * }
 * ```
 * </p>
 *
 */
import { PixelFormat } from "./PixelFormat.js";
export interface TileData {
  /**
   * The data for a tile can be either an <code>ArrayBuffer</code> or an <code>Image</code>.
   * It is mandatory to set this property to a valid value.
   */
  data: ArrayBuffer | HTMLImageElement;
  /**
   * Defines the mime type for the data set luciad.model.tileset.TileData#data.
   * Must be set when {@link data} is an <code>ArrayBuffer</code> containing an encoded image.
   * It may not be set when the <code>ArrayBuffer<code> contains uncompressed raw bit values.
   **/
  mimeType?: string;
  /**
   * Defines the pixel format of a raw image.
   * This property must be set when {@link data} is an <code>ArrayBuffer</code> containing raw
   * pixel values. In other cases this property is ignored.
   */
  pixelFormat?: PixelFormat;
  /**
   * Defines the width of the tile data in pixels.
   * Must be set when {@link data} is an <code>ArrayBuffer</code> containing raw
   * pixel values. In other cases this property is ignored.
   */
  width?: number;
  /**
   * Defines the height of the tile data in pixels.
   * Must be set when {@link data} is an <code>ArrayBuffer</code> containing raw
   * pixel values. In other cases this property is ignored.
   */
  height?: number;
}