import { LuciadError } from "./LuciadError.js";
/**
 * An Error indicating that a certain identifier could not be found.
 * @since 2024.1
 */
export declare class UnknownIdentifierError extends LuciadError {
  /**
   * The identifier that was not found.
   */
  identifier: string;
  /**
   * Creates a new UnknownIdentifierError.
   * @param message the error message
   * @param identifier the identifier that was not found
   */
  constructor(message: string, identifier: string);
}