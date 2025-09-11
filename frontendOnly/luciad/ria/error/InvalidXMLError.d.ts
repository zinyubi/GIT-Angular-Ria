import { LuciadError } from "./LuciadError.js";
/**
 * An Error indicating that the content of an XML data structure did not meet the expectations.
 */
export declare class InvalidXMLError extends LuciadError {
  /**
   * Creates a new InvalidXMLError instance.
   * @param message the error message
   */
  constructor(message?: string);
}