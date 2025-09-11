import { Evented, Handle } from "../../util/Evented.js";
import { Codec, CodecDecodeOptions, EncodeResult } from "../codec/Codec.js";
import { Cursor } from "../Cursor.js";
import { KMLFeature } from "./KMLFeature.js";
import { KMLGroundOverlayFeature } from "./KMLGroundOverlayFeature.js";
import { KMLNetworkLinkFeature } from "./KMLNetworkLinkFeature.js";
import { KMLScreenOverlayFeature } from "./KMLScreenOverlayFeature.js";
/**
 * Constructor options for the {@link KMLCodec}.
 * @since 2020.1
 */
export interface KMLCodecConstructorOptions {
  /**
   * Defines whether to decode styles within the codec (default = `true`). If styles are not decoded, then every
   * decoded feature will be forced to use the default KML styles.
   */
  withStyle?: boolean;
  /**
   * Defines the "Base URL" to resolve links from. If this value is defined, then sub-links are resolved from the
   * target URL. Otherwise, links are resolved from the current window's URL.
   */
  origin?: string;
}
/**
 * <p>
 *   Decodes KML and KMZ files (strings, ArrayBuffers, and Blobs) into a {@link KMLPlacemarkFeature}s,
 *   {@link KMLGroundOverlayFeature}s.
 *   Other features are emitted from events:
 * </p>
 *
 * <ul>
 *   <li>{@link KMLNetworkLinkFeature}s are emitted using the <code>"KMLNetworkLink"</code> event. Network Links are
 *       separate KML Files that should be decoded separately in a new LuciadRIA model and layer (e.g. {@link KMLModel}
 *       and {@link KMLLayer}.</li>
 *   <li>{@link KMLGroundOverlayFeature}s are emitted using the <code>"KMLGroundOverlay"</code> event. Ground Overlays
 *       should be handled in a layer, cf {@link createGroundOverlayLayer}.</li>
 *   <li>{@link KMLFolderContainer}s are emitted using the <code>"KMLTree"</code>
 *       event. These features are used to represent the structure of the KML file, complete with the traversed
 *       {@link KMLScreenOverlayFeature}s and
 *       {@link KMLGroundOverlayFeature}s. These "container" features are not rendered on the map,
 *       and are used to facilitate the creation of a GUI.</li>
 * </ul>
 *
 * <p>A <code>KMLCodec</code> is typically used by a {@link Store} to decode strings into LuciadRIA
 * <code>KMLFeature</code>s. Consult the class documentation of the <code>Store</code> class for more information.</p>
 *
 * <p>Styles are resolved according to the KML specification, as long as they are defined in the original KML file.
 * Externally referenced styles are not resolved.</p>
 *
 * <h3>Supported versions</h3>
 *
 * <p>The current version of LuciadRIA supports the KML 2.3 standard.</p>
 *
 * <h3>Limitations</h3>
 * <ul>
 *   <li>
 *     This KML Codec will only decode the following features:
 *     <ul>
 *       <li>Placemarks and internal styles</li>
 *       <li>Shared Styles</li>
 *       <li>NetworkLinks (references to other KML files)</li>
 *       <li>KMZ files that consist of a single zipped KML-file and image resources.
 *           KML files that reference packaged resources are not currently supported.</li>
 *       <li>GroundOverlays</li>
 *       <li>ScreenOverlays</li>
 *     </ul>
 *   </li>
 *   <li>Cross-Origin requests that do not contain an "Access-Control-Allow-Origin" header in the response can
 *       not be loaded.</li>
 *   <li>Camera positions are not supported.</li>
 *   <li>LOD regions are not supported.</li>
 *   <li>Collada models are not supported.</li>
 *   <li>PhotoOverlays are not supported.</li>
 * </ul>
 *
 * <p><strong>NOTE:</strong> This codec only handles well-formed, serialized KML documents and does not handle
 * extensions to the KML Specification.</p>
 *
 * ```typescript
 * const codec = new KMLCodec();
 * const nlHandle = codec.on(KMLNetworkLinkEvent, (networkLink: KMLNetworkLinkFeature) => {});
 * const cursor = codec.decode({ content: "<kml>...</kml>" });
 * ```
 * @since 2020.1
 */
