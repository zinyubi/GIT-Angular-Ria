import { CoordinateReference } from "../reference/CoordinateReference.js";
import { Topology } from "./Topology.js";
/**
 * Creates a cartesian {@link Topology} instance.  The reference's
 * {@link CoordinateType} must be
 * {@link CoordinateType.CARTESIAN CARTESIAN}.
 * @param reference The reference for which a topology instance must be created.
 * @return the requested {@link Topology} instance
 * @throws {@link CoordinateType}
 * is not {@link CoordinateType.CARTESIAN CARTESIAN}.
 */
declare function createCartesianTopology(reference: CoordinateReference): Topology;
/**
 * Creates an ellipsoidal {@link Topology} instance.  The reference's
 * {@link CoordinateType} must be
 * {@link CoordinateType.GEODETIC GEODETIC}.
 * @param reference The reference for which a topology instance must be created.
 * @return the requested {@link Topology} instance
 * @throws {@link CoordinateType}
 * is not {@link CoordinateType.GEODETIC GEODETIC}.
 */
declare function createEllipsoidalTopology(reference: CoordinateReference): Topology;
export { createCartesianTopology, createEllipsoidalTopology };