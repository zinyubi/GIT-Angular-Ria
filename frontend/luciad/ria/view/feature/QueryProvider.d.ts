import { Map } from "../Map.js";
import { FeatureLayer } from "./FeatureLayer.js";
/**
 * <p>
 * A QueryProvider allows you to define what {@link Feature} instances must be shown at
 * different map scales. A <code>QueryProvider</code> must be configured on a
 * {@link LoadingStrategy data loading strategy}.  A
 * {@link LoadingStrategy} is configured on a
 * {@link FeatureLayer} and allows you to control when and what data is downloaded
 * from the server to be visualized in that layer.
 * </p>
 * <p>
 * When the map scale changes, for example because a user zooms in or out, a
 * {@link FeatureLayer}'s
 * {@link LoadingStrategy} will consult its
 * <code>QueryProvider</code> if the data that must be shown at the new scale level is different from the data
 * shown at the previous scale level. The <code>QueryProvider</code> can then return a value (called a query
 * object) that expresses the filter conditions that the data at that level must satisfy.  The value returned by the
 * <code>QueryProvider</code> will be passed to the {@link FeatureModel}'s
 * {@link FeatureModel.query query()} method in the query parameter.  The
 * {@link Store} can then
 * interpret that value to send a request to the server to download the desired data.
 * <p>
 *
 * <p>
 * A QueryProvider works as follows:
 * </p>
 * <ul>
 *   <li>
 *     {@link getQueryLevelScales} must return an array of map scale thresholds.  If no
 *     thresholds are defined, the same query object will be used at every map scale.
 *   </li>
 *   <li>
 *     Subsequently, an index in this array is passed to {@link getQueryForLevel} to retrieve
 *     the corresponding query object.
 *   </li>
 * </ul>
 * <p>
 * This mechanism is similar to level-of-detail in
 * {@link FeaturePainter.getDetailLevelScales FeaturePainter}.
 * </p>
 *
 * @since 2015.0
 */
export declare abstract class QueryProvider {
  /**
   * Indicates that no data should be queried from the backing store.
   */
  static readonly QUERY_NONE: Record<string, never>;
  /**
   * <p>
   * Returns an array of map scales that dictate when a layer should switch from one query to another.
   * These scales must be ordered from the smallest scale (zoomed out) to the largest scale (zoomed in).
   * </p>
   *
   * <p>This method is required only if there's at least one scale break.</p>
   *
   * @param layer the layer for which the detail level scales are being requested
   * @param map the map for which the detail level scales are being requested
   * @return Array of switch scales for each level of detail.
   *
   * ```javascript
   * [[include:view/feature/QueryProviderSnippets.ts_QUERY_LEVEL_SCALES]]
   * ```
   */
  getQueryLevelScales(layer?: FeatureLayer, map?: Map): number[];
  /**
   * <p>
   * Returns the query to use on the backing {@link Store} for the given level scale.
   * The query can take any form as long as it can be correctly interpreted by the store.
   * For a WFS store, this is a {@link WFSQueryOptions} object with an OGC filter,
   * for a REST store, this can be an object that contains a number of key-value pairs that will be transmitted to the
   * server as URL parameters.
   * For a REST store, the meaning of the passed query object must be agreed with the underlying data provider.
   * </p>
   * <p>If no data should be downloaded from the server, return {@link QUERY_NONE QUERY_NONE}.</p>
   *
   * @param level the current level of detail as a non-negative integer value. The least precise detail
   * For performance reasons, the function should return the same primitive value or same instance object,
   * each time this function is invoked for the same <code>level</code> input.
   * The loading strategy can skip querying the store if the query object strictly equals the one used in the last query request.
   * That way unnecessary query calls can be avoided.
   * </p>
   * @param level the current level of detail as a non-negative integer value. The least precise detail
   *              level is <code>0</code>. The number of available detail levels is determined by the array
   *              returned by {@link getQueryLevelScales}.
   * @return {Object} The query to use on the backing {@link Store.query Store}.
   *
   * Example for a WFS store: request features with the <code>scale_rank</code> property equal to the <code>level</code> value.
   *
   * ```javascript
   * [[include:view/feature/QueryProviderSnippets.ts_WFS_QUERY_PROVIDER]]
   * ```
   *
   * For a REST store: returns a query object that instructs the store to download features with a specific minimum population.
   * As the map zooms in, cities with smaller population are also loaded.
   *
   * ```javascript
   * [[include:view/feature/QueryProviderSnippets.ts_REST_QUERY_PROVIDER]]
   * ```
   */
  getQueryForLevel(level: number): any;
  /**
   * Invalidates the query provider.
   * Use this method when you need to ensure that a {@link FeatureLayer} re-queries the model.
   *
   * ```javascript
   * [[include:view/feature/QueryProviderSnippets.ts_INVALIDATE]]
   * ```
   */
  invalidate(): void;
}