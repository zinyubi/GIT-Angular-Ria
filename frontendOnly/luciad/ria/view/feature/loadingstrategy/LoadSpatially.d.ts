import { LoadingStrategy, LoadingStrategyConstructorOptions } from "./LoadingStrategy.js";
/**
 * Configuration options for {@link LoadSpatially} constructor.
 * @since 2023.0
 */
export interface LoadSpatiallyStrategyConstructorOptions extends LoadingStrategyConstructorOptions {
  /**
   * <p>
   *   In a 3D scene when the visible extent of the <code>Map</code> covers areas of different scale levels,
   *   as defined by {@link QueryProvider.getQueryLevelScales}, the <code>LoadSpatially</code> strategy will
   *   trigger by default a query request for each scale level.
   * </p>
   * <p>
   *   On the other hand, by setting this property to true, the <code>LoadSpatially</code> strategy on a 3D map
   *   will trigger a single request for the entire visible area, with a query object that is associated with
   *   a scale level that matches the current {@link Map.mapScale map scale}.
   * </p>
   */
  singleQueryLevel?: boolean;
}
/**
 * <p>
 *   This strategy ensures that only the data within the visible extent of the <code>Map</code> is
 *   retrieved from the model. It can only be used on <code>FeatureLayers</code> whose model supports spatial queries.
 *   See {@link Store.spatialQuery} for more information about this capability.
 *   If you attempt to use this strategy with a model that does not support spatial queries, an error will be thrown.
 * </p>
 * <p>
 *   Additionally, you can configure a {@link QueryProvider} on this loading
 *   strategy to further refine the amount of data to load from the
 *   {@link FeatureModel}.
 * </p>
 * <p>
 *   Note: {@link QueryProvider} can define a WFS query object using the {@link WFSQueryOptions.maxFeatures} property.
 *   For a given visible extent of the <code>Map</code>, this property limits the maximum number of features to load.
 *   When this happens, the LoadSpatially strategy will re-query when zooming in or out, so that
 *   a new set of data is retrieved for the new view extent.
 * </p>
 *
 * <p>
 *   In a 3D scene, the visible extent of the <code>Map</code> may cover multiple areas at different scales.
 *   For example, when the camera is tilted, data near the horizon is visualized at
 *   a lower scale than data closer to the camera.
 *   To handle this, LuciadRIA divides the map into multiple zones that correspond with scale levels
 *   that are defined by the {@link QueryProvider}.
 *   The loading strategy queries the model by passing the bounds and the query object for each visible
 *   scale level zone, and combines the data across zones for consistent visualization.
 *   This approach enables visualization of large datasets in 3D, while still allowing you to apply data-specific
 *   business rules when loading and rendering.
 *   Please note that you can suppress this behavior by setting
 *   {@link LoadSpatiallyStrategyConstructorOptions.singleQueryLevel} to true.
 * </p>
 *
 * <p>
 *   To fully benefit from this loading capability, the {@link QueryProvider}
 *   should define scale levels and associated query objects, allowing you to limit the number of features at smaller scales,
 *   or to prevent loading data entirely at the least detailed level (level 0) using {@link QueryProvider.QUERY_NONE}.
 *   You can also define the layer’s minimum and maximum scale at which features should be rendered.
 *   LuciadRIA will query the model using bounds computed for the area within these scale limits.
 * </p>
 *
 * <p>
 *   Note: Selected features are preserved between queries and are not removed from the model when new data
 *   is returned, provided that the features returned by the query have stable, fixed IDs.
 *   If feature IDs change between queries, selections may be lost.
 * </p>
 *
 * ```javascript
 * [[include:view/feature/loadingstrategy/LoadSpatiallySnippets.ts_LOAD_SPATIALLY]]
 * ```
 *
 * @since 2015.0 load spatially strategy
 * @since 2018.1 3D multi-scale capability
 */
export declare class LoadSpatially extends LoadingStrategy {
  /**
   * Constructs a LoadSpatially data loading strategy.
   * @param options configuration options
   */
  constructor(options?: LoadSpatiallyStrategyConstructorOptions);
}