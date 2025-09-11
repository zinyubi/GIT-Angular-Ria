import { Point } from "../shape/Point.js";
import { Bounds } from "../shape/Bounds.js";
import { CoordinateReference } from "../reference/CoordinateReference.js";
/**
 * A transformation between two coordinate reference systems. May not be instantiated with the
 * constructor. Instead, use the factory methods in the {@link TransformationFactory} module to create
 * instances of this class.
 */
export declare abstract class Transformation {
  /**
   * Transforms a point from the input reference to the output reference.
   *
   * @param  aInputPoint the point to transform specified in the input reference
   * @param [aOutputPointSFCT] the output point; if not specified a new point will be created
   * @return a point containing the transformed coordinate. If aOutputPointSFCT was present in the
   * parameters, aOutputPointSFCT will be returned
   * @throws {@link OutOfBoundsError} if the input point is not defined in the output reference
   */
  transform(aInputPoint: Point, aOutputPointSFCT?: Point): Point;
  /**
   * Transforms a bounding box from the input reference to the output reference.
   *
   * When transforming bounds between different projections, the resulting bounds are aligned
   * with the axes of the output reference system. This can lead to changes in shape and size,
   * as the transformed bounds may cover a larger area than the original.
   * Users should be aware of potential distortions and verify the transformed bounds for their specific application needs.
   *
   * @param inputBounds      the bounding box to transform, specified in the input reference.
   * @param outputBoundsSFCT the output bounds. If not specified, a new bounds will be created.
   * @return the transformed Bounds. If `outputBoundsSFCT` was provided, it will be transformed and returned.
   * @throws {@link OutOfBoundsError} if the input bounds is not defined in the output reference.
   */
  transformBounds(inputBounds: Bounds, outputBoundsSFCT?: Bounds): Bounds;
  /**
   * The reference of the source coordinates that are transformed.
   * <p/>
   * Returns null if unknown.
   *
   * @since 2023.0
   */
  get inputReference(): CoordinateReference | null;
  /**
   * The reference of the target coordinates after transformation.
   * <p/>
   * Returns null if unknown.
   *
   * @since 2023.0
   */
  get outputReference(): CoordinateReference | null;
  /**
   * Returns a transformation that does the inverse transformation, so from target to source coordinates.
   *
   * @since 2023.0
   */
  get inverseTransformation(): Transformation;
}