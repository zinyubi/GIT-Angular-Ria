/**
 * A <code>FogEffect</code> allows you to apply a fog-like effect on a 3D WebGLMap.
 * <p>It provides an approximation of fog in the atmosphere, and can greatly
 * increase the user's perception of depth and scale in a 3D view.
 * </p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="450"><img src="media://effects/effects_no_fog.png" alt="No fog" width="450"></td>
 *     <td width="450"><img src="media://effects/effects_fog.png" alt="Fog" width="450"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Fog disabled</td>
 *     <td>Fog enabled</td>
 *   </tr>
 * </table>
 * Fog only has an effect on 3D <code>WebGLMap</code>s.
 * <p/>
 *
 * ```javascript
 *   map.effects.fog = {
 *     fogColor: "rgb(147, 183, 222)",
 *     maximumAltitude: 50e3
 *   }
 * ```
 *
 * @since 2023.1
 */
export interface FogEffect {
  /**
   * <p>The color of the fog.</p>
   *
   * @default "rgb(148, 194, 231)"
   */
  fogColor?: string;
  /**
   * <p>The color of the {@link GraphicsEffects.light light} (if any) as seen through the fog.</p>
   * If you want to disable this, you can set it to the same color as the {@link fogColor}.
   *
   * @default "rgb(255, 230, 179)"
   */
  lightColor?: string;
  /**
   * The density of the fog is a non-negative value.  Typical values range from 0 to 15.
   * <p>
   * Increasing the value makes the fog thicker.
   * </p>
   *
   * @default 9
   */
  density?: number;
  /**
   * Height falloff is a non-negative value.  Typical values range from 0 to 15.
   * It represents the rate at which the fog density decreases above the earth.
   * <p/>
   * Height falloff can be used for example to simulate thick fog limited to lower altitudes.
   * It is unrelated to the camera's altitude above the earth.
   * This setting contrasts with {@link maximumAltitude}, which is a setting that can be used to completely turn off fog
   * when the camera is above some altitude.  Even if there were some fog present at lower altitudes, the entire fog effect will be turned off.
   * <p/>
   * You can set heightFalloff to 0.  In that case, fog density does not depend on height. It is uniform across all heights.  The {@link maximumAltitude} setting still applies.
   *
   * @default 7.7
   */
  heightFalloff?: number;
  /**
   * The altitude of the camera, in meters above the ellipsoid, above which all fog disappears.
   * <p>
   * The fog effect automatically and gradually reduces as the camera gets farther away from the earth,
   * and moves closer to the maximum altitude.
   * This setting contrasts with {@link heightFalloff}, which is a setting that limits the fog to lower altitudes and is unrelated to the camera's position.
   *
   * @default 20000
   */
  maximumAltitude?: number;
}