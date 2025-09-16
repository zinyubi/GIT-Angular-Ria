import { Feature } from "../../../model/feature/Feature.js";
/**
 * Classifier interface. Classifies objects by providing a classification.
 * Objects with the same classification may or may not be clustered together. Objects with
 * distinct classifications are never clustered together.
 */
export declare abstract class Classifier {
  /**
   * Returns the classification of the given object, which should not be null.
   * This method should be idempotent.
   *
   * <p>
   * By default this method throws an exception. Implementations of this interface must provide an
   * implementation for this method.
   * </p>
   *
   * @param element an object that may be clustered.
   * @return the classification
   */
  getClassification(element: Feature): string;
}