export declare class KMLCodec extends Codec<KMLFeature> implements Evented {
  /**
   * Creates a KML codec that can decode KML 2.3 strings.
   * @param options an object literal that contains configuration settings for the codec.
   *
   * @since 2020.1
   */
  constructor(options?: KMLCodecConstructorOptions);
  /**
   * <p>Converts content from a string, ArrayBuffer, or Blob into a cursor of {@link KMLPlacemarkFeature}s
   * {@link KMLGroundOverlayFeature}s.</p>
   *
   * <p>
   *   KML Network Link elements are emitted as {@link KMLNetworkLinkFeature} objects with the "KMLNetworkLink" event.
   *   KML Ground Overlay elements are emitted as {@link KMLGroundOverlayFeature} objects with the "KMLGroundOverlay"
   *   event.
   *   KML Screen overlay elements are emitted as {@link KMLScreenOverlayFeature} objects with the "KMLScreenOverlay"
   *   event.
   * </p>
   *
   * @param options The content to decode. Note that {@link CodecDecodeOptions.reference} will be ignored, as the KML
   *                specification stipulates that all KML coordinates should be interpreted using <em>WGS 84</em>. The
   *                {@link CodecDecodeOptions.contentType} is also unnecessary, and the codec will automatically
   *                determine whether the content is a KMZ that must be uncompressed before attempting to parse it.
   *                If the content is a KMZ file, then it will be uncompressed in memory and then parsed as a KML file.
   *                Bundled image resources in a KMZ file are also processed.
   *                Supported bundled image formats: '.png', '.jpeg', '.gif' and '.tiff'.
   */
  decode(options: CodecDecodeOptions): Cursor<KMLFeature> | Promise<Cursor<KMLFeature>>;
  /**
   * This is not yet implemented and will throw a {@link ProgrammingError} if it is used.
   *
   * @param cursor Defines the {@link KMLFeature}s to be encoded.
   *
   * @return The encoded version of the features.
   */
  encode(cursor: Cursor): EncodeResult;
  /**
   * Registers a callback function for the "KMLNetworkLink" event to process {@link KMLNetworkLinkFeature}s.
   * This event is fired by the cursor when it identifies a <code>&lt;NetworkLink&gt;</code> element in
   * the document.
   *
   * @param event    Always set to "KMLNetworkLink" for this event type.
   * @param callback The callback function to be executed when {@link KMLNetworkLinkFeature} objects are decoded by the
   *                 {@link KMLCodec.decode} function.
   * @param context  The context in which the callback function should be invoked.
   *
   * @event "KMLNetworkLink"
   */
  on(event: "KMLNetworkLink", callback: (networkLink: KMLNetworkLinkFeature) => void, context?: any): Handle;
  /**
   * Registers a callback function for the "KMLTree" event. The callback function receives an array of
   * {@link KMLFeature}s. This event is fired when the cursor has finished processing, and contains all
   * of the previously processed and emitted nodes from that cursor.
   *
   * @param event    Always set to "KMLTree" for this event type.
   * @param callback The callback function to be executed when the {@link KMLCodec.decode} function is called.
   * @param context  The context in which the function should be invoked.
   *
   * @event "KMLTree"
   */
  on(event: "KMLTree", callback: (rootArray: KMLFeature[]) => void, context?: any): Handle;
  /**
   * Registers a callback function for the "KMLGroundOverlay" event, that allows a listener to process
   * {@link KMLGroundOverlayFeature}s. This event is triggered by the cursor whenever it identifies a
   * <code>&lt;GroundOverlay&gt;</code> element in the document.
   *
   * @param event    Always set to "KMLGroundOverlay" for this event type.
   * @param callback The callback function to be executed when the {@link KMLCodec.decode} function is called.
   * @param context  The context in which the function should be invoked.
   *
   * @event "KMLGroundOverlay"
   */
  on(event: "KMLGroundOverlay", callback: (groundOverlay: KMLGroundOverlayFeature) => void, context?: any): Handle;
  /**
   * Registers a callback function for the "KMLScreenOverlay" event, that allows a listener to process
   * {@link KMLScreenOverlayFeature}s. This event is triggered by the cursor whenever it identifies a
   * <code>&lt;ScreenOverlay&gt;</code> element in the document.
   *
   * @param event    Always set to "KMLScreenOverlay" for this event type.
   * @param callback The callback function to be executed when the {@link KMLCodec.decode} function is called.
   * @param context  The context in which the function should be invoked.
   *
   * @return a handle to the registered callback with a single function 'remove'. This function can be used to
   *          unregister the callback function.
   *
   * @event "KMLScreenOverlay"
   * @since 2021.0
   */
  on(event: "KMLScreenOverlay", callback: (screenOverlay: KMLScreenOverlayFeature) => void, context?: any): Handle;
  /**
   * Registers a callback function for the "KMLFatalError" event, that allows a listener to process errors
   * which cause the KMLCodec to abort operations.
   *
   * @param event    Always set to "KMLFatalError" for this event type.
   * @param callback The callback function to be executed when the {@link KMLCodec} encounters a fatal error.
   * @param context  The context in which the function should be invoked.
   *
   * @event "KMLFatalError"
   * @since 2021.0
   */
  on(event: "KMLFatalError", callback: (errorMessage: string) => void, context?: any): Handle;
}