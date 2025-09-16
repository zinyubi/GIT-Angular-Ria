import { Cursor } from "../Cursor.js";
import { Bounds } from "../../shape/Bounds.js";
import { Feature, FeatureId } from "../feature/Feature.js";
import { Handle } from "../../util/Evented.js";
/**
 * Options passed from LuciadRIA to a Store (spatial) query.
 * @since 2021.0
 */
export interface QueryOptions {
  /**
   * Signals that a query has been aborted.
   * You can use this to abort an ongoing network request, for example.
   * @since 2021.0
   */
  abortSignal?: AbortSignal;
}
/**
 * Options for listening to the StoreChanged event
 * @since 2023.1
 */
export interface StoreChangedOptions {
  /**
   * Represents a query which may be understood and satisfied by the store.
   * The structure of this object is dependent on the specific store.
   */
  query?: any;
}
/**
 * <p>
 *   The store object provides the link between the {@link FeatureModel} and the data provider.
 *   The function of the store is to query the server for data, convert the response of the server to LuciadRIA {@link Feature} instances,
 *   and to perform optional CRUD operations: get, create, update and delete.
 * </p>
 *
 * <p>
 *   Most of the <code>Store</code> implementations separate the communication with a data provider (e.g. a WFS service)
 *   from the actual parsing of the server response. The conversion of the server response to
 *   LuciadRIA <code>Feature</code> instances is left to a {@link Codec}.
 *   For example, the <code>WFSFeatureStore</code> can be configured with a dedicated <code>Codec</code>
 *   if your WFS server, which the WFSFeatureStore connects to, does not support GeoJson as an output format.
 * </p>
 *
 * <p>
 *   A typical sequence of method calls on a set of a <code>FeatureModel</code> - <code>Store</code> - <code>Codec</code>
 *   is the following (without considering the asynchronous nature of those methods):
 * </p>
 *
 * <ol>
 *   <li><code>FeatureModel#query</code> gets called to perform the query on the server side.</li>
 *   <li>The <code>FeatureModel</code> passes the query parameters to the <code>Store#query</code> method.</li>
 *   <li>The <code>Store</code> performs the query and passes the response value to the <code>Codec</code> for decoding.</li>
 *   <li>The <code>Codec</code> returns the <code>Feature</code> instances to the <code>Store</code>, which passes them
 *   back to the <code>FeatureModel</code>.</li>
 * </ol>
 *
 * <p><strong>Note:</strong>
 *   Most of the methods in the <code>Store</code> API are optional.
 *   The presence of such an optional method indicates that the store can perform a specific action on a feature.
 *   For instance, a <code>Store</code> can implement the <code>query</code> and <code>get</code> methods
 *   but omit the <code>add</code>, <code>put</code> and <code>remove</code> methods. That also affects the functionality
 *   of the <code>FeatureModel</code> paired with the <code>Store</code>, as explained in the documentation of the
 *   {@link FeatureModel} class.
 * </p>
 *
 * <p>
 *   Users of this class should always check whether an optional method is available before calling the method, as illustrated below:
 * </p>
 *
 * ```javascript
 * [[include:model/store/StoreSnippets.ts_CAN_ADD]]
 * ```
 *
 * <p>
 *   In order to create a custom store that implements the event system, the custom store should implement
 *   {@link Evented}.
 * </p>
 *
 * ```javascript
 * [[include:model/store/StoreSnippets.ts_CUSTOM_STORE]]
 * ```
 *
 * @typeParam TFeature Represents the type of {@link Feature} instances that are handled by the store.
 */
