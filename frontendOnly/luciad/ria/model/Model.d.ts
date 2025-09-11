import { CoordinateReferenced } from "../reference/CoordinateReferenced.js";
import { CoordinateType } from "../reference/CoordinateType.js";
import { CoordinateReference } from "../reference/CoordinateReference.js";
import { ModelDescriptor } from "./ModelDescriptor.js";
/**
 * A container for objects that represent spatial data.
 */
export interface Model extends CoordinateReferenced {
  /**
   * The coordinate type of geometries in this model
   **/
  coordinateType: CoordinateType;
  /**
   * The reference in which this model is defined
   */
  reference: CoordinateReference;
  /**
   * An object containing metadata about this model
   */
  modelDescriptor: ModelDescriptor;
}