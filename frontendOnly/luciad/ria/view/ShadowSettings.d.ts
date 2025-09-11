/**
 * Settings for shadows.
 *
 * @since 2024.0
 */
export interface ShadowSettings {
  /**
   * A positive integer value indicating the size of a shadow map.  Shadow mapping is a technique to determine which areas are shadowed.
   * Increasing the shadow map size improves shadow detail but may hurt performance so one must balance performance against quality.
   *
   * @default 2048
   */
  shadowMapSize?: number;
  /**
   * The maximum distance, in meters, from the camera outward over which shadows will be displayed.
   * Reducing this values improves shadow detail but brings the shadow cutoff closer.  This may look jarring, depending on the scene.
   * Therefore, this value needs to strike a balance between how far shadows are reasonably visible (or important enough) and shadow detail.
   *
   * @default 2000
   */
  maxDistance?: number;
  /**
   * A value between 0 and 1 where 0 indicates colors are not darkened by shadows and 1 indicates colors are fully darkened.
   *
   * @default 0.7
   */
  intensity?: number;
  /**
   * A positive integer value indicating how many samples per pixel are used to determine whether a pixel is shadowed.
   * This is most noticeable around the outline of a shadow which is called the penumbra.  This transition from dark to light can be hard (fewer samples) or soft (more samples).
   * Softer shadow edges require more work than hard shadows and therefore increasing this value may hurt performance.
   *
   * @default 1
   */
  numberOfSamples?: number;
  /**
   * A positive integer value indicating how many frames are rendered for every shadow update.
   * For example, a value of 10 indicates the shadows will be updated once every 10 frames.
   * So increasing the value reduces the frequency of updates (and therefore potentially shadow quality as well) but may improve performance.
   * Whether the shadows need frequent updating depends on the scene geometry and camera changes.
   * One must balance performance against quality.
   *
   * @default 1
   */
  updatePeriod?: number;
}