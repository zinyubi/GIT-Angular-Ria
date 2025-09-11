import { AmbientOcclusionEffect } from "./AmbientOcclusionEffect.js";
import { EyeDomeLightingEffect } from "./EyeDomeLightingEffect.js";
import { DepthOfFieldEffect } from "./DepthOfFieldEffect.js";
import { EnvironmentMapEffect } from "./EnvironmentMapEffect.js";
import { LightEffect } from "./LightEffect.js";
import { LightScatteringAtmosphere } from "./LightScatteringAtmosphere.js";
import { BloomEffect } from "./BloomEffect.js";
import { FogEffect } from "./FogEffect.js";
import { Evented, Handle } from "../util/Evented.js";
/**
 * The graphics effects that can be applied to a map. <br/>
 * You cannot create a GraphicsEffects.
 * Instead, you can retrieve it from {@link Map.effects} and assign properties.<br/>
 * For example:
 * ```javascript
 *   map.effects.light = null;
 *   map.effects.atmosphere = false;
 * ```
 * <p/>
 * The order in which effects are applied, if enabled, is:
 * <ul>
 *   <li>Star field</li>
 *   <li>Atmosphere</li>
 *   <li>Environment map</li>
 *   <li>Lighting + shadows</li>
 *   <li>Ambient occlusion</li>
 *   <li>Eye-dome lighting</li>
 *   <li>Anti-aliasing</li>
 *   <li>Bloom</li>
 *   <li>Fog</li>
 *   <li>Depth-of-field</li>
 * </ul>
 * <p/>
 *
 */
