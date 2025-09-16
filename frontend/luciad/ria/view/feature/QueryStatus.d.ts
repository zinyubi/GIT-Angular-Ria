/**
 * An enumeration of query status flags for a {@link WorkingSet} API
 */
export declare enum QueryStatus {
  /**
   * A query is not yet requested. In this status the layer's working set remains empty.
   */
  QUERY_PENDING = "QUERY_PENDING",
  /**
   * A query has been invoked, but the response has not been received yet.
   */
  QUERY_STARTED = "QUERY_STARTED",
  /**
   * The processing of the query is finished.
   */
  QUERY_FINISHED = "QUERY_FINISHED",
  /**
   * There was an error during the handling of the query.
   */
  QUERY_ERROR = "QUERY_ERROR",
  /**
   * A query has been interrupted by a new query.
   */
  QUERY_INTERRUPTED = "QUERY_INTERRUPTED",
  /**
   * The response of the query has been received but all processing has not been completed yet.
   */
  QUERY_SUCCESS = "QUERY_SUCCESS",
}