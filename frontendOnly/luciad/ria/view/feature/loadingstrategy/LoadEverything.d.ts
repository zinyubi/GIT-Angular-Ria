import { LoadingStrategy, LoadingStrategyConstructorOptions } from "./LoadingStrategy.js";
/**
 * Configuration options for {@link LoadEverything} constructor.
 */
export interface LoadEverythingConstructorOptions extends LoadingStrategyConstructorOptions {
  /**
   * The query object to use when querying the model. It is short-hand for a <code>queryProvider</code> which always returns a single query.
   */
  query?: any;
}
/**
 * <p>
 *   A FeatureLayer configured with this strategy will retrieve all data that satisfies a particular filter condition
 *   from its model. The condition can be configured by means of a {@link QueryProvider}.
 * </p>
 *
 * <p>
 *   Since 2020.1 a predicate function {@link LoadingStrategy.shouldUpdate} is exposed in order to control
 *   if an existing feature should be replaced by a new version from the cursor.
 *
 *   Please note that by default LuciadRIA does not replace existing features, as the update operation incurs some performance impact.
 * </p>
 *
 * @since 2015.0
 */
export declare class LoadEverything extends LoadingStrategy {
  /**
   * Constructs a loading strategy that loads all data that satisfies a given condition. If no condition
   * is configured, all data will be loaded from the model.
   *
   * @param options configuration options
   */
  constructor(options?: LoadEverythingConstructorOptions);
}