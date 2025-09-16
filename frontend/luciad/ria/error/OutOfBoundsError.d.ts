import { LuciadError } from "./LuciadError.js";
/**
 * An Error indicating that a coordinate transformation cannot be performed because the transformed
 * coordinate lies outside of the bounding box of the target spatial reference.
 */
export declare class OutOfBoundsError extends LuciadError {
  /**
   * Creates a new OutOfBoundsError.
   * @param message the error message
   */
  constructor(message?: string);
}