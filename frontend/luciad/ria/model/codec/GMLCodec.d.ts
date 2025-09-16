import { Codec, CodecDecodeOptions, EncodeResult } from "./Codec.js";
import { Cursor } from "../Cursor.js";
import { FeatureIDProvider } from "../feature/FeatureIDProvider.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Feature } from "../feature/Feature.js";
/**
 * Constructor options for {@link GMLCodec}.
 */
export interface GMLCodecConstructorOptions {
  /**
   * Indicates whether the codec should swap the axis ordering of coordinates
   * in the GML features for the specified reference identifier(s).  If undefined,
   * the codec will respect the axis ordering dictated by the reference.
   * For each specified reference, the order will be reversed. This is for example
   * needed for EPSG:4326 data that is encoded in longitude-latitude order instead
   * of latitude-longitude.
   */
  swapAxes?: string[];
  /**
   * Controls how codec will react when an unsupported geometry type is detected.
   * This can happen when a geometry component is not part of the simple feature GML profile.
   * If true, the codec throws an error when the geometry type is unsupported.
   * Otherwise, a feature with an empty ShapeList is created.
   */
  failOnUnsupportedGeometry?: boolean;
  /**
   * Defines a custom callback function to provide IDs for decoded features that come without IDs.
   * This callback is invoked by LuciadRIA with a decoded feature for which the ID should be returned.
   * When the provided ID is invalid then the feature ID will be auto-generated based on
   * feature's properties and the shape.<br/>
   *
   * Note: Having features in LuciadRIA with stable IDs that do not change on each query request
   * is important for the performance sake.
   * For example, when features do not have intrinsic IDs on each query request, then
   * instead of adding and removing the relevant features only,
   * all the existing features are removed, and all the new ones are added.
   *
   * ```typescript
   * // GMLCodec will use IDs from a feature property.
   * const codec = new GMLCodec({ idProvider: (feature: Feature) => feature.properties.id });
   * ```
   * @since 2021.1.03
   */
  idProvider?: FeatureIDProvider;
  /**
   * The reference in which the {@link Feature} instances should be defined when decoding GML data.
   * Make sure the reference on your {@link FeatureModel} is the same as the reference on this codec.
   * @since 2022.0
   */
  reference?: CoordinateReference;
}
/**
 * <p>
 *   A GMLCodec is responsible for decoding a GML document object into a set of LuciadRIA {@link Feature}
 *   objects containing LuciadRIA geometries and properties.
 * </p>
 * <p>
 *   The codec decodes GML geometries to LuciadRIA {@link Shape shapes} as follows:</p>
 *   <ul>
 *     <li>'Point' is mapped to a {@link Point} instance.</li>
 *     <li>'LineString' is mapped to a {@link Polyline} instance.</li>
 *     <li>'Polygon' and 'PolygonPatch' is mapped to
 *         a {@link Polygon}, if there is no interior 'Ring',
 *         or to a {@link ComplexPolygon}, if at least one interior 'Ring' is defined.
 *     </li>
 *     <li>'Curve' is mapped to a {@link Circle} or
 *         a {@link Circle} instances.
 *     </li>
 *     <li>'Surface' is mapped to a {@link Polygon} instances (if the GML geometry does not define the interior 'Ring'),
 *         and {@link ComplexPolygon} instances (if the GML geometry defines at least one interior 'Ring').
 *     </li>
 *     <li>'MultiPoint', 'MultiLineString', 'MultiPolygon', 'MultiCurve' and 'MultiSurface' are all mapped to
 *         a {@link Polygon},
 *         {@link Circle} instances.</li>
 *     <li>Envelopes are mapped to {@link Bounds}.</li>
 *   </ul>
 *   The current implementation of GMLCodec is limited to the decoding of features containing the aforementioned geometry elements.
 *   Encoding is currently not supported.
 * </p>
 * <p>
 *   A GMLCodec can be used in combination with a {@link WFSFeatureStore} to decode
 *   GML data directly from a WFS service.
 * </p>
 *
 * ```javascript
 * [[include:model/store/WFSFeatureStoreSnippets.ts_CUSTOM_CODEC]]
 * ```
 *
 * <p>
 *   A GMLCodec can also be used to decode a file directly from a url, using a {@link UrlStore}:
 * </p>
 *
 * ```javascript
 * [[include:model/codec/GMLCodecSnippets.ts_CREATE_LAYER]]
 * ```
 *
 * <h3>Spatial reference</h3>
 * <p>
 *   The reference for shape decoding process is determined in the following way and order:
 *   <ul>
 *     <li>
 *       The reference passed to {@link decode}. Use it in case you want to override the reference for each decode request.
 *     </li>
 *     <li>
 *       The reference passed to the constructor. Allows you to set the reference yourself, overriding what is in the data.
 *       If you still want to override for a particular decode() operation, you can still do it, because the step 1 allows it.
 *     </li>
 *     <li>
 *       The reference specified in the data with the legacy <code>crs<code> field.
 *       This reference is used if you don't specify it in step 1 or 2.
 *     </li>
 *     <li>The specification default WGS:84 reference is used.</li>
 *   </ul>
 * </p>
 *
 * <h3>Supported versions</h3>
 * <p>
 *   LuciadRIA supports the GML 3.1 and GML 3.2 specifications, with the following limitations:
 * </p>
 * <ul>
 *   <li>The files must adhere to the Simple Feature Level-0 profile.</li>
 *   <li>
 *     It is assumed that all geometries use the same reference.
 *   </li>
 *   <li>Envelopes are not decoded.</li>
 * </ul>
 * <p>
 * LuciadRIA supports the GML Circle (a circle defined by 3 points) and GML CircleByCenterPoint geometries, described in GML 3.2.1 specification.
 * Circle geometries are interpolated to {@link Polyline} instances.
 *
 * @typeParam TFeature Represents the type of {@link Feature} instances that are decoded by the codec.
 *            Default type is {@link Feature} without restrictions on shape and properties.
 */
export declare class GMLCodec<TFeature extends Feature = Feature> extends Codec<TFeature> {
  /**
   * Creates a GML codec. This codec has support for GML 3.1.1 and GML 3.2.1 with a simple feature profile level SF-0.
   * @param options an object literal that contains configuration settings for the codec.
   */
  constructor(options?: GMLCodecConstructorOptions);
  /**
   * Encoding is currently not supported. Calling this method will throw an error.
   * @param featureCursor
   */
  encode(featureCursor: Cursor): EncodeResult;
  /**
   * Decodes the server response, which is valid GML, to a {@link Feature} instances.
   * <p>
   *   The ID of decoded feature is retrieved from the <code>gml:id</code> attribute.
   *   If the attribute does not exist, the ID is auto-generated using
   *   {@link GMLCodecConstructorOptions.idProvider}.
   * </p>
   * <p>
   *   A {@link Store.query} invocation,
   *   passing the <code>options</code> parameter containing the data to decode.
   *   If {@link CodecDecodeOptions.reference} option is present, the decoded features' shapes are encoded with this reference.
   * </p>
   * @param options the decoding options
   * @return featureCursor a {@link Feature} instances corresponding to the server response.
   */
  decode(options: CodecDecodeOptions): Cursor<TFeature>;
}