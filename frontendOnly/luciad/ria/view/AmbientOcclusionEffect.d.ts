/**
 * An <code>AmbientOcclusionEffect</code> allows you to apply the effect of ambient occlusion on a 3D WebGLMap.
 * <p>Ambient occlusion is an effect that shades areas of 3D geometry based on their proximity to other 3D geometry.
 * This mimics a behavior of the real world where light gets trapped in tight areas.
 * Typical examples are the corners of a room, which are slightly darker than the rest of the room as the light is trapped in the corners.</p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="1000"><img src="media://effects/effects_ssao.png" alt="Ambient Occlusion" width="1000"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Left: ambient occlusion disabled, Right: ambient occlusion enabled</td>
 *   </tr>
 * </table>
 * <p>Ambient Occlusion is recommended for cases in which 3D datasets with simple colors, such as 3D CAD & BIM models, are visualized.
 * For these types of datasets, Ambient Occlusion can help give the dataset more depth and make it easier to understand how geometry relates to each other.
 * On top of that, it also improves the visual quality of such datasets, and gives an overall better impression.</p>
 * <p>
 * Ambient Occlusion only has an effect on 3D <code>WebGLMap</code>s.
 * It has no effect on transparent data.
 * </p>
 *
 * ```javascript
 *   map.effects.ambientOcclusion = {
 *     radius: 25,
 *     power: 1.5
 *   }
 * ```
 *
 * @since 2019.0
 */
export interface AmbientOcclusionEffect {
  /**
   * <p>The radius in meters at which the effect should be sampled. A lower value produces sharper results, while higher values produce softer results.</p>
   *
   * @default 30
   */
  radius?: number;
  /**
   * <p>A factor to brighten or darken the effect. It determines how strongly the effect is applied to your view. A lower value results in a more subtle effect, while a higher value produces more defined results.
   It does not affect the {@link AmbientOcclusionEffect.radius radius}.</p>
   * <p>Values should be a positive floating point number, generally between 0 and 5. Higher values are accepted, but not recommended.</p>
   *
   * @default 1
   */
  power?: number;
}