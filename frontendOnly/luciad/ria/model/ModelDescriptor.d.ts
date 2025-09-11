/**
 * An object containing metadata for a model.
 */
export interface ModelDescriptor {
  /**
   * A human readable description for the model.
   */
  description: string;
  /**
   * A human readable name for the model.
   */
  name: string;
  /**
   * The source from which this model was created.
   */
  source: string;
  /**
   * A String containing a type constant. This value provides an indication of what kind of data a model contains
   */
  type: string;
}