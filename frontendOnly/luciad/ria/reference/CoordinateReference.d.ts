import { Axis } from "./Axis.js";
import { CoordinateType } from "./CoordinateType.js";
import { ReferenceType } from "./ReferenceType.js";
/**
 * An object literal describing {@link CoordinateReference.axisInformation axis information}.
 * @since 2023.1
 */
export interface AxisInformation {
  /**
   * The {@link Axis.Name name} of the axis
   */
  name: Axis.Name;
  /**
   * An {@link Axis} instance, that contains all the metadata of the axis.
   */
  axis: Axis;
}
/**
 * A reference defines a coordinate system.  It minimally defines a set of Axes.
 */
declare class CoordinateReference {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * The name of this reference.
   */
  get name(): string;
  /**
   * The type of coordinate used with this reference.
   */
  get coordinateType(): CoordinateType;
  /**
   * The type of reference this is
   */
  get referenceType(): ReferenceType;
  /**
   * Compares two references for equality.
   *
   * @param otherReference The other coordinate reference this reference is compared with.
   * @return <code>true</code> if the references are equal, <code>false</code> otherwise.
   */
  equals(otherReference: CoordinateReference | null): boolean;
  /**
   * Retrieves Axis information by a given name.  Axis names are defined in the
   * {@link Axis.Name Name} enumeration.
   *
      * @param axisName The name of the axis you want to retrieve
   * @return The axis with the corresponding name
   */
  getAxis(axisName: Axis.Name): Axis;
  /**
   * The identifier of this reference.
   */
  get identifier(): string;
  /**
   * Returns an array of axis information object literals that are associated with the coordinate system.
   *
   * The order of the elements in
   * the array is preserved and can be used to disambiguate the meaning of coordinate tuples, for example (lon,lat)
   * versus (lat,lon) coordinate ordering.
   *
   * Note that this information is only relevant when decoding / encoding coordinates in a specific order (for example,
   * when implementing a Codec or when encoding coordinates in a URL).
   * When accessing coordinates through the LuciadRIA's Point.x/y/z, you will never have to take the axis information into account.
   * For example, when using geodetic (lon-lat) coordinates, Point.x will *always* return the points longitude, regardless
   * what the axes information indicates.
   *
   * @return the axis information object literals associated with the coordinate system.
   */
  get axisInformation(): AxisInformation[];
}
export { CoordinateReference };