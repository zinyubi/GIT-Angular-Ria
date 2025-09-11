import { LineStyle } from "../style/LineStyle.js";
import { TextStyle } from "../style/TextStyle.js";
/**
 * Specifies properties of an axis. It is an object literal in which all properties are optional.
 * @since 2013.0
 */
export interface AxisConfiguration {
  /**
   * The line style of the axis.
   */
  axisLineStyle?: LineStyle;
  /**
   * Indicates whether a measuring tick should be extended as a grid line over the map. The default is <code>false</code>.
   */
  gridLine?: boolean;
  /**
   * A formatter function. It must map a single  numerical value to a string.
   *
   * ```javascript
   * var axisConfiguration = {
   *    labelFormatter: function(n){
   *      return n.toString();
   *    }
   * };
   * ```
   */
  labelFormatter?: (value: number) => string;
  /**
   * The rotation of the label in degrees. The rotation point is the anchor point of the label.
   * You can specify the anchor point of the label using the <code>labelStyle</code> property of this configuration object.
   * Describe the horizontal component of the anchor point with the <code>textAnchor</code> property
   * and the vertical component with the <code>alignmentBaseline</code> property.
   * The rotation is clockwise.
   */
  labelRotation?: number;
  /**
   * The style of the labels. A label will be drawn at each measuring tick.
   * The default anchor point of the label is in the middle for the X-axis (alignmentBaseline='top' and textAnchor='center'),
   * and at the end for the Y-axis (alignmentBaseline='middle' and textAnchor='end').
   */
  labelStyle?: TextStyle;
  /**
   * A configuration object indicating how ticks should be spaced alongside the axis. It is an object literal
   * consisting of 2 properties.
   *  <ul>
   *    <li><em>{Number}</em> <strong>minimumTickSpacing</strong>: the minimum amount of pixels that should be present between two measuring ticks. Note that this is an approximate. The
   *    actual amount of pixels between two measuring ticks may vary according to the current scale of the map and to the <code>mapSpacing</code> parameter</li>
   *    <li><em>{Array}</em> <strong>mapSpacing</strong>: an array of allowed distances, expressed in the unit of measure of the axis.
   *    Depending on the value of <code>minimumTickSpacing</code> the most appropriate value will be selected.
   *    </li>
   *  </ul>
   *
   *  ```javascript
   *  //the ticks will be spaced at least 200 pixels apart on the screen.
   *  //The spacing in map coordinates will be one of the allowed values in the array.
   *  //Note that both values specify only approximately how far measuring ticks will be apart.
   *  //If no match can be made that satisfies both constraints, the closest map spacing possible will be used.
   *
   *  var axisConfiguration = {
   *    spacing: {
   *      minimumTickSpacing: 200,
   *      mapSpacing: [1,5,10,50,100,500,1000,5000,10000,50000,100000,500000,1000000,5000000,10000000]
   *    }
   *  };
   * ```
   */
  spacing?: {
    minimumTickSpacing: number;
    mapSpacing: number[];
  };
  /**
   * The size of the sub ticks.
   */
  subTickLength?: number;
  /**
   * The number of smaller ticks in between the main measuring ticks. These are not labeled.
   */
  subTicks?: number;
  /**
   * The size of the measuring tick drawn on the axis
   */
  tickLength?: number;
  /**
   * The line style of the axis ticks (at each measuring tick).  This line style will also be applied to the
   * grid lines, which can be turned on by configuring
   * the {@link gridLine} property.
   */
  tickLineStyle?: LineStyle;
}