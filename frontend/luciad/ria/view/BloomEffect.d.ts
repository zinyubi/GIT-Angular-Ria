/**
 * A <code>BloomEffect</code> allows you to configure the bloom effect of shapes styled with a {@link BloomStyle} on a WebGLMap.
 *
 * <p>Bloom is a way to convey intense brightness to the viewer by adding a glow to the bright object.
 * The light then bleeds around these bright areas. This creates the illusion that they are intensely bright.
 * This effect can greatly add to the perceived realism of a scene.
 * It can also for example be used to draw focus to certain shapes.</p>
 *
 * </p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="1000"><img src="media://effects/effects_bloom.png" alt="Bloom" width="1000"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Left: Using a color to highlight an area, Right: Using bloom to highlight an area</td>
 *   </tr>
 * </table>
 * </p>
 *
 * The <code>BloomEffect</code> uses 2 properties:
 * <ul>
 *   <li>the {@link strength} property defines how intense the bloom should be.</li>
 *   <li>the {@link radius} property determines whether the bloom is more focused (values close to 0) or more spread out (values close to 1).
 * </ul>
 *
 * <p>Bloom only has an effect on <code>WebGLMap</code>s.</p>
 *
 * <h4>Example</h4>
 *
 * ```javascript
 *   map.effects.bloom = {
 *     strength: 3,
 *     radius: 0
 *   };
 * ```
 *
 * @since 2022.1
 */
export interface BloomEffect {
  /**
   * The strength is a non-negative number to make the bloom effect more or less pronounced.
   *
   * @default <code>1</code>
   */
  strength?: number;
  /**
   * The radius is a value between 0 and 1, inclusive, that determines how focused or spread out the bloom effect should be.
   * Lower values produce a more concentrated bloom.  Higher values produce a more diffuse bloom.
   *
   * @default <code>0.5</code>
   */
  radius?: number;
  /**
   * The threshold is a non-negative number that, if set, will cause any pixel more bright than the threshold to bloom.
   * This is in addition to all shapes styled with a {@link BloomStyle}.
   * If threshold is not set or null, only the shapes styled with a {@link BloomStyle} will bloom.
   *
   * A typical value is 1.  In most cases only objects styled with {@link PBRSettings PBR shading} will produce sufficiently bright pixels.
   *
   * @default <code>null</code>
   */
  threshold?: number | null;
}