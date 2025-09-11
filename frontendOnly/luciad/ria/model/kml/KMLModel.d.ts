import { Evented, Handle } from "../../util/Evented.js";
import { Cursor } from "../Cursor.js";
import { Feature, FeatureId } from "../feature/Feature.js";
import { FeatureModel } from "../feature/FeatureModel.js";
import { KMLFeature } from "./KMLFeature.js";
import { KMLGroundOverlayFeature } from "./KMLGroundOverlayFeature.js";
import { KMLNetworkLinkFeature } from "./KMLNetworkLinkFeature.js";
import { KMLScreenOverlayFeature } from "./KMLScreenOverlayFeature.js";
import { QueryOptions } from "../store/Store.js";
/**
 * <p>
 *   Represents a KML Model for a given URI. The KML model will be decoded asynchronously and lazily when needed.
 *   This KML Model is decoded just before it is painted.  The model is read only; only the {@link query} method is
 *   supported. The {@link FeatureModel.put},
 *   {@link FeatureModel.spatialQuery} methods are not supported.
 * </p>
 *
 * <p>Note that, internally, the <code>KMLModel</code> uses the {@link KMLCodec}.</p>
 */
export declare class KMLModel extends FeatureModel implements Evented {
  /**
   * Creates a KML Model.
   * @param uri An URI to the KML or KMZ file. This can be either a relative or an absolute reference.
   */
  constructor(uri: string);
  /**
   * Since the URLStore does not implement feature events, the results of this query
   * are used to provide those messages from the KMLModel
   */
  query(query?: any, options?: QueryOptions): Promise<Cursor> | Cursor;
  /**
   * <p><strong>Note:</strong> the <code>FeatureModel</code> requires a <code>Store</code> which supports events in order
   * to automatically fire ModelChanged events. When the store does not support events, it is up to the user of this class
   * to fire those events manually.</p>
   * @param event The "ModelChanged" event type
   * @param callback the feature that was added, updated or removed. In case of remove events, this may be undefined.
   * @param context the context in which the callback function should be invoked.
   * implementation dependent.
   * <p>An event that is emitted when the contents of the model changes.</p>
   *
   * @event "ModelChanged"
   */
  on(event: "ModelChanged", callback: (modelChangeType: "add" | "update" | "remove", feature: Feature, id: FeatureId) => void, context?: any): Handle;
  /**
   * Registers a callback function for the "KMLNetworkLink" event to process <code>KMLNetworkLink</code>s.
   *
   * @param event    Always set to "KMLNetworkLink" for this event type.
   * @param callback The callback function to be executed when the NetworkLink cursor is decoded by the
   *                 {@link KMLCodec.decode} function.
   * @param context  The context in which the callback function should be invoked.
   *
   * @event "KMLNetworkLink"
   */
  on(event: "KMLNetworkLink", callback: (networkLink: KMLNetworkLinkFeature) => void, context?: any): Handle;
  /**
   * Registers a callback function for the "KMLTree" event. The callback function receives an array of
   * <code>KMLFeature</code>s.
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
   * KML ground overlays.
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
   * KML ground overlays.
   *
   * @param event    Always set to "KMLScreenOverlay" for this event type.
   * @param callback The callback function to be executed when the {@link KMLCodec.decode} function is called.
   * @param context  The context in which the function should be invoked.
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