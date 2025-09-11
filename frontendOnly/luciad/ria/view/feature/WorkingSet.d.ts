import { Evented, Handle } from "../../util/Evented.js";
import { QueryStatus } from "./QueryStatus.js";
import { Feature, FeatureId } from "../../model/feature/Feature.js";
/**
 * <p> A collection of objects that a FeatureLayer has loaded from a model. A working set is initially populated
 * by querying the model of the layer using the query object specified on the layer. Subsequent updates to the
 * working set are triggered by change events from the model.
 * </p>
 * <p>
 * Note that the working set contains all features that should eventually be painted in the map. However perfect
 * consistency with what is actually being painted on the map is not guaranteed. Typically this happens if the layer
 * performs additional processing on the features (ex. styling and discretization) in an incremental or asynchronous way.
 * For example a feature that was added to the working set may not be painted immediately on the map. Similarly a
 * feature that was updated or removed may still be painted in its previous state while the layer is processing it. The
 * working set can also contain features that are outside the visible area of the map.
 * </p>
 */
export interface WorkingSet extends Evented {
  /**
   * A property indicating the status of the query of the working set.
   */
  queryStatus: QueryStatus;
  /**
   * Add a feature to the working set. This method will add the feature to the underlying model. Note that this function
   * will only be available if the underlying model also provides an add function.
   * </p>
   *
   * <p>
   * If this method returns a Promise, then that Promise will resolve once the newly added feature has been added to
   * the working set. This requires that the underlying model generates a change event for the addition of the
   * feature. If the model does not generate a change event, the Promise will be rejected after an implementation dependent
   * timeout. If this behaviour is not desired then it is recommended to call put on the underlying model directly.
   * </p>
   *
   * <p>
   * The advantage of adding a Feature through the WorkingSet, as opposed to adding it directly in the FeatureModel or the underlying Store,
   * is that the returned Promise will resolve only when the entire add-operation has been completed and the associated <code>WorkingSetChanged</code> event has been fired.
   * </p>
   *
   * @param feature The feature to add to the model.
   * @param options
   */
  add(feature: Feature, options?: any): FeatureId | Promise<FeatureId>;
  /**
   * Retrieves an array with all the objects contained in this working set.
   */
  get(): Feature[];
  /**
   * Update an existing feature in the working set. Note that this function will only be available if the underlying model
   * also provides a put function.
   * </p>
   *
   * <p>
   * If this method returns a Promise, then that Promise will resolve when the update has been completely processed
   * by the working set. This requires that the underlying model generates a change event for the update of the
   * feature. If the model does not generate a change event, the Promise will be rejected after an implementation dependent
   * timeout. If this behaviour is not desired then it is recommended to call put on the underlying model directly.
   * </p>
   *
   * <p>
   * The advantage of updating a Feature through the WorkingSet, as opposed to updating it directly in the FeatureModel or the
   * underlying Store,
   * is that the returned Promise will resolve only when the entire put-operation has been completed and the associated <code>WorkingSetChanged</code> event has been fired.
   * </p>
   *
   * @param feature The feature to update.
   * @param options
   */
  put(feature: Feature, options?: any): FeatureId | Promise<FeatureId>;
  /**
   * Removes a feature from the working set by id. Note that this function will only be available if the underlying model
   * also provides a remove function.
   *
   * If this method returns a Promise, then that Promise will resolve once the object has been removed from the working set.
   * This requires that the underlying model generates a change event for the removal of the feature. If the model does
   * not generate a change event, the Promise will be rejected after an implementation dependent timeout. If this behaviour
   * is not desired then it is recommended to call put on the underlying model directly.
   * </p>
   *
   * <p>
   * The advantage of deleting a Feature through the WorkingSet, as opposed to deleting it directly in the FeatureModel or the
   * underlying Store,
   * is that the returned Promise will resolve only when the entire remove-operation has been completed and the associated <code>WorkingSetChanged</code> event has been fired.
   * </p>
   *
   * @param id The identifier of the feature.
   */
  remove(id: FeatureId): FeatureId | Promise<FeatureId>;
  /**
   * An event that is emitted when the working set is about to query the underlying model for data.
   * @param event the 'QueryStarted'event
   * @param callback the callback to be invoked when a query is started, the callback has no parameters.
   * @param context value to use as this when executing callback
   * @event
   */
  on(event: "QueryStarted", callback: () => void, context?: any): Handle;
  /**
   * An event that is emitted when the working set has completed a previously started model query.
   * Typically, it follows the 'QuerySuccess' event shortly.
   * @param event the 'QueryFinished'event
   * @param callback the callback to be invoked when a query is completed, the callback has no parameters.
   * @param context value to use as this when executing callback
   * @event
   */
  on(event: "QueryFinished", callback: () => void, context?: any): Handle;
  /**
   * An event that is emitted when an ongoing query has been interrupted.
   * This typically happens when the {@link FeatureLayer.query} property is set before another query has finished processing.
   * @param event the 'QueryInterrupted' event
   * @param callback the callback to be invoked when a query is interrupted, the callback has no parameters.
   * @param context value to use as this when executing callback
   * @event
   */
  on(event: "QueryInterrupted", callback: () => void, context?: any): Handle;
  /**
   * An event that is emitted when the working set has successfully received a cursor from the underlying model.
   * @param event the 'QuerySuccess' event
   * @param callback the callback to be invoked when a query has successfully received a cursor from the underlying model,
   * the callback has no parameters.
   * @param context value to use as this when executing callback
   * @event
   */
  on(event: "QuerySuccess", callback: () => void, context?: any): Handle;
  /**
   * An event that is emitted when the working set received an error from the underlying model during the execution of a query.
   * @param event the 'QueryError' event
   * @param callback the callback to be invoked when the working set received an error from the underlying model during the execution of a query,
   * the callback gets the 'error' parameter, which is the error that occurred.
   * @param context value to use as this when executing callback
   * @event
   */
  on(event: "QueryError", callback: (error: Error) => void, context?: any): Handle;
  /**
   * An event that is emitted when the contents of the working set changes.
   * @param event the 'WorkingSetChanged' event
   * @param callback the callback the should be invoked when the content of the working set changes. It gets the following
   * parameters:
   * <ul>
   *  <li>eventType: "add", "update", "remove", "clear"</li>
   *  <li>feature: the <code>Feature</code> that was added, updated or removed. In case of remove and clear events, this may be undefined.</li>
   *  <li>id: The identifier of the <code>Feature</code>. In case of clear events, this may be undefined.</li>
   * </ul>
   * @param context value to use as this when executing callback
   * @event
   */
  on(event: "WorkingSetChanged", callback: (eventType: "add" | "update" | "remove" | "clear", feature: Feature, id: FeatureId) => void, context?: any): Handle;
}