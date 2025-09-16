import { HttpRequestHeaders, HttpRequestOptions } from "../util/HttpRequestOptions.js";
import { CubeMapFace } from "../model/tileset/CubeMapFace.js";
/**
 * Describes the type of EnvironmentMapImagery.
 *
 * @since 2021.1
 */
export declare enum EnvironmentMapImageryType {
  /**
   * Cube map imagery.
   */
  CUBE_MAP = 0,
  /**
   * Equirectangular imagery.
   */
  EQUIRECTANGULAR = 1,
}
/**
 * Constructor options for {@link EnvironmentMapImagery}.
 *
 * @since 2021.1
 */
export interface EnvironmentMapImageryConstructorOptions extends HttpRequestOptions {
  type: EnvironmentMapImageryType;
}
/**
 * Represents imagery of an {@link EnvironmentMap}.
 *
 * There are two implementations: {@link EquirectangularImagery} and {@link CubeMapImagery} and each has an URL version for convenience.
 *
 * <p>Note that this is "abstract" EnvironmentMapImagery and should never be instantiated directly.
 * Only its subtypes can be directly instantiated.</p>
 *
 * @since 2021.1
 */
export declare abstract class EnvironmentMapImagery {
  /**
   * Creates a new EnvironmentMapImagery with the given options. This is "abstract" EnvironmentMapImagery and should never be instantiated directly.
   * @param options parameters to configure the {@link EnvironmentMapImagery}.
   */
  protected constructor(options: EnvironmentMapImageryConstructorOptions);
  /**
   * Returns the type of imagery.
   */
  get type(): EnvironmentMapImageryType;
  /**
   * <p>
   *   Indicates whether or not credentials should be included with HTTP requests.
   * </p>
   *
   * <p>
   *   Set this to true if the server requires credentials, like HTTP basic authentication headers or cookies.
   *   You should disable if the server is configured to allow cross-origin requests from all domains
   *   (<code>Acces-Control-Allow-Origin=*</code>).
   *   If the server allows CORS requests from all domains, the browser will block all requests where
   *   <code>credentials=true</code>.
   * </p>
   *
   * <p>
   *   Once set, all subsequent HTTP requests will use the newly set value.
   * </p>
   *
   * <p>
   *   The default value is <code>false</code>.
   * </p>
   *
   */
  get credentials(): boolean;
  /**
   * @see {@link HttpRequestOptions.credentials}
   */
  set credentials(credentials: boolean);
  /**
   * <p>
   *   Headers to send with every HTTP request.
   * </p>
   *
   * <p>
   *   An object literal that represents the headers to send with every HTTP request.
   *   The property names represent HTTP header names, the property values represent the HTTP header values.
   *   This property can be set dynamically (post-construction). Once set, all subsequent HTTP requests will use the
   *   newly set headers.
   * </p>
   *
   * <p>
   *  Note that when custom headers are being sent to a server on another domain, the server will have to properly
   *  respond to pre-flight CORS requests (a HTTP OPTION request sent by the browser before doing the actual request).
   *  The server has to indicate that the header can be used in the actual request, by including it in
   *  the pre-flight's <code>Access-Control-Allow-Headers</code> response header.
   * </p>
   *
   * <p>
   *   The default value is <code>null</code>.
   * </p>
   */
  get requestHeaders(): HttpRequestHeaders | null;
  /**
   * @see {@link HttpRequestOptions.requestHeaders}
   */
  set requestHeaders(requestHeaders: HttpRequestHeaders | null);
}
/**
 * {@link EnvironmentMapImagery} that supports cube maps.
 *
 * Use this class if you want to load the images (or URLs) yourself.
 *
 * You can use {@link createCubeMapImagery} to create CubeMapImagery with URLs.
 *
 * @since 2021.1
 */
