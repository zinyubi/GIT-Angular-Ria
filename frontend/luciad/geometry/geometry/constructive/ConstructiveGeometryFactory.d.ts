import { ConstructiveGeometry } from "./ConstructiveGeometry.js";
import { CoordinateReference } from "@luciad/ria/reference/CoordinateReference.js";
/**
 * Creates an instance of ConstructiveGeometry that performs operations using an ellipsoidal topology.
 *
 * Note that calling this method passing a reference with a spherical ellipsoid is equivalent to using
 * the <code> createSpherical </code> method.
 *
 * @param reference The reference for which a ConstructiveGeometry
 * instance must be created. It must be a geodetic reference.
 * @return An instance of ConstructiveGeometry that performs operations using an ellipsoidal topology.
 *
 */
declare function createEllipsoidal(reference: CoordinateReference): ConstructiveGeometry;
/**
 * Creates an instance of ConstructiveGeometry that performs operations using a cartesian topology.
 *
 * @param reference The reference for which a ConstructiveGeometry instance must be created.
 * @return An instance of ConstructiveGeometry that performs operations using a cartesian topology.
 *
 */
declare function createCartesian(reference: CoordinateReference): ConstructiveGeometry;
/**
 * Creates an instance of ConstructiveGeometry that performs operations using spherical approximations of the
 * ellipsoid associated with the given reference. The results of the calculations are less
 * accurate than the ellipsoidal variant, but can be computed faster.
 *
 * @param reference The reference for which a ConstructiveGeometry instance must be created.
 * @return An instance of ConstructiveGeometry that performs operations using a spherical topology.
 *
 */
declare function createSpherical(reference: CoordinateReference): ConstructiveGeometry;
export { createEllipsoidal, createCartesian, createSpherical };