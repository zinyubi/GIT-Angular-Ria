/**
 * A ColorMap represents an ordered collection of levels (Numbers) and associated colors.
 *
 * These levels could be anything.  For example, an altitude in meters, or a pressure in Pascal.
 *
 * The colors can be retrieved using {@link retrieveColor}. This function
 * returns the color at a given level. In case of a gradient color map, it will
 * interpolate the colors (including alpha).
 */
export declare class ColorMap {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * Retrieves the color at the given level.
   *
   * This method will respect the gradient or piece wise constant nature of this color map.
   * In case the color map is gradient, it will interpolate between the colors (including alpha).
   *
   * @param level The level for which to retrieve the color.
   *
   * @return {String} the color at the given level, as a CSS color string.
   *
   * @since 2024.0
   */
  retrieveColor(level: number): string;
}
/**
 * Create a gradient color map.
 * Colors corresponding to levels in the level range of the color map are linearly interpolated (including alpha) between entries.
 *
 * The example shows a ColorMap with 3 levels and 3 colors. The levels are mapped to colors as follows (level -> color):
 * <ul>
 * <li><b>]-inf, 100]</b> -> Black</li>
 * <li><b>]100,200[</b> -> Something between Black and Green (linearly interpolated)</li>
 * <li><b>200</b> -> Green</li>
 * <li><b>]200,300[</b> -> Something between Green and Blue (linearly interpolated)</li>
 * <li><b>[300, +inf[</b> -> Blue</li>
 * </ul>
 *
 * @param levelsToColorsMapping An array containing {level, color} entries (object literals).
 *        Levels are treated as <code>Number</code>s. Colors are CSS color strings.
 *        The first element is a level. Entries are expected to be sorted in ascending level order.
 *
 * ```javascript
 * var gradientColorMap = ColorMap.createGradientColorMap([
 *   {level: 100, color: "rgba(0, 0, 0, 1.0)"},   //100 -> Black
 *   {level: 200, color: "rgba(0, 255, 0, 1.0)"}, //200 -> Green
 *   {level: 300, color: "rgba(0, 0, 255, 1.0)"}  //300 -> Blue
 * ]);
 * ```
 */
declare function createGradientColorMap(levelsToColorsMapping: {
  level: number;
  color: string;
}[]): ColorMap;
/**
 * Create a piecewise constant color map.
 * Unlike a gradient color map, no colors are interpolated in a piecewise constant map.
 *
 * The example shows a ColorMap with 3 levels and 2 colors. The levels are mapped to colors as follows (level -> color):
 * <ul>
 * <li><b>]-inf, 100[</b> -> Black</li>
 * <li><b>[100, 200[</b> -> Black</li>
 * <li><b>[200, 300[</b> -> Green</li>
 * <li><b>[300, +inf[</b> -> Green</li>
 * </ul>
 *
 * @param levelsToColorsMapping An array with alternating level, color values in it.
 *        Levels should be <code>Number</code>s. Colors are represented as CSS color strings.
 *        The first element is a level. Elements are expected to be sorted in ascending level order.
 * ```javascript
 * var piecewiseConstantColorMap = ColorMap.createPiecewiseConstantColorMap(
 *    [100, "rgba(0, 0, 0, 1.0)", 200, "rgba(0, 255, 0, 1.0)", 300]);
 * ```
 */
declare function createPiecewiseConstantColorMap(levelsToColorsMapping: (number | string)[]): ColorMap;
export { createGradientColorMap, createPiecewiseConstantColorMap };