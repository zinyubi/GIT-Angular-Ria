import { ProgrammingError } from "./ProgrammingError.js";
/**
 * An Error indicating an invalid spatial reference has been used.
 */
export declare class InvalidReferenceError extends ProgrammingError {
  /**
   * Creates a new InvalidReferenceError.
   * @param message the error message
   */
  constructor(message?: string);
}