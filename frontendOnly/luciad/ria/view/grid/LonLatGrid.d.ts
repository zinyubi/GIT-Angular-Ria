import { LonLatPointFormat } from "../../shape/format/LonLatPointFormat.js";
import { LabelPosition } from "./LabelPosition.js";
import { TextStyle } from "../style/TextStyle.js";
import { LineStyle } from "../style/LineStyle.js";
import { Grid } from "./Grid.js";
/**
 * Represents the grid origin.
 */
export interface LonLatGridOrigin {
  /**
   * The longitude of the grid origin. When specified, the latitude origin must be specified as well.
   */
  originLon: number;
  /**
   * The latitude of the grid origin. When specified, the longitude origin must be specified as well.
   */
  originLat: number;
}
/**
 * A longitude-latitude grid. This class contains specific information about the grid,
 * such as the increment between grid lines and various options for styling and labeling. To paint
 * this grid on a map, create a new {@link GridLayer} with an object of this
 * class as input.
 * @since 2013.0
 */
declare class LonLatGrid extends Grid {
  /**
   * <p>Constructs a new <code>LonLatGrid</code>. The constructor parameters determine how many grid lines are drawn
   * for each scale. This cannot be changed afterwards.</p>
   *
   * <p>The creation of an example grid where the density of the grid lines increases when you zoom in is shown below:</p>
   *
   * ```javascript
   *   var settings=[];
   *   settings.push( {scale: 2.0E-8 * 4, deltaLon:  1, deltaLat:  1 });
   *   settings.push( {scale: 2.0E-8    , deltaLon:  5, deltaLat:  5 });
   *   settings.push( {scale: 9.0E-9    , deltaLon: 10, deltaLat: 10 });
   *   settings.push( {scale: 5.0E-9    , deltaLon: 20, deltaLat: 20 });
   *   settings.push( {scale: 0         , deltaLon: 45, deltaLat: 45 });
   *
   *   var grid = new LonLatGrid( settings );
   * ```
   *
   * <p>This will for example show a grid line every 20 degrees longitude and every 20 degrees latitude for all
   * scales between 5.0E-9 and 9.0E-9.</p>
   *
   * <p>By default the grid origin is located at (0,0). Optionally, you can specify a new origin as well.</p>
   *
   * ```javascript
   *   var grid = new LonLatGrid( settings, {originLon: 10, originLat: 10} );
   * ```
   *
   * @param gridSettings An array of {@link LonLatGrid.Settings} specifying which grid lines
   * should be drawn at each scale level.
   * @param [options] defines the grid origin
   */
  constructor(gridSettings: LonLatGrid.Settings[], options?: LonLatGridOrigin);
  /**
   * The different scales which were passed in the constructor.
   */
  get scales(): number[];
  /**
   * The longitude of the grid origin.
   */
  get originLon(): number;
  /**
   * The latitude of the grid origin.
   */
  get originLat(): number;
  /**
   * <p>The style which will be used for scales which do not define their own style. If you want to modify the fallback
   * style, you should replace this instance and not modify the existing instance.</p>
   *
   * <p>Defining a style for a specific scale can be done using the {@link setStyle}
   * method.</p>
   * <p>
   * When this is not set, a default fallback style is used. The default style configuration may change over time,
   * so it is encouraged to set this property explicitly.
   * </p>
   * <p>
   * Null values are not allowed. To turn off the grid, you can always
   * {@link GridLayer.setPaintRepresentationVisible} set the paint representations to <code>false</code>.
   * </p>
   */
  get fallbackStyle(): LonLatGrid.StyleSettings;
  set fallbackStyle(style: LonLatGrid.StyleSettings);
  /**
   * Return the longitude line increment at the specified scale.
   * @param scaleIndex The index of the scale. Must be an index of the <code>this.scales</code> array.
   * @return The longitude line increment.
   */
  getDeltaLon(scaleIndex: number): number;
  /**
   * Return the latitude line increment at the specified scale.
   * @param scaleIndex The index of the scale. Must be an index of the <code>this.scales</code> array.
   * @return The latitude line increment.
   */
  getDeltaLat(scaleIndex: number): number;
  /**
   * <p>Sets the style which needs to be used for the specified scale.</p>
   *
   * <p>Once a style is set, the style object should no longer be modified. If you want to modify the
   * style for a certain scale afterwards, call this method again with the new/modified style instance.</p>
   *
   * <p>All scales for which no style is specified will be visualized using the fallback style.</p>
   * @param  scaleIndex The index of the scale. Must be a valid index in the <code>this.scales</code> array.
   * @param  style The style
   */
  setStyle(scaleIndex: number, style: LonLatGrid.StyleSettings): void;
  /**
   * <p>Returns the style which will be used to visualize the grid lines at the specified scale.</p>
   *
   * <p>You should not modify the <code>StyleSettings</code> instance returned by this method. If you want
   * to modify the style for a certain scale, use the {@link setStyle}
   * method to replace the style instance.</p>
   * @param scaleIndex The index of the scale. Must be a valid index in the {@link scales}
   * array.
   * @returns The style for the specified scale. Will return
   * <code>null</code> when no style was specified for that scale.
   */
  getStyle(scaleIndex: number): LonLatGrid.StyleSettings | null;
}
declare namespace LonLatGrid {
  /**
   * Object which describes the spacing between two consecutive grid lines for a specific map scale. Consult the documentation
   * of the {@link LonLatGrid} constructor for more information.
   */
  interface Settings {
    /**
     * The latitude distance between two consecutive grid lines, expressed in degrees.
     */
    deltaLat: number;
    /**
     * The longitude distance between two consecutive grid lines, expressed in degrees.
     */
    deltaLon: number;
    /**
     * <p>The scale of the map.</p>
     *
     * <p>The scale parameter is a cartographic scale, which is the ratio of a distance on the screen to a distance in the real world. The
     * specified settings are used for all scales smaller than the specified scale (so for more 'zoomed out' than the specified
     * scale. This means that using zero as scale will apply the settings for all zoom levels.</p>
     */
    scale: number;
  }
  /**
   * Describes the style which will be used to visualize the grid.
   */
  interface StyleSettings {
    /**
     * Setting which determines whether the grid should be labeled or not.
     */
    labeled?: boolean;
    /**
     * The {@link LonLatPointFormat} that is used for formatting the grid labels
     */
    labelFormat?: LonLatPointFormat;
    /**
     * Indicates how the grid line should be labeled.
     */
    labelPosition?: LabelPosition;
    /**
     * The {@link TextStyle} which will be used to draw the longitude/latitude labels. The stroke properties of
     * the {@link TextStyle} are ignored on a WebGLMap.
     */
    labelStyle?: TextStyle;
    /**
     * The style used to draw the grid lines.
     */
    lineStyle?: LineStyle;
    /**
     * The {@link LonLatPointFormat} that is used for formatting the grid labels for the lines that pass through the
     * origin
     */
    originLabelFormat?: LonLatPointFormat;
    /**
     * The {@link TextStyle} which will be used to draw the longitude/latitude labels for the lines that pass through
     * the origin. The stroke properties of the {@link TextStyle} are ignored on a WebGLMap.
     */
    originLabelStyle?: TextStyle;
    /**
     * The style used to draw the longitude and latitude line that pass through the origin.
     */
    originLineStyle?: LineStyle;
  }
}
export { LonLatGrid };