declare class GraphicsEffects implements Evented {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * The light effect that is used.
   * <p>
   *   You can use the factory methods in the {@link LightEffect} module to create new instances.<br/>
   *   See the {@link LightEffect} module for more information on what lights are supported on what views.
   * </p>
   * <p>
   *   By default a head light is used.<br/>
   *   Set to null to disable lighting.
   * </p>
   *
   * @default headlight in 3D
   */
  get light(): LightEffect | null;
  set light(light: LightEffect | null);
  /**
   * Configures the atmosphere to be painted on a 3D view.
   *
   * <p>
   *   By default, a basic atmosphere effect is on.<br/>
   *   This look is unaffected by lighting.  You can also use a {@link LightScatteringAtmosphere} that
   *   approximates the behavior of {@link light} in the atmosphere.  This provides more accurate time of day effects.<br/>
   *   Set to null or false to disable the atmosphere.
   * </p>
   *
   * @default on in 3D
   */
  get atmosphere(): LightScatteringAtmosphere | null | boolean;
  set atmosphere(atmosphere: LightScatteringAtmosphere | null | boolean);
  /**
   * Indicates if a starfield should be painted when zoomed in on a 3D view.
   *
   *  <p>
   *   By default, the starfield property is set to true on geocentric maps and false on 3D cartesian maps.<br/>
   *   Set to false to disable the starfield.
   * </p>
   *
   * @default on in 3D geocentric, off in 3D cartesian
   */
  get starfield(): boolean;
  set starfield(starfield: boolean);
  /**
   * The ambient occlusion effect that is used.
   * </p>
   * Note that ambient occlusion is only applied in 3D views.
   * </p>
   *
   * @default off
   */
  get ambientOcclusion(): AmbientOcclusionEffect | null;
  set ambientOcclusion(ssao: AmbientOcclusionEffect | null);
  /**
   * The fog effect that is used.
   * </p>
   * Note that fog is only applied in 3D views.
   * </p>
   *
   * @default off
   * @since 2023.1
   */
  get fog(): FogEffect | null;
  set fog(fog: FogEffect | null);
  /**
   * The depth of field effect that is used.
   * </p>
   * Note that depth of field is only applied in 3D views.
   * </p>
   *
   * @default off
   */
  get depthOfField(): DepthOfFieldEffect | null;
  set depthOfField(dof: DepthOfFieldEffect | null);
  /**
   * The eye-dome lighting effect that is used.
   * </p>
   * Eye-dome lighting (EDL) is a non-photorealistic lighting model, which helps accentuate the shapes of different
   * objects to improve depth perception, by shading their outlines.
   * </p>
   * Note that eye-dome lighting is only applied in 3D views.
   * </p>
   *
   * @default off
   * @since 2020.0
   */
  get eyeDomeLighting(): EyeDomeLightingEffect | null;
  set eyeDomeLighting(edl: EyeDomeLightingEffect | null);
  /**
   * Enable anti-aliasing on the entire map.
   * </p>
   * The anti-aliasing algorithm is FXAA.
   * </p>
   * Note that anti-aliasing is only applied in 3D views.
   * In 2D views, most content is already anti-aliased anyway: imagery, lines and icons.
   *
   * @default off
   * @since 2020.0
   */
  get antiAliasing(): boolean;
  set antiAliasing(fxaa: boolean);
  /**
   * <p>This property allows you to configure blooming.
   * Shapes with a bloom style will display blooming if this effect is enabled.</p>
   *
   * @default on
   * @since 2022.1
   */
  get bloom(): BloomEffect | null;
  set bloom(bloom: BloomEffect | null);
  /**
   * <p>This property allows you to visualize an environment map instead of for example an atmosphere.
   * It can be used to create scenes with detailed background imagery.</p>
   *
   * Note that this effect is applied after the {@link atmosphere}.
   *
   * @default off
   * @since 2021.1
   */
  get environmentMap(): EnvironmentMapEffect | null;
  set environmentMap(map: EnvironmentMapEffect | null);
  /**
   * Event hook that is called when {@link GraphicsEffects.light light effect} has changed.
   *
   * @param event The "LightEffectChanged" event type
   * @param callback Callback to be invoked when the light effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "LightEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.atmosphere atmosphere effect} has changed.
   *
   * @param event The "AtmosphereEffectChanged" event type
   * @param callback Callback to be invoked when the atmosphere effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "AtmosphereEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.starfield starfield effect} has changed.
   *
   * @param event The "StarfieldEffectChanged" event type
   * @param callback Callback to be invoked when the starfield effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "StarfieldEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.ambientOcclusion ambient occlusion effect} has changed.
   *
   * @param event The "AmbientOcclusionEffectChanged" event type
   * @param callback Callback to be invoked when the ambient occlusion effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "AmbientOcclusionEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.fog fog effect} has changed.
   *
   * @param event The "FogEffectChanged" event type
   * @param callback Callback to be invoked when the fog effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "FogEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.depthOfField depth of field effect} has changed.
   *
   * @param event The "DepthOfFieldEffectChanged" event type
   * @param callback Callback to be invoked when the depth of field effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "DepthOfFieldEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.eyeDomeLighting eye-dome lighting effect} has changed.
   *
   * @param event The "EyeDomeLightingEffectChanged" event type
   * @param callback Callback to be invoked when the eye-dome lighting effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "EyeDomeLightingEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.antiAliasing anti-aliasing effect} has changed.
   *
   * @param event The "AntiAliasingEffectChanged" event type
   * @param callback Callback to be invoked when the anti-aliasing effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "AntiAliasingEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.bloom bloom effect} has changed.
   *
   * @param event The "BloomEffectChanged" event type
   * @param callback Callback to be invoked when the bloom effect has changed.
   * @event
   * @since 2024.1.01
   */
  on(event: "BloomEffectChanged", callback: () => void): Handle;
  /**
   * Event hook that is called when {@link GraphicsEffects.environmentMap} is set and loading has started.
   * The new environment map is not guaranteed to have finished loading when this event is triggered.
   *
   * @param event The "EnvironmentMapEffectLoadingStarted" event type
   * @param callback Callback to be invoked when the environment map effect is set and has started loading.
   * @event
   * @since 2024.1.01
   */
  on(event: "EnvironmentMapEffectLoadingStarted", callback: () => void): Handle;
  /**
   * Event hook that is called when a previously set {@link GraphicsEffects.environmentMap} has finished loading.
   *
   * @param event The "EnvironmentMapEffectLoadingFinished" event type
   * @param callback Callback to be invoked when a previously set environment map effect has finished loading.
   * @event
   * @since 2024.1.01
   */
  on(event: "EnvironmentMapEffectLoadingFinished", callback: () => void): Handle;
  /**
   * Event hook that is called when a previously set {@link GraphicsEffects.environmentMap} cannot be loaded.
   *
   * @param event The "EnvironmentMapEffectError" event type
   * @param callback Callback to be invoked when a previously set environment map effect failed to load.
   * @event
   * @since 2024.1.01
   */
  on(event: "EnvironmentMapEffectError", callback: () => void): Handle;
}
export { GraphicsEffects };