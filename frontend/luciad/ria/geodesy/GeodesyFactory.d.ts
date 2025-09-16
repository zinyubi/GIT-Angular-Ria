import { Geodesy } from "./Geodesy.js";
import { CoordinateReference } from "../reference/CoordinateReference.js";
/**
 * Creates a geodesy instance for the given reference that performs distance, angle and interpolation
 * calculations by interpreting coordinates as coordinates in a given coordinate system.
 * <br><br>
 * If the `reference` is of Cartesian type, the function will return a Cartesian Geodesy instance.
 * For any other reference type, it will return an Ellipsoidal Geodesy instance.
 * <br><br>
 * Note: If you want to create a Cartesian Geodesy for a reference that is not of Cartesian type
 * (e.g., "EPSG:4978" which is Geocentric), use the {@link createCartesianGeodesy} method explicitly.
 *
 * @param  reference the reference
 * @return  a geodesy instance, either Cartesian or Ellipsoidal
 * @throws {@link ProgrammingError} if no reference was given or if the reference is not a
 * spatial reference.
 * @since 2024.0.01
 */
declare function createGeodesy(reference: CoordinateReference): Geodesy;
/**
 * Creates a geodesy instance for the given reference that performs distance, angle and interpolation
 * calculations by interpreting coordinates as coordinates in a Cartesian coordinate system.
 *
 * @param  reference the reference
 * @return  a geodesy instance
 * @throws {@link ProgrammingError} if no reference was given or if the reference is not a
 * spatial reference.
 */
declare function createCartesianGeodesy(reference: CoordinateReference): Geodesy;
/**
 * Creates a geodesy instance for the given reference that performs geodesy
 * calculations using the ellipsoid associated with the given reference.
 *
 * @param reference the reference
 * @return a geodesy instance
 * @throws {@link ProgrammingError} if no reference was given or if the reference is not a
 * spatial reference.
 */
declare function createEllipsoidalGeodesy(reference: CoordinateReference): Geodesy;
/**
 * Creates a geodesy instance for the given reference that performs geodesy
 * calculations using spherical approximations of the ellipsoid associated with the given
 * reference. The results of the calculations performed by this type of geodesy instance are less
 * accurate than the ellipsoidal variants, but can be computed faster.
 * <p/>
 * If earthRadius is specified instances returned by this method will use the given radius when performing
 * spherical calculations.
 * Otherwise an appropriate value for the earth radius will be chosen automatically based on the ellipsoid
 * associated with the given reference.
 *
 * @param reference the reference
 * @param earthRadius the radius of the sphere in meters
 * @return  a geodesy instance
 * @throws {@link ProgrammingError} if no reference was given or if the reference is not a
 * spatial reference
 */
declare function createSphericalGeodesy(reference: CoordinateReference, earthRadius?: number): Geodesy;
export { createGeodesy, createCartesianGeodesy, createEllipsoidalGeodesy, createSphericalGeodesy };