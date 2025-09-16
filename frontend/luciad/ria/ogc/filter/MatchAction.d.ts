/**
 * An enumeration class. The MatchAction can be used to specify how the comparison predicate shall
 * be evaluated for a collection of values in OGC Filter expressions (since OGC Filter version 2.0).
 *
 * <p>If an expression returns a collection of values rather than just a single value, the filters will be able to handle it
 * accordingly to the <code>matchAction</code> attribute. Possible values for the attribute are: MatchAction.ALL,
 * MatchAction.ANY or MatchAction.ONE.
 *
 * <p>A MatchAction can be used to create a binary {@link OGCCondition}
 * filter expressions using the {@link FilterFactory}.
 *
 * <p>Example: Filter expression that evaluates to TRUE when all elements in the collection values are greater than 100
 *
 * ```javascript
 *
 *  // NOTE: If the matchCase (3rd argument) is set to 'false' then the evaluation is performed by string comparison.
 *  import {gt, literal, property} from "@luciad/ria/ogc/filter/FilterFactory.js";
 *  import {MatchAction} from "@luciad/ria/ogc/filter/MatchAction.js";
 *
 *  gt(
 *     property("collectionOfNumbers"),
 *     literal(100),
 *     true,
 *     MatchAction.ALL
 *   );
 * ```
 */
export declare enum MatchAction {
  /**
   * Means that all values in the collection shall satisfy the predicate.
   */
  ALL = "All",
  /**
   * Means that any of the value in the collection can satisfy the predicate.
   */
  ANY = "Any",
  /**
   * Means that only one of the values in the collection shall satisfy the predicate.
   */
  ONE = "One",
}