import { ShadowSettings } from "./ShadowSettings.js";
import { Vector3 } from "../util/Vector3.js";
/**
 * Factory for light effects. You can set a light by doing:
 * ```javascript
 *   map.effects.light = createHeadLight();
 * ```
 * The default light is a {@link createHeadLight head light}.
 * You can disable lighting by assigning null.
 * @packageDocumentation
 */
/**
 * Options to create a light.
 *
 * @since 2024.1
 */
export interface CreateLightOptions {
  /**
   * The illumination color for ambient light rather than direct light.
   */
  ambientColor?: string;
  /**
   * The color of the light.
   */
  diffuseColor?: string;
}
/**
 * Options to create a head light.
 */
export interface CreateHeadLightOptions extends CreateLightOptions {
  /**
   * The fixed pitch angle, in degrees, to use for the head light.
   * A value of -90 points down towards the ground, a value of 90 points straight up at the sky.
   * If you want the light to exactly follow the camera and not have a fixed pitch angle, you can set the pitch to null.
   *
   * @default -45
   *
   * @since 2024.1
   */
  pitch?: number | null;
}
/**
 * Interface to provide shadow options.
 *
 * @since 2024.1
 */
export interface ShadowOptions {
  /**
   * Indicates whether the light should cast shadows in 3D views.
   * Optionally, the shadow settings can be tuned to improve performance or quality.
   */
  shadows?: ShadowSettings | null | boolean;
}
/**
 * Options to create a directional light.
 *
 * @since 2024.1
 */
export interface CreateDirectionalLightOptions extends CreateLightOptions, ShadowOptions {
  /**
   * The direction towards the light, in world coordinates.
   *
   * @default (0, 0, 1)
   */
  direction?: Vector3;
}
/**
 * Options to create a sun light.
 */
export interface CreateSunLightOptions extends CreateLightOptions, ShadowOptions {
  /**
   * The time (default is current time).
   */
  time?: Date;
}
/**
 * Type representing a light effect.
 * @since 2021.0
 */
export type LightEffect = unknown;
/**
 * <p>Creates a directional light source which automatically follows the orientation of the viewer.</p>
 * <p>
 *   The head light direction is linked to the orientation of the camera in 3D.
 *   That is a useful feature in many applications where lighting can improve a user’s perception of shape.
 *   In this case, lighting is not used to represent the time of day.
 *   The user does not need the whole earth to have a bright side and a dark side.
 *   Note that by default the camera pitch does not affect the lighting.
 * </p>
 * <p>
 *   This light only has effect on a 3D WebGLMap.<br/>
 *   The lighting affects:
 *   <ul>
 *     <li>terrain, based on the elevation data</li>
 *     <li>draped shapes</li>
 *     <li>non-draped shapes such as extruded shapes and mesh icons</li>
 *   </ul>
 * </p>
 *
 * @param options An options object containing headlight options.
 *
 * @return  the head light
 */
export declare function createHeadLight(options?: CreateHeadLightOptions): LightEffect;
/**
 * <p>Creates a directional light source with a user-specified direction vector.</p>
 * <p>
 *   This light will simulate a directional light whose direction vector is specified by the user.
 * </p>
 * <p>
 *   This light only has effect on a 3D WebGLMap.<br/>
 *   The lighting affects:
 *   <ul>
 *     <li>terrain, based on the elevation data</li>
 *     <li>draped shapes</li>
 *     <li>non-draped shapes such as extruded shapes and mesh icons</li>
 *     <li>meshes of {@link TileSet3DLayer OGC 3D Tiles layers} if their
 *     {@link MeshStyle mesh style} has lighting turned on</li>
 *   </ul>
 * </p>
 *
 * @param options an options object containing light options.
 *
 * @return the directional light
 *
 * @since 2024.1
 */
export declare function createDirectionalLight(options?: CreateDirectionalLightOptions): LightEffect;
/**
 * <p>Creates a sun light source based on a specific time.</p>
 * <p>
 *   This light will simulate a sun light at the given time.
 * </p>
 * <p>
 *   This light has effect on a 2D or 3D WebGLMap.<br/>
 *   In 3D the lighting affects:
 *   <ul>
 *     <li>terrain, based on the elevation data</li>
 *     <li>draped shapes</li>
 *     <li>non-draped shapes such as extruded shapes and mesh icons</li>
 *     <li>the night side of the earth: it is desaturated</li>
 *     <li>meshes of {@link TileSet3DLayer OGC 3D Tiles layers} if their
 *     {@link MeshStyle mesh style} has lighting turned on</li>
 *   </ul>
 *   In 2D, the night side of the earth is desaturated.
 * </p>
 *
 * @param options an options object containing light options.
 *
 * @return the sun light
 */
export declare function createSunLight(options?: CreateSunLightOptions): LightEffect;