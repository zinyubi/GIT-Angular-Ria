import { Store, StoreChangedOptions } from "./Store.js";
import { Evented, Handle } from "../../util/Evented.js";
import { Feature, FeatureId } from "../feature/Feature.js";
import { Cursor } from "../Cursor.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Bounds } from "../../shape/Bounds.js";
import { FilterPredicateType } from "../../view/feature/FeatureLayer.js";
/**
 * Constructor options for {@link MemoryStore}.
 *
 * @typeParam TFeature Represents the type of {@link Feature} instances that are handled by this store.
 *            The default type is inferred from features passed in {@link MemoryStoreConstructorOptions.data},
 *            if the field is provided.
 */
export interface MemoryStoreConstructorOptions<TFeature extends Feature = Feature> {
  /**
   * The initial array of <code>Feature</code>s to populate the store with.
   */
  data?: TFeature[];
  /**
   * <p>The flag that indicates if the memory store should support spatial queries.</p>
   * <p>
   *   In order to create a {@link MemoryStore} with spatial capabilities you need to provide also
   *   the coordinate reference of stored features. This value is needed to create an internal spatial cache object.
   *   The reference can be provided explicitly by setting the {@link MemoryStoreConstructorOptions.reference} or
   *   can be deduced from features passed in the initial data {@link MemoryStoreConstructorOptions.data}.
   * </p><p>
   *   If the value is <code>true</code> and a reference value is not provided explicitly
   *   or cannot be deduced from initial data then the created {@link MemoryStore} will not support spatial queries.
   * </p><p>
   *   Limitation: the store does not support geocentric references. In such a case the created {@link MemoryStore}
   *   will not support spatial queries.
   * </p>
   * @default false
   * @since 2021.0
   */
  spatialIndex?: boolean;
  /**
   * <p>
   *   The reference in which the stored data is defined. This reference should match the reference
   *   of the {@link Store} is used.
   *   This reference is used to create an internal spatial cache when the
   *   {@link MemoryStoreConstructorOptions.spatialIndex} property is set to <code>true</code>.
   * </p><p>
   *   Please note that geocentric references are not allowed.
   *   A store with a geocentric reference will be graciously degraded to the memory store without spatial capabilities.
   * </p>
   * @since 2021.0
   */
  reference?: CoordinateReference;
}
/**
 * <p>A non-persistent {@link Feature} instances in memory.</p>
 * <p>
 *   The store can be created with spatial capabilities by setting {@link MemoryStoreConstructorOptions.spatialIndex}
 *   property to <code>true</code>.
 *   LuciadRIA will choose a default loading strategy for a layer with this store depending if the store supports
 *   spatial capabilities or not.
 *   <ul>
 *     <li>{@link LoadSpatially} strategy when the memory store supports spatial capabilities</li>
 *     <li>{@link LoadEverything} strategy otherwise</li>
 *   </ul>
 * </p>
 * <p>
 *   Please note that {@link MemoryStoreConstructorOptions.reference} should be defined in order to
 *   store features in an optimized spatial cache.
 * </p>
 * <p>As the <code>Feature</code>s are stored in memory, there is no need to convert them to a "server-specific format". As
 * such, this <code>Store</code> does not use a {@link Codec}.</p>
 *
 * @typeParam TFeature Represents the type of {@link Feature} instances that are handled by the store.
 *            The default type is inferred from features passed in {@link MemoryStoreConstructorOptions.data},
 *            if the field is provided, otherwise the type is {@link Feature} without restrictions on shape and properties.
 *
 * ```javascript
 * [[include:model/store/StoreSnippets.ts_MEMORY_STORE_TYPE_GUARDS]]
 * ```
 */
