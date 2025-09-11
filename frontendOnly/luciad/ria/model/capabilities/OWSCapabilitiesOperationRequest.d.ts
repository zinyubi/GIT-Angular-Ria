/**
 * Describes an HTTP request supported by OGC Web Services (OWS). All defined properties are read-only.
 * @since 2024.0.02
 */
export interface OWSCapabilitiesOperationRequest {
  /**
   * The HTTP request method. Possible values: "GET", "POST".
   */
  method: 'GET' | 'POST';
  /**
   * The HTTP request URL.
   */
  url: string;
}