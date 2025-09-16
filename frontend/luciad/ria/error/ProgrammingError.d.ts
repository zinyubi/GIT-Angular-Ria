import { LuciadError } from "./LuciadError.js";
/**
 * An Error indicating incorrect usage of a function.
 */
export declare class ProgrammingError extends LuciadError {
  /**
   * Creates a new ProgrammingError.
   * @param message the error message
   */
  constructor(message?: string);
}