export declare class MemoryStore<TFeature extends Feature = Feature> implements Store<TFeature>, Evented {
  /**
   * Creates a new MemoryStore instance.
   * @param options options for the new store instance
   **/
  constructor(options?: MemoryStoreConstructorOptions<TFeature>);
  /**
   * Retrieve a <code>Feature</code> from this store by id.
   *
   * @param id The identifier of the <code>Feature</code>.
   * @return The <code>Feature</code> with the specified id. Undefined if it does not exist.
   */
  get(id: FeatureId): TFeature | undefined;
  /**
   * Update an existing <code>Feature</code> in the store. If an object with the same identifier does not exist yet,
   * the object will be added to the store. A corresponding <code>StoreChanged</code> will be fired.
   * @param feature the <code>Feature</code> to update.
   * @param options Object literal containing options for the put method. The current implementation does not
   *        support any options.
   * @return The identifier of the <code>Feature</code>. An "update" or "add" event is triggered, depending on whether the id already exists in the Store.
   */
  put(feature: TFeature, options?: object): FeatureId;
  /**
   * Add a new <code>Feature</code> to the store. If an id is present on the feature, the <code>Store</code> may not
   * yet contain a <code>Feature</code> with that same ID.
   * @param feature the <code>Feature</code> to add.
   * @param options Object literal containing options for the add method. The current implementation does not
   *        support any options.
   * @return The identifier of the newly added <code>Feature</code>. An "add" event is triggered if adding is successful.
   */
  add(feature: TFeature, options?: object): FeatureId;
  /**
   * Removes a <code>Feature</code> from the store by id.
   * @param id The identifier of the <code>Feature</code>.
   * @return True if removal was successful. If successful, a "remove" event is also triggered.
   */
  remove(id: FeatureId): boolean;
  /**
   * Removes all <code>Features</code> from the store
   * @return True. A "remove" event is also triggered for every successful removal
   *
   * @since 2018.0
   */
  clear(): boolean;
  /**
   * Query the store for objects. The current implementation returns all <code>Feature</code>s contained in
   * this <code>Store</code>.
   *
   * @param query An optional function that is used to filter the results of the query. The supplied function
   *        will receive an individual feature as parameter and should return a truthy value to indicate that that
   *        feature should be included in the cursor. If the function returns a falsy value then the feature will
   *        be excluded from the cursor. If no function is specified, then all features will be returned.
   * @return A cursor for the result set.
   */
  query(query?: (feature: Feature) => boolean): Cursor<TFeature>;
  /**
   * Queries the store for objects within a spatial extent.
   * This method is available only when the store is created with spatial index.
   * Please see {@link MemoryStoreConstructorOptions.spatialIndex} property for more details.
   *
   * @param [bounds] The spatial extent to return features for.
   * @param [query] An object which represents a predicate function that filters features.
   * @return A {@link Cursor}.
   * @since 2021.0
   */
  spatialQuery(bounds: Bounds, query?: FilterPredicateType): Cursor<TFeature>;
  /**
   * Clears the <code>Features</code> in the store and loads a new set of features
   * @param features The new data to load.
   * @return True. A "remove" event is triggered for every successful removal and an "add" event is triggered for every successful addition.
   *
   * @since 2018.0
   */
  reload(features: TFeature[]): boolean;
  /**
   * An event that is emitted when the contents of the store changes.
   * @param event the "StoreChanged" event.
   * @param callback the callback to be invoked when the contents of the store changes. The callback has 3 parameters:
   * <ul>
   *   <li>eventType: "add", "update" or "remove"</li>
   *   <li>feature: the {@link Feature} that was added, updated or removed. In case of the "remove" event type, it may be <code>undefined</code>.</li>
   *   <li>id: the identifier of the {@link Feature}.</li>
   * </ul>
   * @param context value to use as this when executing callback
   * @param options An option object which has a 'query' property,  which represents a query
   * which may be understood and satisfied by the store.
   * The structure of this object is dependent on the specific store. If specified,
   * the listener function must only be invoked for features that match the query.
   * @event "StoreChanged"
   */
  on(event: "StoreChanged", callback: (eventType: string, feature: TFeature, id: FeatureId) => any, context?: any, options?: StoreChangedOptions): Handle;
  /**
   * States if this store instance supports spatial capabilities.
   * If the returned value is <code>true</code> then {@link MemoryStore.spatialQuery} method is available.
   * @since 2021.0
   */
  get spatialIndex(): boolean;
}