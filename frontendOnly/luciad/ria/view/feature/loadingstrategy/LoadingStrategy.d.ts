import { Feature } from "../../../model/feature/Feature.js";
import { QueryProvider } from "../QueryProvider.js";
/**
 * Configuration options for {@link LoadingStrategy} constructor.
 * @since 2020.1
 */
export interface LoadingStrategyConstructorOptions {
  /**
   * Query provider object.
   */
  queryProvider?: QueryProvider;
  /**
   * An optional delay that invalidates features on a loop. For more information, see {@link LoadingStrategy.refresh}.
   * @since 2020.1
   */
  refresh?: Date | number | null;
}
/**
 * Specifies how a {@link FeatureLayer} should retrieve data from its <code>FeatureModel</code>.
 * This is an abstract type and should not be instantiated directly. Instead, use one of its children:
 * <ul>
 *   <li>{@link LoadEverything}</li>
 *   <li>{@link LoadSpatially}</li>
 * </ul>
 *
 * A loading strategy instance cannot be shared by many <code>FeatureLayers</code>.
 *
 * @since 2015.0
 */
export declare abstract class LoadingStrategy {
  get queryProvider(): QueryProvider;
  /**
   * The query provider configured on this strategy.
   */
  set queryProvider(queryProvider: QueryProvider);
  /**
   * <p>
   * Controls the refresh settings for the Loading Strategy.
   * </p>
   * <ul>
   *   <li>If the refresh property is set to <code>null</code>, the loading strategy never refreshes.
   *   <li>If the refresh property is set to a some number <code>n</code>, the loading strategy refreshes every <code>n</code> milliseconds.
   *   <li>If the refresh property is set to a <code>Date</code> object, the loading strategy will refresh at that time.
   * </ul>
   * @since 2020.1
   */
  get refresh(): Date | number | null;
  set refresh(value: Date | number | null);
  /**
   * <p>
   *   This is a predicate function that is called by LuciadRIA when processing the query cursor in order to find out
   *   if an existing feature should be replaced by a new version from the cursor.
   *   If the result of this test is true then the feature will be replaced by the new version.
   *   By default, LuciadRIA does not replace existing features, as the update operation incurs some performance impact.
   * </p>
   *
   * <p>
   *   Please note that the query process is launched when:
   *   <ul>
   *     <li>a loading strategy decides so, based on {@link queryProvider} settings and/or a visible extent of the <code>Map</code></li>
   *     <li>a loading strategy refresh its data based on the {@link refresh} parameter</li>
   *     <li>a user invalidates {@link QueryProvider.invalidate} API</li>
   *   </ul>
   * </p>
   *
   * <p>
   *   You can set a custom implementation of <code>shouldUpdate</code> function to verify if the update
   *   operation should be performed on existing features.
   * </p>
   *
   * @param existingFeature - the feature that exists in the layer
   * @param feature - of the feature with same id that comes from the query cursor
   * @return true, if the update operation should be performed, false to keep the existing feature unchanged.
   *
   * ```typescript
   * [[include:view/feature/loadingstrategy/LoadSpatiallySnippets.ts_SHOULD_UPDATE]]
   * ```
   *
   * @since 2020.1
   */
  shouldUpdate(existingFeature: Feature, feature: Feature): boolean;
}