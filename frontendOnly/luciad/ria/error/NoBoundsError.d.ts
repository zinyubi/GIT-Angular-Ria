import { LuciadError } from "./LuciadError.js";
/**
 * An Error indicating that a bounding box is not available.
 */
export declare class NoBoundsError extends LuciadError {
  /**
   * Creates a new NoBoundsError.
   * @param message the error message
   */
  constructor(message?: string);
}