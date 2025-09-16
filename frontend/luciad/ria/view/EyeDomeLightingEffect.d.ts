/**
 * </p>
 * Eye-dome lighting (EDL) is a non-photorealistic lighting model, which helps accentuate the shapes of different objects to improve depth perception, by shading their outlines.
 * </p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="1000"><img src="media://effects/effects_edl.png" alt="Eye-dome lighting" width="1000"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Left: eye-dome lighting disabled, Right: eye-dome lighting enabled</td>
 *   </tr>
 * </table>
 * </p>
 * Technically, the lighting model applies a shade to each pixel, based on the depth difference between that pixel and its surrounding pixels.
 * The EDL technique uses 3 properties:
 * <ul>
 *   <li>the {@link window} property defines how many surrounding pixels must be taken into account.</li>
 *   <li>the {@link strength} property is a factor to multiply with the shading that is applied to the image. A value between 0 and 1 will soften the shade, a value higher than 1 will harden the shade.
 *   <li>the {@link color} property defines what color the shade will have.
 * </ul>
 * </p>
 * See also <a href="articles://howto/view/webgl_map_effects.html#webgl_eyedomelighting">Configuring WebGL Map effects</a>.
 * </p>
 * <h4>Example</h4>
 *
 * ```javascript
 *   map.effects.eyeDomeLighting = {
 *     window: 2,
 *     strength: 0.5
 *   }
 * ```
 *
 * <p/>
 * EDL only has an effect on 3D <code>WebGLMap</code>s.
 * It has no effect on transparent data.
 * <p/>
 * @since 2020.0
 */
export interface EyeDomeLightingEffect {
  /**
   * The EDL window defines how many surrounding pixels will be taken into account.
   *
   * @default 2
   */
  window?: number;
  /**
   * The EDL strength is a factor to make the shading effect more or less pronounced.
   * A value between 0 and 1 will soften the shade, a value greater than 1 will harden the shade.
   *
   * @default 1
   */
  strength?: number;
  /**
   * The EDL color defines the color of the shade.
   * <p/>
   * Note that the alpha component of the color is ignored so the color will be fully opaque.
   * <p/>
   *
   * @default rgb(0, 0, 0)
   */
  color?: string;
}