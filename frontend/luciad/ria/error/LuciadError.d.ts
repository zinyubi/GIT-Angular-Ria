/**
 * The LuciadRIA extension of {@link !Error Error}
 */
export declare abstract class LuciadError extends Error {
  /**
   * The name of this error
   */
  name: string;
  /**
   * The message of this error.
   */
  message: string;
  constructor(message?: string);
}