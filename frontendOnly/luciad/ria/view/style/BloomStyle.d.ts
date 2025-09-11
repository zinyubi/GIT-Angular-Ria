/**
 * With a <code>BloomStyle</code>, you add a {@link BloomEffect} to a shape.
 * While {@link BloomEffect} defines global bloom properties, you can change the bloom of individual shapes with <code>BloomStyle</code>.
 *
 * <p>You can see the effect of bloom on a <code>WebGLMap</code> only.</p>
 *
 * @since 2022.1
 */
export interface BloomStyle {
  /**
   * The intensity is a non-negative factor applied to the regular color to increase the color's intensity.
   * The more intense a color, the more bloom it produces.
   *
   * Note that styling a shape with a <code>BloomStyle</code> intensity of 0 results in a low-intensity bloom effect.
   * It is not the same as not using a <code>BloomStyle</code>.
   *
   * @default <code>1</code>
   */
  intensity?: number;
}