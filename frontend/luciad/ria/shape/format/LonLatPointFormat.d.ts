import { Point } from "../Point.js";
/**
 * Constructor options for {@link LonLatPointFormat}.
 */
export interface LonLatPointFormatConstructorOptions {
  /**
   * The pattern to use for formatting a point. Please refer to the class documentation for details.
   */
  pattern?: string;
  /**
   * The separator symbol between the integer part and the fraction part. Default value is "."
   */
  decimalSeparator?: string;
}
/**
 * Format for points. It allows you to format points from/to longitude latitude coordinates.
 * <p/>
 * The formatting of coordinates is determined by the pattern string that is passed to the constructor
 * of this class. The EBNF for the pattern syntax is
 * <pre>
 *   pattern     = lon, separator, lat | lat, separator, lon
 *   lon         = "lon(", axiscoord, ")"
 *   lat         = "lat(", axiscoord, ")"
 *   axiscoord   = axis, signcoord | signcoord, axis, signcoord
 *   signcoord   = sign, coord | coord
 *   coord       = degrees | degrees, minutes | degrees, minutes, seconds
 *   degrees     = ( "d" | "D" ), { digit }
 *   minutes     = ( "m" | "M" ), { digit }
 *   seconds     = ( "s" | "S" ), { digit }
 *   axis        = "a"
 *   digit       = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
 *   separator   = { ? any character ? }
 * </pre>
 *
 * <p/>
 *
 * The table below details the meaning of each pattern character
 * <table>
 * <tr><th>Symbol</th><th>Meaning</th><th>Example</th></tr>
 * <tr><td>d</td><td>Integer degrees</td><td>354</td></tr>
 * <tr><td>d&lt;n&gt;</td><td>Decimal degrees with &lt;n&gt; fractional digits</td><td>d5: 354.25435</td></tr>
 * <tr><td>D</td><td>Integer degrees with degrees symbol</td><td>354&#x00b0;</td></tr>
 * <tr><td>D&lt;n&gt;</td><td>Decimal degrees with degrees symbol and &lt;n&gt; fractional digits</td><td>D5:
 * 354.25435&#x00b0;</td></tr>
 * <tr><td>m</td><td>Integer minutes</td><td>54</td></tr>
 * <tr><td>m&lt;n&gt;</td><td>Decimal minutes with &lt;n&gt; fractional digits</td><td>m5: 54.25435</td></tr>
 * <tr><td>M</td><td>Integer minutes with minutes symbol</td><td>54'</td></tr>
 * <tr><td>M&lt;n&gt;</td><td>Decimal minutes with minutes symbol and &lt;n&gt; fractional digits</td><td>M5:
 * 54.25435'</td></tr>
 * <tr><td>s</td><td>Integer seconds</td><td>54</td></tr>
 * <tr><td>s&lt;n&gt;</td><td>Decimal seconds with &lt;n&gt; fractional digits</td><td>s5: 54.25435</td></tr>
 * <tr><td>S</td><td>Integer seconds with seconds symbol</td><td>54"</td></tr>
 * <tr><td>S&lt;n&gt;</td><td>Decimal seconds with seconds symbol and &lt;n&gt; fractional digits</td><td>S5:
 * 54.25435"</td></tr>
 * <tr><td>+</td><td>Coordinate sign. Results in a '-' if the coordinate is negative</td><td>-</td></tr>
 * <tr><td>a</td><td>Hemisphere indicator</td><td>N, S, E, W</td></tr>
 * </table>
 * <p/>
 * As an example, the default formatting pattern is "lat(+DMS),lon(+DMS)". This results in a format
 * that generates the latitude coordinate, a comma character and the longitude coordinate. Each coordinate
 * is prefixed with a sign followed by integer degrees, minutes, seconds including their respective
 * unit characters (i.e, &#x00b0;, ' and ").
 *
 * @since 2013.0
 */
declare class LonLatPointFormat {
  /**
   * Creates a new {@link LonLatPointFormat}
   * @param options parameters for the new {@link LonLatPointFormat}.
   */
  constructor(options?: LonLatPointFormatConstructorOptions);
  /**
   * Formats the given longitude/latitude coordinate pair as a String,
   * following the current pattern.
   *
   * @param longitudeOrPoint the longitude, expressed in degrees or the point to format
   * @param latitude the latitude, expressed in degrees (between -90 and 90).
   * @return the formatted String.
   */
  format(longitudeOrPoint: number | Point, latitude?: number): string;
  /**
   * Formats the given latitude coordinate as a String, following the current pattern.
   * @param latitude the latitude, expressed in degrees (between -90 and 90).
   * @return the formatted String.
   */
  formatLat(latitude: number): string;
  /**
   * Formats the given longitude coordinate as a String, following the current pattern.
   *
   * @param longitude the longitude, expressed in degrees.
   * @return the formatted String.
   */
  formatLon(longitude: number): string;
}
export { LonLatPointFormat };