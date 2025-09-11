/**
 * PBRMaterial lets you change some material properties that have an effect on the visualization.
 *
 * @since 2021.1
 */
export interface PBRMaterial {
  /**
   * <p>The metalness of a material is a value that ranges from 0, meaning the material is a dielectric, to 1, meaning the material is a metal.
   * A dielectric is a type of electrical insulator.  Some examples include porcelain, glass, and most plastics.
   * Usually, a material is either metallic or dielectric.  Values in between are for blending between metals and dielectrics such as dirty metallic surfaces.</p>
   * <p>With this metallicFactor you can scale the metalness values in the data to your liking.
   * If there are no such values in the data, it scales the default metalness value which is 1.</p>
   *
   * @default <code>1</code>
   */
  metallicFactor?: number;
  /**
   * <p>The roughness of a material is a value that ranges from 0, meaning completely smooth, to 1, meaning completely rough.</p>
   * <p>With this roughnessFactor you can scale the roughness values in the data to your liking.
   * If there are no such values in the data, it scales the default roughness value which is 1.</p>
   *
   * @default <code>1</code>
   */
  roughnessFactor?: number;
}
/**
 * PBRSettings lets you configure the PBR shading to apply.
 *
 * <p>Note that to take effect the {@link GraphicsEffects graphics effects} should be configured with a light.</p>
 *
 * <p>Note that PBR shading requires browser support for float textures.
 * Running the device support sample is a good way to check if this requirement is fulfilled.</p>
 *
 * @since 2021.1
 */
export interface PBRSettings {
  /**
   * <p>Indicates whether PBR shading should include directional lighting.
   * This is lighting coming from the {@link GraphicsEffects.light light} that is configured on the map.</p>
   *
   * @default <code>true</code>
   */
  directionalLighting?: boolean;
  /**
   * <p>The light intensity to use for the PBR lighting.
   * Positive values brighten and negative values darken the shading.</p>
   *
   * @default <code>0</code>
   */
  lightIntensity?: number;
  /**
   * <p>Indicates whether PBR shading should include image-based lighting.
   * This is lighting coming from the environment around the styled object. This environment lighting is taken from the {@link EnvironmentMapEffect.reflectionMap reflection map}.
   * This means that to take effect the {@link GraphicsEffects graphics effects} should be configured with an {@link EnvironmentMapEffect} with a reflection map.</p>
   *
   * @default <code>true</code>
   */
  imageBasedLighting?: boolean;
  /**
   * Modify PBR material properties.
   *
   * @default <code>null</code>
   */
  material?: PBRMaterial | null;
}