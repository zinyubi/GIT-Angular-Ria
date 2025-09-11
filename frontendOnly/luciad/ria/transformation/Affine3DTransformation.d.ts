import { CoordinateReference } from "../reference/CoordinateReference.js";
import { Point } from "../shape/Point.js";
import { Vector3 } from "../util/Vector3.js";
import { Transformation } from "./Transformation.js";
/**
 * Options to create an {@link Affine3DTransformation} that applies a scale operation for each individual axis using
 * {@link createScaleTransformation}.
 * @since 2020.0
 */
export interface Affine3DTransformationCreateScaleOptions {
  /**
   * The scale of the X-axis. Default 1
   */
  scaleX?: number;
  /**
   * The scale of the Y-axis. Default 1
   */
  scaleY?: number;
  /**
   * The scale of the Z-axis. Default 1
   */
  scaleZ?: number;
  /**
   * The center of the scale operation on the X-axis. Default 0.
   */
  centerX?: number;
  /**
   * The center of the scale operation on the Y-axis. Default 0.
   */
  centerY?: number;
  /**
   * The center of the scale operation on the Z-axis. Default 0.
   */
  centerZ?: number;
  /**
   * The source reference of the transformation.
   * Default is non-geospatial 3D cartesian reference with its axes in meters. The reference defines the axes directions as X-east, Y-north and Z-up.
   */
  sourceReference?: CoordinateReference;
  /**
   * The destination reference of the transformation.
   * Default is non-geospatial 3D cartesian reference with its axes in meters. The reference defines the axes directions as X-east, Y-north and Z-up.
   */
  destinationReference?: CoordinateReference;
}
/**
 * Options to create an {@link Affine3DTransformation} that applies a rotation operation for each individual axis using Euler angles.
 * {@link createRotationTransformation}.
 * @since 2021.1
 */
export interface Affine3DTransformationCreateRotationOptions {
  /**
   * The reference of the transformation. This reference will be considered common with the destinationReference.
   * @default A non-geospatial 3D cartesian reference with its axes in meters. The reference defines the axes directions as X-east, Y-north and Z-up.
   */
  sourceReference?: CoordinateReference;
}
/**
 * Options to create an {@link Affine3DTransformation} that applies a translation operation for each individual axis. This will move around
 * the dataset in its own reference.
 * {@link createRotationTransformation}.
 * @since 2021.1
 */
export interface Affine3DTransformationCreateTranslationOptions {
  /**
   * The reference of the transformation. This reference will be considered common with the destinationReference.
   * @default A non-geospatial 3D cartesian reference with its axes in meters. The reference defines the axes directions as X-east, Y-north and Z-up.
   */
  sourceReference?: CoordinateReference;
}
/**
 * Options to create an {@link Affine3DTransformation} that applies an offset operation for the whole dataset using
 * {@link createOffsetTransformation}.
 * @since 2020.0
 */
export interface Affine3DTransformationCreateOffsetOptions {
  /**
   * The source reference of the transformation. This reference will be considered common with the destinationReference.
   * Defaults to geocentric.
   */
  sourceReference?: CoordinateReference;
}
/**
 * Options to create an {@link Affine3DTransformation} based on GeoLocation using
 * {@link createTransformationFromGeoLocation}.
 * @since 2020.0
 */
export interface Affine3DTransformationCreateGeoLocationOptions {
  /**
   * The azimuth rotation of the Affine3DTransformation in degrees.
   */
  azimuth?: number;
  /**
   * The anchor point of the dataset in its own local origin. Default is a (0,0,0).
   */
  anchorPoint?: Point;
  /**
   * The source reference of the transformation.
   * Default is non-geospatial 3D cartesian reference with its axes in meters. The reference defines the axes directions as X-east, Y-north and Z-up.
   */
  sourceReference?: CoordinateReference;
  /**
   * The destination reference of the transformation. Default is geocentric "EPSG:4978".
   */
  destinationReference?: CoordinateReference;
}
/**
 * Options to create an identity {@link Affine3DTransformation} using
 * {@link createIdentityTransformation}.
 * @since 2020.0
 */
export interface Affine3DTransformationIdentityTransformOptions {
  /**
   * The source reference of the transform.
   * Default is non-geospatial 3D cartesian reference with its axes in meters. The reference defines the axes directions as X-east, Y-north and Z-up.
   */
  sourceReference?: CoordinateReference;
  /**
   * The destination reference of the transform.
   * Default is non-geospatial 3D cartesian reference with its axes in meters. The reference defines the axes directions as X-east, Y-north and Z-up.
   */
  destinationReference?: CoordinateReference;
}
/**

 * An Affine3DTransformation contains an affine transformation that can be used to translate, scale or rotate
 * a {@link TileSet3DLayer}
 * @since 2020.0
 */
