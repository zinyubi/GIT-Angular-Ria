import { LuciadError } from "./LuciadError.js";
/**
 * An Error indicating that a certain stub function of a prototype has not been implemented.
 */
export declare class NotImplementedError extends LuciadError {
  /**
   * Creates a new NotImplementedError.
   * @param message the error message
   */
  constructor(message?: string);
}