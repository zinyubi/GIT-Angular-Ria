import { FeaturePainter } from "./FeaturePainter.js";
/**
 * Styling options for {@link addSelection} and {@link addHover}.
 * @since 2021.0
 */
export interface StyleMutationOptions {
  /**
   * The stroke color that must be used for the activated feature.
   * <p>The default value for {@link addSelection} is <code>rgb(255,140,0)</code>.</p>
   * <p>The default value for {@link addHover} is <code>rgb(0,140,255)</code>.</p>
   */
  strokeColor?: string;
  /**
   * Modifier for a feature's stroke width when it becomes activated.
   * <p>The default value for {@link addSelection} is 2.</p>
   * <p>The default value for {@link addHover} is 1.5.</p>
   */
  strokeWidthScaleFactor?: number;
  /**
   * The fill color that must be used for the selected feature.
   * <p>The default value for {@link addSelection} is <code>rgba(255,165,0,0.8)</code>.</p>
   * <p>The default value for {@link addHover} is <code>rgba(0,165,255,0.8)</code>.</p>
   */
  fillColor?: string;
  /**
   * Modifier for an icon's scale when it becomes selected.
   * <p>The default value for {@link addSelection} is 2.</p>
   * <p>The default value for {@link addHover} is 1.5.</p>
   */
  iconScaleFactor?: number;
  /**
   * The color of the text halo for labels. Halos are not supported on IE9.
   * <p>The default value for {@link addSelection} is <code>rgb(255,140,0)</code>.</p>
   * <p>The default value for {@link addHover} is <code>rgb(0,140,255)</code>.</p>
   */
  textHaloColor?: string;
}
/**
 * @module Utility functions for {@link FeaturePainter}.
 */
/**
 * Adds selection styling behavior to an existing painter.
 *
 * <p>
 * The paintBody method is altered to apply the following styling modifications to
 * selected {@link Feature} instances.  Note that you can override
 * this behavior using the options object literal.
 * <ul>
 *   <li>
 *     If a stroke was defined on the original styling object literal, the stroke color
 *     is modified to <code>rgb(255,140,0)</code>.
 *   </li>
 *   <li>
 *     The stroke width is doubled.
 *   </li>
 *   <li>
 *     If a fill was defined on the original styling object, the fill color is modified to
 *     <code>rgba(255,165,0,0.8)</code>.
 *   </li>
 *   <li>
 *     In case of icon styles, the icon is scaled to double the originally configure size.
 *   </li>
 *   <li>
 *     If text is rendered on the {@link GeoCanvas}, it's
 *     <code>strokeWidth</code> is doubled. If the text was not originally stroked, it is
 *     stroked with <code>rgb(255,140,0)</code>.
 *   </li>
 * </ul>
 * </p>
 *
 * <p>
 * The paintLabel method is altered. It configures a halo with color
 * <code>rgb(255,140,0)</code> and width 2 to the label.  The color can be overridden using
 * the options object literal.
 * </p>
 *
 * @param painter The painter which must be enhanced with selection support.
 * @param options selection styling options.
 * @return {FeaturePainter} The enhanced painter passed to this method.
 */
export declare function addSelection<T extends FeaturePainter>(painter: T, options?: StyleMutationOptions): T;
/**
 * Adds hover styling behavior to an existing painter.
 *
 * <p>
 * The paintBody method is altered to apply the following styling modifications to
 * hovered {@link Feature} instances. Note that you can override
 * this behavior using the options object literal.
 * <ul>
 *   <li>
 *     If a stroke was defined on the original styling object literal, the stroke color
 *     is modified to <code>rgb(0,140,255)</code>.
 *   </li>
 *   <li>
 *     The stroke width is multiplied by 1.5.
 *   </li>
 *   <li>
 *     If a fill was defined on the original styling object, the fill color is modified to
 *     <code>rgba(0,165,255,0.8)</code>.
 *   </li>
 *   <li>
 *     In case of icon styles, the icon is scaled to 1.5 times the originally configure size.
 *   </li>
 *   <li>
 *     If text is rendered on the {@link GeoCanvas}, it's
 *     <code>strokeWidth</code> is multiplied by 1.5. If the text was not originally stroked, it is
 *     stroked with <code>rgb(0,140,255)</code>.
 *   </li>
 * </ul>
 * </p>
 *
 * <p>
 * The paintLabel method is altered. It configures a halo with color
 * <code>rgb(0,140,255)</code> and width 2 to the label. The color can be overridden using
 * the options object literal.
 * </p>
 *
 * @param painter The painter which must be enhanced with hover support.
 * @param options hover styling options.
 * @return {FeaturePainter} The enhanced painter passed to this method.
 * @since 2021.0
 */
export declare function addHover<T extends FeaturePainter>(painter: T, options?: StyleMutationOptions): T;