export declare class Affine3DTransformation extends Transformation {
  /**
   * Create a new transformation, based on a 4x4 matrix.
   * <p/>
   * Often, the input and output reference will be the same, but in some cases,
   * such as {@link createTransformationFromGeoLocation}, a transformation can be used to change reference.
   *
   * @param transformationMatrix The 4x4 matrix, in row-major order.
   * @param inputReference The reference the source points are expected in.
   * @param outputReference The reference the target points will be in.  If absent, the inputReference will be used.
   * @since 2024.1.07
   */
  constructor(transformationMatrix: number[], inputReference: CoordinateReference, outputReference?: CoordinateReference);
  /**
   * Returns the 4x4 matrix used by this transformation, in row-major order.
   * @since 2024.1.07
   */
  get transformationMatrix(): number[];
  /**
   * @return The inverse of this transformation, again an Affine3DTransformation.
   * @since 2024.1.07
   */
  get inverseTransformation(): Affine3DTransformation;
}
/**
 * <p>Creates an {@link Affine3DTransformation} based on a GeoLocation. This
 * <code>Affine3DTransformation</code> can be used to orient and geolocate an unreferenced
 * {@link TileSet3DLayer}.</p>
 *
 * <p>To do this, the following procedure is applied:
 * <ul>
 *   <li>The given anchor point is mapped to the given geoLocation</li>
 *   <li>If no anchor point is given, we use (0,0,0) as the default anchorpoint.</li>
 *   <li>The z-axis is considered to be the up direction, and will be mapped as perpendicular to the earth.</li>
 *   <li>The y-axis is considered to be the north direction, and will be mapped parallel to the to the earth, oriented towards the north pole.</li>
 *   <li>The given azimuth (default 0 if missing) will be used to rotate the dataset around its up-axis in a clockwise fashion.</li>
 * </ul>
 * </p>
 *
 * @param geoLocation The geolocation
 * @param options Configurable optional parameters
 *
 * @return An Affine3DTransformation
 * @since 2020.0
 */
export declare function createTransformationFromGeoLocation(geoLocation: Point, options?: Affine3DTransformationCreateGeoLocationOptions): Affine3DTransformation;
/**
 * <p>Creates an {@link Affine3DTransformation} that rotates a dataset. This
 * <code>Affine3DTransformation</code> can be used to rotate an unreferenced
 * {@link TileSet3DLayer} dataset around. It can also be chained together with
 * other primitive operations to allow for more complex transformations.</p>
 *
 * <p>
 * The order of euler rotation is applied as intrinsically and counter-clockwise as follows:
 * * First rotation around the Y-axis
 * * Then rotation around the X-axis
 * * Finally, rotation around the Z-axis
 * </p>
 *
 * @param rotation the rotation to apply in euler coordinates, in degrees
 * @param options options for the rotation
 * @since 2021.1
 */
export declare function createRotationTransformation(rotation: Vector3, options?: Affine3DTransformationCreateRotationOptions): Affine3DTransformation;
/**
 * <p>Creates an {@link Affine3DTransformation} that translates a dataset. This
 * <code>Affine3DTransformation</code> can be used to move an unreferenced
 * {@link TileSet3DLayer} dataset around. It can also be chained together with
 * other primitive operations to allow for more complex transformations.</p>
 *
 * <p>Note that this transformation will operate in the source reference. If you are dealing with a dataset
 * in a geocentric reference, have a look at {@link createOffsetTransformation} instead.</p>
 *
 * @param translation the translation to apply in the transformation in the unit-of-measure of the source reference.
 * @param options options for translation
 * @since 2021.1
 */
export declare function createTranslationTransformation(translation: Vector3, options?: Affine3DTransformationCreateTranslationOptions): Affine3DTransformation;
/**
 * Creates an <code>Affine3DTransformation</code> that applies a scale operation for each individual axis.
 *
 * @param options Configurable optional parameters.
 * @returns An affine 3D transformation that performs a scale operation
 * @since 2020.0
 */
export declare function createScaleTransformation(options?: Affine3DTransformationCreateScaleOptions): Affine3DTransformation;
/**
 * Creates an <code>Affine3DTransformation</code> that applies an offset to a dataset.
 * The offset is defined as an ENU (East-North-Up) vector. To determine the ENU orientation of the offset, this
 * function also requires an anchor point as the center of the transformation.
 *
 * An example of usage would be :
 * <code>Affine3DTransformation.createOffsetTransformation({x: 0, y: 0, z: -45}, model.bounds.focusPoint);</code>.
 * This would lower a dataset by 45 meters, with the model's bound center as the reference point for this operation.
 *
 * Note that this function is meant to be used for fine tuning a dataset's position. If the offset is too big,
 * dataset could end up in unexpected locations, or it could get misaligned with the Earth's horizon.
 *
 * @param offset The offset to apply on the position, in non-geospatial 3D cartesian reference (ENU) in meters on the 3 axis.
 * @param anchorPoint The reference point, from where the offset will be applied.
 * @param options Configurable optional parameter.
 * @returns An affine 3D transformation performing the requested translation.
 *
 * @since 2020.0
 */
export declare function createOffsetTransformation(offset: Vector3, anchorPoint: Point, options?: Affine3DTransformationCreateOffsetOptions): Affine3DTransformation;
/**
 * Creates an <code>Affine3DTransformation</code> that combines a chain of other Affine3DTransformations
 * in the given order.
 *
 * A pre-condition for this is that each <code>Affine3DTransformation</code> in the chain must have an output
 * reference that matches the input reference of the next <code>Affine3DTransformation</code>. If this pre-condition
 * is not met, an error will be thrown.
 *
 * @param affine3DTransformations A set of affine 3d transformations that need to combined in order as a single
 * affine 3d transformation.
 * @return An Affine3DTransformation that is the composite of the given transformations
 * @throws {@link !Error Error} Throws an error if the given chain of <code>Affine3DTransformations</code> can not be combined.
 * @since 2020.0
 */
export declare function createChainedTransformation(...affine3DTransformations: Affine3DTransformation[]): Affine3DTransformation;
/**
 * Creates an identity <code>Affine3DTransformation</code>. This transformation has no effect, and can be used
 * as a default when no transformation should occur.
 *
 * @return An Affine3DTransformation
 *
 * @since 2020.0
 */
export declare function createIdentityTransformation(options?: Affine3DTransformationIdentityTransformOptions): Affine3DTransformation;