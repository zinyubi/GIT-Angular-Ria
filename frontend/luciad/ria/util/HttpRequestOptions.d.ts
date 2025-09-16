/**
 * Interface to provide HTTP request options.
 */
export interface HttpRequestOptions {
  /**
   * Whether credentials should be included with
   * every HTTP request.
   */
  credentials?: boolean;
  /**
   * An object literal that represents headers (as a key-value map)
   * to send with each HTTP request. If set (and not empty),
   * an XHR with the specified headers will be performed
   * instead of creating an Image.
   */
  requestHeaders?: HttpRequestHeaders | null;
  /**
   * An object literal that represents URL parameters (as a key-value map)
   * to send with each HTTP request. If set (and not empty),
   * an XHR with the specified query parameters will be performed
   * instead of creating an Image.
   * @since 2021.0
   */
  requestParameters?: HttpRequestParameters | null;
}
/**
 * A type that represents HTTP request headers.
 *
 * @since 2023.1
 */
export interface HttpRequestHeaders {
  [headerName: string]: string;
}
/**
 * A type that represents HTTP request URL parameters.
 * @since 2023.1
 */
export interface HttpRequestParameters {
  [parameterName: string]: string | number | boolean | null | undefined;
}