export interface Store<TFeature extends Feature = Feature> {
  /**
   * Queries the store for objects. This method is not optional.
   * @param query An object which represents a query filter that is understood by the underlying data provider.
   *                         The structure of this object depends on a specific store implementation.
   * @param options An optional object that can be used in a specific implementation of the method.
   * @return A {@link Cursor} over a set of <code>Feature</code>
   * instances or a promise for that <code>Cursor</code>.
   */
  query(query?: any, options?: QueryOptions): Cursor<TFeature> | Promise<Cursor<TFeature>>;
  /**
   * <p>Queries the store for objects within a spatial extent. This method is optional.</p>
   *
   * <p><strong>Note:</strong>
   *   LuciadRIA determines the layer's default {@link LoadingStrategy loading strategy}
   *   based on the existence of this method in the store. If this method is implemented by store then
   *   the default loading strategy is {@link LoadEverything}.
   * </p>
   * <p><strong>Note:</strong> In a situation when the map reference and the model reference are incompatible,
   *   for example: a Cartesian reference and a geodetic reference, then the layer's
   *   {@link LoadEverything}.
   * </p>
   * <p><strong>Note:</strong>
   *   {@link WFSFeatureStore} implements this method
   *    by creating an OGC BBOX filter based on the <code>bounds</code> parameter.
   * </p>
   * @param bounds The spatial extent to return features for.
   * @param query An object which represents a query filter that is understood by the underlying data provider.
   *                         The structure of this object depends on a specific store implementation.
   * @param options An optional object that can be used in a specific implementation of the method.
   * @return A {@link Cursor}.
   */
  spatialQuery?(bounds?: Bounds, query?: any, options?: QueryOptions): Cursor<TFeature> | Promise<Cursor<TFeature>>;
  /**
   * <p>Adds a <code>Feature</code> to the store.</p>
   *
   * <p>When the addition is successful, the <code>Store</code> must:</p>
   * <ul>
   *   <li>
   *      Update the {@link Feature.id ID} of the <code>Feature</code> to reflect the ID assigned by the server,
   *      if the <code>Feature</code>'s ID was undefined prior to addition. If an ID was already defined,
   *      the <code>Store</code> should respect the provided ID unless overridden by the server.
   *   </li>
   *   <li>
   *     Emit a "StoreChanged" event with:
   *     <ul>
   *       <li><code>eventType</code>: "add"</li>
   *       <li><code>feature</code>: The added {@link Feature}, including its updated ID.</li>
   *       <li><code>id</code>: The updated identifier of the {@link Feature}.</li>
   *     </ul>
   *     Failure to do so will result in a map not displaying newly added features.
   *   </li>
   * </ul>
   *
   * @param feature The <code>Feature</code> to add.
   * @param options An optional object for additional implementation-specific parameters.
   * @return Returns the identifier of the <code>Feature</code> on success,
   *   or a promise that resolves to the identifier.
   */
  add?(feature: TFeature, options?: any): FeatureId | Promise<FeatureId>;
  /**
   * Retrieves a <code>Feature</code> by id from the data provider.
   * @param id The identifier of the <code>Feature</code>.
   * @param [options] An optional object that can be used in a specific implementation of the method.
   * @return May return the <code>Feature</code>, or a promise for the <code>Feature</code>.
   * When no feature with that id exists the returned value must be either <code>undefined</code> (the synchronous case),
   * or a rejected promise (the asynchronous case).
   */
  get?(id: FeatureId, options?: any): TFeature | Promise<TFeature> | undefined;
  /**
   * <p>Updates an existing <code>Feature</code> in the store, or adds it if it does not already exist.</p>
   *
   * <p>
   *   When the operation is successful, the <code>Store</code> must emit a "StoreChanged" event.
   *   The event should contain:
   *   <ul>
   *     <li><code>eventType</code>: "update" if an existing feature is updated, or "add" if a new feature is added.</li>
   *     <li><code>feature</code>: The updated or newly added {@link Feature}.</li>
   *     <li><code>id</code>: The identifier of the affected {@link Feature}.</li>
   *   </ul>
   *   Failure to do so will result in a map not displaying updated features.
   * </p>
   *
   * <p>
   *   The implementation of this method may follow the semantics of an <a href='https://datatracker.ietf.org/doc/html/rfc2616#section-9.6'>HTTP PUT</a> request.
   *   This means that if the feature does not already exist in the store, it may be added as a new entry.
   * </p>
   *
   *  @param feature The <code>Feature</code> to update or add.
   *  @param options An optional object for additional implementation-specific parameters.
   *  @return Returns the identifier of the <code>Feature</code> on success, or a promise that resolves to the identifier.
   */
  put?(feature: TFeature, options?: any): FeatureId | Promise<FeatureId>;
  /**
   * <p>Removes a <code>Feature</code> from the store by its ID.</p>
   * <p>
   *   When the removal is successful, the <code>Store</code> must emit a "StoreChanged" event,
   *   which contains an <code>eventType</code> of "remove" and the ID of the removed <code>Feature</code>.
   * </p>
   * <p>
   *   If the <code>Store</code> does not emit the "StoreChanged" event, the map visualization will not reflect the removal of the feature.
   * </p>
   *
   * @param id The identifier of the <code>Feature</code> to be removed.
   * @return Returns <code>true</code> on successful removal, or a promise that resolves to <code>true</code>.
   */
  remove?(id: FeatureId): boolean | Promise<boolean>;
  /**
   * An event that is emitted when the contents of the store change.
   * Stores that perform create, update, or delete operations must implement this event to ensure
   * that changes are communicated properly to listeners.
   *
   * @param event The "StoreChanged" event.
   * @param callback The callback to be invoked when the contents of the store change. The callback has three parameters:
   * <ul>
   *   <li><code>eventType</code>: A string indicating the type of change. Possible values are "add", "update", or "remove".</li>
   *   <li><code>feature</code>: The {@link Feature} that was added, updated, or removed.
   *       For the "remove" event type, the value should be <code>undefined</code>.</li>
   *   <li><code>id</code>: The identifier of the {@link Feature} that was affected by the change.</li>
   * </ul>
   * @param context An optional value used as the <code>this</code> context when executing the callback.
   * @param options An optional object specifying additional options for the event listener.
   * @event StoreChanged
   */
  on?(event: "StoreChanged", callback: (eventType: string, feature: TFeature, id: FeatureId) => any, context?: any, options?: StoreChangedOptions): Handle;
  /**
   * <p>Registers an event listener on this store. This method is optional if <code>Store</code> does not emit events.</p>
   *
   * <p><strong>Note:</strong> although this method is optional, it is strongly recommended to provide support for attaching
   * listeners to the <code>Store</code>. The <code>FeatureModel</code> needs those events to generate ModelChanged
   * events. So if your <code>Store</code> does not emit events, the visual representation of the model (e.g. the layer) will
   * not be automatically updated when a feature is changed in the <code>Store</code>.</p>
   *
   * @param event the event
   * @param callback the event listener
   * @param context value to use as "this" when executing callback
   * @param options An options object literal
   *
   * @return An object containing a single function named '<code>remove</code>'. This can be used to unregister the listener
   *                   from this store.
   */
  on?(event: string, callback: (...args: any[]) => any, context?: any, options?: StoreChangedOptions): Handle;
}