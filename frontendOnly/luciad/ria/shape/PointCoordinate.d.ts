/**
 * <p>
 *   The type that describes a point coordinates object as an array of ordered [x,y,z] numbers,
 *   representing a position in a 2D or 3D space. The x, y, and z elements are not expressed in a particular
 *   coordinate reference. The reference is implied by an API that uses this type.
 * </p>
 * <p>
 *   Note that shape factory functions: {@link createPolygon} expect the point coordinates
 *   input to be an array of <code>PointCoordinates</code>.
 * </p>
 * Example in TypeScript:
 *
 * ```typescript
 * createPolyline(reference, [[1,1], [1,2], [2,1]] as PointCoordinates[]);
 * ```
 * @since 2021.0
 */
export type PointCoordinates = [number, number] | [number, number, number];