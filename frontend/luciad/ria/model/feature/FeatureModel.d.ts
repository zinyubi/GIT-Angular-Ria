import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { CoordinateReferenced } from "../../reference/CoordinateReferenced.js";
import { CoordinateType } from "../../reference/CoordinateType.js";
import { Bounded } from "../../shape/Bounded.js";
import { Bounds } from "../../shape/Bounds.js";
import { Evented, Handle } from "../../util/Evented.js";
import { Cursor } from "../Cursor.js";
import { ModelDescriptor } from "../ModelDescriptor.js";
import { QueryOptions, Store } from "../store/Store.js";
import { Feature, FeatureId } from "./Feature.js";
import { Model } from "../Model.js";
interface FeatureModel {
  /**
   * Query the model for features in a spatial extent.
   * Note that this function will only be available if the underlying store also provides a spatialQuery function.
   * @param bounds The spatial extent.
   * @param query An object which represents a query which may be understood and satisfied by the store.
   *                         The structure of this object is dependent on the specific store.
   * @param options Object literal that will be passed as is to the model's store.
   * @return cursor or a promise for a cursor
   */
  spatialQuery(bounds?: Bounds, query?: any, options?: QueryOptions): Promise<Cursor> | Cursor;
  /**
   * Retrieve a feature from the model by id. Note that this function will only be available if the underlying store
   * also provides a get function.
   * @param id The identifier of the object.
   * @return May return the feature, or a promise for the feature.
   */
  get(id: FeatureId): Feature | Promise<Feature> | undefined;
  /**
   * Add a feature to the model. Note that this function will only be available if the underlying store
   * also provides an add function.
   * @param feature The feature to add to the model.
   * @param [options] Object literal that will be passed as is to the model's store.
   * @return Returns the identifier of the feature, or a promise for the identifier.
   */
  add(feature: Feature, options?: any): FeatureId | Promise<FeatureId>;
  /**
   * Update an existing feature in the model object. Note that this function will only be available if the underlying store
   * also provides a put function.
   * @param feature The feature to update.
   * @param options Object literal that will be passed as is to the model's store.
   * @return Returns the identifier of the feature, or a promise for the identifier.
   */
  put(feature: Feature, options?: any): FeatureId | Promise<FeatureId>;
  /**
   * Removes a feature from the model by id. Note that this function will only be available if the underlying store
   * also provides a remove function.
   * @param id The identifier of the feature.
   * @return true or promise for true on successful removal, otherwise false.
   */
  remove(id: FeatureId): boolean | Promise<boolean>;
}
/**
 * Options which can be passed to the {@link FeatureModel} constructor.
 */
interface FeatureModelConstructorOptions {
  /**
   * The model's spatial reference.  All {@link Feature} instances in the model are required to have
   * this same reference, otherwise an error will be thrown.
   */
  reference: CoordinateReference;
  /**
   * The spatial extent of the dataset to use.
   * Preferably this is set to the bounding box of the dataset.
   * This is optional, if not specified, the bounds are unknown.
   * The bounds' reference must match that of the model.
   */
  bounds?: Bounds;
}
/**
 * <p>A model that contains LuciadRIA {@link Feature features}.</p>
 *
 * <p>Each model must be configured with an object {@link Store}. The <code>Store</code> is used
 * to retrieve/update/... the <code>Feature</code> instances of this model. Consult the class documentation of the
 * {@link Store} class for more information.</p>
 *
 * <p>Each <code>FeatureModel</code> provides methods to retrieve/update/query/... the underlying data of the model. The
 * presence of those methods is determined by the available methods in the <code>Store</code> of the model. Users of this
 * class should always check whether such a method is available before calling the method, as illustrated below:</p>
 *
 * ```javascript
 *   const model = new FeatureModel(store);
 *   if (typeof model.add === "function") {
 *     //add method is available and can be called
 *     model.add( ... );
 *  }
 * ```
 */
declare class FeatureModel implements Model, Evented, Bounded, CoordinateReferenced {
  /**
   * Constructs a FeatureModel.
   * @param store The store that contains the elements of this model.
   * @param options An options object
   */
  constructor(store: Store, options?: FeatureModelConstructorOptions);
  /**
   * Query the model for features.
   * @param query An object which represents a query which may be understood and satisfied by the store.
   *                         The structure of this object is dependent on the specific store.
   * @param options Object literal that will be passed as is to the model's store.
   * @return cursor or a promise for a cursor
   */
  query(query?: any, options?: QueryOptions): Promise<Cursor> | Cursor;
  /**
   * The spatial reference in which this object is defined. If this
   * property is <code>null</code> then this object is not spatially
   * referenced.
   */
  get reference(): CoordinateReference;
  /**
   * The spatial extent of the data in this model.
   * If the property is <code>null</code>, the extent is unknown.
   */
  get bounds(): Bounds | null;
  /**
   * The coordinate type of geometries in this model.
   */
  get coordinateType(): CoordinateType;
  /**
   * The store that backs this model, immutable.
   */
  get store(): Store;
  /**
   * The model descriptor of this model.
   * The model descriptor object becomes immutable (frozen) when passed to the setter.
   */
  get modelDescriptor(): ModelDescriptor;
  set modelDescriptor(modelDescriptor: ModelDescriptor);
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
}
export { FeatureModel, FeatureModelConstructorOptions };