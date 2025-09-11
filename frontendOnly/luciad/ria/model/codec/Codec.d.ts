import { Cursor } from "../Cursor.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Feature } from "../feature/Feature.js";
/**
 * Options for {@link Codec.decode} of codecs.
 */
export interface CodecDecodeOptions {
  /**
   * The content of the server response.
   */
  content: string | ArrayBuffer | Blob;
  /**
   * The content type as indicated by the server (if specified).
   *
   * Note that the presence of this parameter and the value strongly depends on the <code>Store</code> using this <code>Codec</code>.
   * For instance, a store connecting to a web service over http will likely respond with a content type (as it is part of the http-specification),
   * while a store connecting to the browser's localStorage will not.
   * A robust <code>Codec</code> implementation should be capable of handling all those situations so it can be reused by different types of <code>Store</code>s.
   */
  contentType?: string;
  /**
   * The reference in which the <code>Feature</code> instances are defined.
   *
   * A typical value for this parameter is reference of the {@link FeatureModel} to which the store is added and to which the Features will be added.
   * When this parameter is present, the reference of the {@link Shape} of the Features provided by the returned featureCursor must match this parameter.
   */
  reference?: CoordinateReference;
}
/**
 * Describes the result of {@link Codec.encode}
 * @since 2023.1
 */
export interface EncodeResult {
  /**
   * The encoded content as a <code>string</code>
   */
  content: string;
  /**
   * The mime type describing how the content was encoded as a <code>string</code>
   */
  contentType: string;
}
/**
 * <p>Encodes {@link Feature} instances to an arbitrary format and decodes that arbitrary format
 * to LuciadRIA {@link Feature} instances.</p>
 *
 * <p>A <code>Codec</code> is typically used by a {@link Store} to decode the server response
 * and to encode the LuciadRIA <code>Features</code> so they can be sent back to the server. Consult the class documentation
 * of the <code>Store</code> class for more information.</p>
 *
 * <p><strong>Note:</strong> most of the methods in the API are optional. The presence of such an optional method indicates support
 * for that feature. For instance a <code>Store</code> which is read-only only needs a <code>Codec</code> which provides a
 * <code>decode</code> method but does not need an <code>encode</code> method. It is up to the <code>Store</code> implementations
 * to clearly document which methods they require to be present on the <code>Codec</code>.</p>
 *
 * <p>Users of this class should always check whether such an optional method is available before calling the method, as illustrated below:</p>
 *
 * ```javascript
 *   if ( typeof codec.encode === "function" ){
 *     // encode method is available and can be called
 *     codec.encode( ... );
 *  }
 * ```
 *
 * @typeParam TFeature Represents the type of {@link Feature} instances that are handled by the codec.
 */
export declare abstract class Codec<TFeature extends Feature = Feature> {
  /**
   * Encodes a {@link Feature} instances into an
   * arbitrary representation, specific to this <code>Codec</code>. This is an optional method.
   * @param featureCursor a <code>Cursor</code> of LuciadRIA <code>Feature</code>s which must be encoded to
   * the arbitrary representation
   * @return The encoded version of the features
   *
   */
  abstract encode(featureCursor: Cursor<TFeature>): EncodeResult;
  /**
   * Decodes the server response from an arbitrary format to a {@link Cursor} of
   * {@link Feature} instances. Note that by returning a <code>Cursor</code> it is possible
   * to perform lazy decoding (only decoding the <code>Feature</code> when it is requested).
   * @param options The decoding options
   *
   * @return A <code>Cursor</code> of <code>Feature</code>s corresponding to the
   * server response. All <code>Features</code> should be defined in the same {@link CoordinateReference reference}.
   *
   */
  abstract decode(options: CodecDecodeOptions): Cursor<TFeature> | Promise<Cursor<TFeature>>;
}