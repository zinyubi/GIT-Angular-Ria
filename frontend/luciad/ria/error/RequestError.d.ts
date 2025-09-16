import { LuciadError } from "./LuciadError.js";
/**
 * An Error indicating that the HTTP request has failed.
 */
export declare class RequestError extends LuciadError {
  /**
   * The response's body content.
   */
  code?: number;
  /**
   * The HTTP status code of the response.
   */
  response?: any;
  /**
   * Creates a new RequestError.
   * @param message the error message
   * @param code the HTTP error code
   * @param response the response of the HTTP request
   */
  constructor(message?: string, code?: number, response?: any);
}