import { FeaturePainter } from "../../view/feature/FeaturePainter.js";
import { DrapeTarget } from "../../view/style/DrapeTarget.js";
import { Shape } from "../../shape/Shape.js";
/**
 * Allows you to map <code>ExternalGraphic</code> elements in a Symbology Encoding file to icon images.
 *
 * @since 2021.1
 */
export interface IconProvider {
  /**
   * Provides the image or URL to be used for the <code>ExternalGraphic</code> with the given URI. If this provider does not
   * specify a custom image for the given URI, it should just return the input string again. In this case, the
   * <code>ExternalGraphic</code> will be handled as normal.
   *
   * @param uri the URI value as defined in the <code>href</code> of an <code>ExternalGraphics</code>'s
   * <code>OnlineResource</code> or its <code>InlineContent</code>. In the latter case, the full URL is provided
   * including the format, for example: <code>"data:image/png;base64,xxx"</code>.
   * @return the image to be used as icon, or a URL pointing to the image.
   */
  getIcon(uri: string): HTMLImageElement | HTMLCanvasElement | string;
}
/**
 * A function evaluator always has a user-defined number of spread arguments.
 *
 * @since 2023.0
 */
export type FunctionEvaluator<T> = (...args: any) => T;
/**
 *  Configuration object for the Symbology Encoding factory functions.
 */
