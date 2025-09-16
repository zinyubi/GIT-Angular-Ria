import { CoordinateReference } from "./CoordinateReference.js";
import { CoordinateType } from "./CoordinateType.js";
/**
 * An interface for objects that are defined with respect to a
 * {@link CoordinateReference coordinate reference}.
 */
export interface CoordinateReferenced {
  /**
   * The spatial reference in which this object is defined. If this
   * property is <code>null</code> then this object is not spatially referenced.
   */
  reference: CoordinateReference | null;
  /**
   * The coordinate type of this object. This property is never undefined. If reference is a non-null value then
   * this property must match the value of reference.coordinateType.
   */
  coordinateType: CoordinateType;
}