export declare abstract class CubeMapImagery extends EnvironmentMapImagery {
  protected constructor(options?: HttpRequestOptions);
  /**
   * Loads a face image or URL.
   *
   * @param face the cube map face
   * @param onSuccess the callback function that should be invoked when the image or URL was successfully loaded.
   *                  The function will receive the face that was passed to this function and an image object or an URL.
   * @param onError the callback function that should be invoked when the image or URL could not be loaded.
   *                The function will receive the face that was passed to this function and an optional Error object.
   */
  abstract getImage(face: CubeMapFace, onSuccess: (face: CubeMapFace, imageOrURL: HTMLImageElement | HTMLCanvasElement | string) => void, onError: (face: CubeMapFace, error?: any) => void): void;
}
/**
 * Convenience factory function to create {@link CubeMapImagery} that accepts URLs.
 *
 * @param frontImageURL URL to the front face image of the cube map.
 * @param backImageURL URL to the back face image of the cube map.
 * @param leftImageURL URL to the left face image of the cube map.
 * @param rightImageURL URL to the right face image of the cube map.
 * @param bottomImageURL URL to the bottom face image of the cube map.
 * @param topImageURL URL to the top face image of the cube map.
 * @param options options for {@link CubeMapImagery}.
 *
 * @since 2021.1
 */
export declare function createCubeMapImagery(frontImageURL: string, backImageURL: string, leftImageURL: string, rightImageURL: string, bottomImageURL: string, topImageURL: string, options?: HttpRequestOptions): CubeMapImagery;
/**
 * {@link EnvironmentMapImagery} that supports equirectangular images.
 * The width:height ratio is expected to be 2:1 for this type of imagery.
 *
 * Use this class if you want to load the image (or URL) yourself.
 *
 * You can use {@link createEquirectangularImagery} to create EquirectangularImagery with a URL.
 *
 * @since 2021.1
 */
export declare abstract class EquirectangularImagery extends EnvironmentMapImagery {
  protected constructor(options?: HttpRequestOptions);
  /**
   * Load the image or URL.
   *
   * @param onSuccess the callback function that should be invoked when the image or URL was successfully loaded.
   *                  The function will receive the image object or an URL.
   * @param onError the callback function that should be invoked when the image or URL could not be loaded.
   *                 The function will receive an optional Error object.
   */
  abstract getImage(onSuccess: (image: (HTMLImageElement | HTMLCanvasElement | string)) => void, onError: (error?: Error) => void): void;
}
/**
 * Convenience factory function to create {@link EquirectangularImagery} that accepts URLs.
 *
 * @param imageURL URL to the equirectangular image.
 * @param options options for {@link EquirectangularImagery}.
 *
 * @since 2021.1
 */
export declare function createEquirectangularImagery(imageURL: string, options?: HttpRequestOptions): EquirectangularImagery;
/**
 * <p>Represents an environment around a scene.  Typically this environment is far away from the camera and
 * the objects in your scene.
 * It can be used to add detailed background imagery to more accurately customize the background to the scene.</p>
 *
 * @since 2021.1
 */
export interface EnvironmentMap {
  /**
   * <p>The environment map images.</p>
   */
  imagery: CubeMapImagery | EquirectangularImagery;
  /**
   * The orientation of the environment map. This is an angle, in degrees, from the north direction (0 = north), increasing clockwise (90 = east).
   * Defaults to 0 (facing north).
   */
  orientation?: number;
}
/**
 * <p>Represents an environment around the camera.  The environment consists of two parts: the skybox and the reflection map.</p>
 *
 * <p>The {@link skybox} is the background imagery the camera sees around it.  Having detailed background imagery that is appropriate to the scene can allow for a more immersive visual experience.</p>
 *
 * <p>The {@link reflectionMap reflection map} is the imagery that is seen in the reflections on certain objects in the scene.
 * 3D icons and OGC 3D Tiles can use the reflection map to show reflections if they are styled with {@link PBRSettings.imageBasedLighting imageBasedLighting}.
 * Seeing the environment reflected can make the objects seem more realistic and grounded in the scene.</p>
 *
 * @since 2021.1
 */
export interface EnvironmentMapEffect {
  /**
   * <p>The skybox (or environment map as it is sometimes called).</p>
   */
  skybox?: EnvironmentMap | null;
  /**
   * <p>The environment map to use for reflections.
   * This can be a different from the skybox.</p>
   * <p>You can also only set a reflection map and use for example the {@link GraphicsEffects.atmosphere atmosphere} for the environment.</p>
   * <p>The reflection map can be of lower resolution than the skybox because it's only used for the reflections.
   *    HDR imagery is preferred but not required.  To this end, .hdr files (radiance rgbE format) are supported.</p>
   */
  reflectionMap?: EnvironmentMap | null;
}