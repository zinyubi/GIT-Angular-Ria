/**
 * Constructor options for {@link LightScatteringAtmosphere}.
 *
 * @since 2020.1
 */
export interface LightScatteringAtmosphereConstructorOptions {
  /**
   * @see {@link LightScatteringAtmosphere.affectsTerrain}
   */
  affectsTerrain?: boolean;
  /**
   * @see {@link LightScatteringAtmosphere.brightness}
   */
  brightness?: number;
  /**
   * @see {@link LightScatteringAtmosphere.rayleighScatteringFactor}
   */
  rayleighScatteringFactor?: number;
  /**
   * @see {@link LightScatteringAtmosphere.mieScatteringFactor}
   */
  mieScatteringFactor?: number;
}
/**
 * A <code>LightScatteringAtmosphere</code> allows you to apply an atmosphere effect on a 3D WebGLMap that approximates the behavior of light in the atmosphere.
 * <p>The sky adapts to the lighting set on the {@link GraphicsEffects} of the map.  This will result in blue skies during the day
 * and yellowish to reddish hues at dawn and dusk.  The terrain can also be made to look brighter when viewed from higher altitudes.</p>
 * <p>Lighting must be enabled to use this effect.</p>
 * </p>
 *
 * ```javascript
 *   map.effects.atmosphere = new LightScatteringAtmosphere();
 * ```
 *
 * @since 2020.1
 */
export declare class LightScatteringAtmosphere {
  constructor(options?: LightScatteringAtmosphereConstructorOptions);
  /**
   * <p>Indicates whether the atmosphere also affects the color of the terrain..</p>
   *
   * @default false
   */
  get affectsTerrain(): boolean;
  set affectsTerrain(affectsTerrain: boolean);
  /**
   * <p>The brightness of the sunlight.</p>
   * <p>Values should be a positive floating point number, generally between 2 and 6. Other values are accepted, but not recommended.</p>
   *
   * @default 2
   */
  get brightness(): number;
  set brightness(brightness: number);
  /**
   * <p>This factor allows you to increase or decrease the effect of Rayleigh scattering in the atmosphere.
   * Rayleigh scattering is the scattering of sunlight by air molecules.  It is the reason for the blue color of the daytime and twilight sky,
   * and the yellowish to reddish hue of the low sun.</p>
   * <p>Values should be a positive floating point number, generally between 1 and 3. Other values are accepted, but not recommended.</p>
   *
   * @default 1
   */
  get rayleighScatteringFactor(): number;
  set rayleighScatteringFactor(rayleighScatteringFactor: number);
  /**
   * <p>This factor allows you to increase or decrease the effect of Mie scattering in the atmosphere.
   * Mie scattering is the scattering of light by aerosols (dust, pollen, smoke, microscopic water droplets, etc.).
   * On a hazy day, Mie scattering causes the sky to look a bit gray and causes the sun to have a large white halo around it.</p>
   * <p>Values should be a positive floating point number, generally between 1 and 3. Other values are accepted, but not recommended.</p>
   *
   * @default 1
   */
  get mieScatteringFactor(): number;
  set mieScatteringFactor(mieScatteringFactor: number);
}