export interface SEPainterCreateOptions {
  /**
   * Configures whether the factory method should fail if invalid elements are encountered.
   * The default value is false.
   */
  strict?: boolean;
  /**
   * The custom icon provider. This provider allows to provide custom icons for the Symbology Encoding file's
   * <code>ExternalGraphics</code> elements.
   *
   * @since 2021.1
   */
  iconProvider?: IconProvider;
  /**
   * Whether the labels defined by TextSymbolizers should be decluttered or not. The default value is true.
   *
   * Individual TextSymbolizers can override this default behaviour by specifying a <code>VendorOption</code> named
   * "conflictResolution". For example:
   *
   * ```xml
   * <TextSymbolizer>
   *    ...
   *    <VendorOption name="conflictResolution">false</VendorOption>
   * </TextSymbolizer>
   * ```
   *
   * @since 2021.1
   */
  conflictResolution?: boolean;
  /**
   * The {@link DrapeTarget target} on which Symbology Encoding styled content will be draped.
   * If <code>drapeTarget</code> is undefined and the shape has zero Z, it will be draped {@link DrapeTarget.TERRAIN on terrain}.
   * If it has non-zero Z, it will {@link DrapeTarget.NOT_DRAPED not be draped}.
   * @default undefined
   * @since 2022.1
   */
  drapeTarget?: DrapeTarget;
  /**
   * You can provide some custom {@link FunctionEvaluator function evaluators} at creation time.
   * Custom functions allow to change the style of your features based on a function.
   *
   * Using custom functions requires some coding as well as some adaptations in your sld files to start
   * using them. To illustrate this we provide a very easy function to get the length of a string below.
   *
   * ```javascript
   * [[include:ogc/se/SEPainterFactorySnippets.ts_SE_CUSTOM_FUNCTION]]
   * ```
   *
   * Using this function can be done like this:
   *
   * ```xml
   * <ogc:Function name="lengthOfName">
   *   <ogc:PropertyName>NAME</ogc:PropertyName>
   * </ogc:Function>
   * ```
   *
   * We also provided a small set of pre-defined functions:
   * <ul>
   *   <li>"vertices": a geometry function that returns all points of a geometry.</li>
   *   <li>"startPoint": a geometry function that returns the first point of a geometry.</li>
   *   <li>"endPoint": a geometry function that returns the last point of a geometry.</li>
   *   <li>"startAngle": a geometry function that returns the orientation along the line starting in the first point of a geometry.</li>
   *   <li>"endAngle": a geometry function that returns the orientation along the line starting in the last point of a geometry.</li>
   *   <li>"Recode": a transformation function that transforms a set of discrete attribute values into another set of values.</li>
   *   <li>"Categorize": a transformation function that transforms a continuous-valued attribute into a set of discrete values.</li>
   *   <li>"Interpolate": a transformation function that transforms a continuous-valued attribute into another continuous range of values.</li>
   *   <li>"strTrim": a text-altering function that returns a copy of the string with leading and trailing blank spaces omitted.</li>
   * </ul>
   *
   * These functions don't require any coding, you can just use them by adding them in your sld files.
   * To illustrate this, below the <code>strTrim</code> function in sld, which can be used to properly trim
   * the property strings you use to label your features.
   *
   * ```xml
   * <ogc:Function name="strTrim">
   *   <ogc:PropertyName>NAME</ogc:PropertyName>
   * </ogc:Function>
   * ```
   *
   * For more elaborate documentation on the use of pre-defined functions and on how to implement your own custom functions, see
   *      <a href="articles://howto/sld/sld_custom_functions.html">SLD custom and predefined functions - how to use them.</a>
   *
   * @since 2023.0
   */
  functionEvaluators?: {
    [name: string]: FunctionEvaluator<string | number | null | Shape | boolean>;
  };
  /**
   * This parameter indicates which styles will be used for rendering:
   * <ul>
   *   <li><code>map</code>: normal + mapOnly</li>
   *   <li><code>legend</code>: normal + legendOnly</li>
   * </ul>
   *
   * This parameter is tightly bound to the vendor option "inclusion", which can be used in an SLD style file to
   * differentiate between styles for painting on a regular map (mapOnly) and styles for painting for a legend (legendOnly).
   * Any SLD style (or style-part) can thus have 3 possible "inclusion" types:
   * <ul>
   *   <li>"mapOnly" - only used by a <code>map</code> painter.</li>
   *   <li>"legendOnly" - only used by a <code>legend</code> painter.</li>
   *   <li>"normal" - <i>(or, no inclusion defined)</i> - used by both <code>map</code> and <code>legend</code> painters.</li>
   * </ul>
   *
   * Note that it is possible to create a Painter with type "legend" and still use it to paint your features on a
   * regular map. It is up  to the calling code to generate the right kind of painter for the purpose it needs to serve.
   *
   * For more elaborate documentation on the use of a legend painter and on how to alter your sld style files to
   * generate nice legend entries, see
   *      <a href="articles://howto/sld/sld_legend_functionality.html">SLD legend through vendor option 'inclusion' - Usage and examples.</a>
   *
   * @default map
   * @since 2024.1
   */
  painterType?: "map" | "legend";
}
/**
 * <p>
 *   Generates a LuciadRIA painter from a Symbology Encoding in a file located on a web server.
 *   The symbology encoding file is retrieved by means of passing its URL to the factory
 *   method.
 * </p>
 *
 *
 * ```javascript
 * [[include:ogc/se/SEPainterFactorySnippets.ts_CONFIGURE_SE_LAYER]]
 * ```
 * @param url The location of the symbology encoding XML file.
 * @param options an object literal containing painter creation configuration
 *                           parameters the factory method.
 * @returns A promise for a LuciadRIA feature painter that realizes the given Symbology Encoding file.
 * @throws {@link InvalidXMLError} if an error in the Symbology Encoding was encountered.
 * @throws {@link !Error Error} if the value configuration parameter in the Symbology Encoding is invalid.
 */
export declare function createPainterFromURL(url: string, options?: SEPainterCreateOptions): Promise<FeaturePainter>;
/**
 * <p>
 *   Generates a LuciadRIA painter from a Symbology Encoding in a JavaScript String.  This
 *   method can be used if the Symbology Encoding definition is already downloaded from the
 *   server, for example by means of an Ajax call.
 * </p>
 * <p>
 *   Currently the Factory only supports <code>FeatureTypeStyle</code> symbology encodings.
 *   <code>CoverageStyle</code> encodings are not supported.
 * </p>
 * <p>
 *   For more information on supported features, please refer to the developer guide.
 * </p>
 * @param seString The symbology encoding XML definition in a JavaScript String.
 * @param options an object containing configuration parameters for the factory
 * @returns {FeaturePainter} A promise for a LuciadRIA
 * feature painter that realizes the given Symbology Encoding file.
 * @throws {@link InvalidXMLError} if an error in the Symbology Encoding definition was encountered.
 */
export declare function createPainterFromString(seString: string, options?: SEPainterCreateOptions): Promise<FeaturePainter>;