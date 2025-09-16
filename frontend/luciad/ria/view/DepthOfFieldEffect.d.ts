/**
 * A <code>DepthOfFieldEffect</code> allows you to apply a Depth of Field effect on a 3D WebGLMap.
 * <p>Depth of Field is an effect that blurs out parts of your map, based on distance to the camera.
 * This mimics the effect of a camera-wide aperture: objects you are focusing on are sharp, while the background is blurred.</p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="1000"><img src="media://effects/effects_dof.png" alt="Depth Of Field" width="1000"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Left: Depth of Field disabled, Right: Depth of Field enabled, with focus on the church</td>
 *   </tr>
 * </table>
 * <p>This implementation uses the GPU to calculate the effects of depth of field on-the-fly for your active view.
 * You can toggle it on and off, as well as change any of its parameters at any time, with no additional overhead.
 * </p>
 * <p>Depth of field has two main uses:
 * <ul>
 *   <li>Increase the visual quality of your map.</li>
 *   <li>Focus on a specific area of your map, so that it draws the attention of a user more effectively.</li>
 * </ul>
 * Depth of Field only has effect on 3D <code>WebGLMap</code>s.
 * </p>
 *
 * ```javascript
 *   map.effects.depthOfField = {
 *     focalDepth: 300,
 *     focusRange: 400
 *   }
 * ```
 *
 * @since 2019.0
 */
export interface DepthOfFieldEffect {
  /**
   * <p>A scale to increase or decrease the blur effect.  It does not affect the other properties.</p>
   *
   * @default 1
   */
  scale?: number;
  /**
   * <p>The distance in meters from the camera at which objects should be perfectly in focus.</p>
   *
   * @default 200
   */
  focalDepth?: number;
  /**
   * <p>The range (in meters) around the {@link DepthOfFieldEffect.focalDepth focal depth} at which
   * objects should be perfectly in focus.</p>
   *
   * @default half the noFocusRange if provided, else 200
   */
  focusRange?: number;
  /**
   * <p>The threshold in meters around the {@link DepthOfFieldEffect.focalDepth focal depth} at which
   * objects become fully unfocused.  Objects between {@link DepthOfFieldEffect.focusRange focusRange} and
   * noFocusRange are gradually blurred out of focus.  NoFocusRange should be larger than
   * {@link DepthOfFieldEffect.focusRange focusRange}.</p>
   *
   * @default twice the focusRange if provided, else 400
   */
  noFocusRange?: number;
}