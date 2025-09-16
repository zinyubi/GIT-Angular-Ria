import { CoordinateReference } from "../reference/CoordinateReference.js";
import { Transformation } from "./Transformation.js";
/**
 * Options for {@link createTransformation}.
 * @since 2023.1
 */
export interface CreateTransformationOptions {
  /**
   * Indicates whether the X coordinate of the map reference point should be normalized to be inside projection bounds.
   * Use this when you have {@link Map.wrapAroundWorld} enabled and want to transform an map reference point to a model reference (e.g. lon-lat) afterwards.
   *
   * For example, in a mouse coordinate readout, where you go from a view point, to a point in the map's reference (which can be outside projection bounds), to a point in a model reference (lon-lat).
   * You'll want to normalize the X coordinate in the map to model transformation.
   *
   * We recommend using {@link Map.wrapAroundWorld} as value.
   * This way, the created transformation will work on both maps, with {@link Map.wrapAroundWorld} enabled and disabled.
   *
   * @default false
   * @since 2023.1
   */
  normalizeWrapAround?: boolean;
}
/**
 * Creates a transformation between the two given references.
 * <p><p>
 * If you're working with a {@link Map.wrapAroundWorld} map, and you need to normalize
 * coordinates to inside the projection bounds, you can set the
 * {@link CreateTransformationOptions.normalizeWrapAround} option.
 * <p><p>
 * If your input reference cannot be wrapped around then no attempt at normalizing the coordinates will be made.
 * For more information, check <a href="articles://howto/view/map_wraparound.html?subcategory=ria_map_setup#_what_do_i_need_to_take_into_account_when_working_with_these_maps">Things to consider when using wrapAroundWorld</a>.
 * @param sourceReference      the source reference
 * @param destinationReference the destination reference
 * @param options An options object literal.
 *
 * @return a transformation instance
 *
 * @throws {@link ProgrammingError} if a transformation between the two given references could not be created
 */
declare function createTransformation(sourceReference: CoordinateReference, destinationReference: CoordinateReference, options?: CreateTransformationOptions): Transformation;
/**
 * Determines if the transformation between the two given references is an identity transformation.
 * This method can be used to check if the (small) overhead of performing identity transformations
 * can be avoided. Typically this is only need when transforming many coordinates in tight loops.
 *
 * @param sourceReference the source reference
 * @param destinationReference the destination reference
 * @return true if a non-identity transformation is required for the two given references; false otherwise
 */
declare function isTransformationRequired(sourceReference: CoordinateReference, destinationReference: CoordinateReference): boolean;
export { createTransformation, isTransformationRequired };