import { EditHandle } from "../EditHandle.js";
import { EditContext } from "../../controller/EditContext.js";
import { Point } from "../../../shape/Point.js";
import { Map } from "../../Map.js";
import { CascadingEditHandle } from "./CascadingEditHandle.js";
/**
 * Creates a shape "by template".
 *
 * After creation is started, the user clicks (or taps) once on the map to place the shape.
 * The clicked (or tapped) point is passed into the <code>applyTemplate</code> function.
 * That function moves the shape to the clicked point, and also changes its size so it fits the current view.
 * You can use {@link getDefaultSize} and {@link getDefaultPoint} to easily determine an appropriate size
 * and points for the shape.
 *
 * Finally, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class CreateByTemplateHandle extends CascadingEditHandle {
  /**
   * Creates a new CreateByTemplateHandle
   *
   * @param context The edit context
   * @param editHandles The edit handle to delegate editing to
   * @param applyTemplate A function that is called when the user clicks a point. This function should
   *                      move the shape to the clicked point, and resize it to an appropriate size.
   *                      You can use {@link getDefaultSize} and {@link getDefaultPoint} to help
   *                      resize the shape.
   */
  constructor(context: EditContext, editHandles: EditHandle[], applyTemplate: (context: EditContext, point: Point) => void);
}
/**
 * Calculates a default size for new shape templates, based on the current map state.
 *
 * For geographic maps, the returned size is in meters.
 * On cartesian maps, the returned size is in the map's unit of measure.
 *
 * @since 2022.1
 */
export declare function getDefaultSize(map: Map): number;
/**
 * Calculates a model point, off from the given <code>point</code> by a <code>distance</code> in the <code>azimuth</code> direction.
 *
 * @param map the map to find a point on
 * @param point the reference point to use. The new point is off by <code>distance</code> from this point, in the <code>azimuth</code> direction.
 * @param azimuth the direction to put the new point at.
 *                For geographic maps, this is an angle in degrees clockwise from the north direction. 0 points north, 90 points east.
 *                For cartesian references, 'north' is the positive Y direction.
 * @param distance the distance to put the new point at.
 *                 For geographic map references, this is interpreted as a distance in meters.
 *                 For cartesian references, the distance is in the map's unit of measure.
 *                 If not specified, this defaults to {@link getDefaultSize}
 *
 * @return A new model point, with the same reference as <code>point</code>, off by <code>distance</code> in the <code>azimuth</code> direction.
 * @see {@link getDefaultSize}
 * @since 2022.1
 */
export declare function getDefaultPoint(map: Map, point: Point, azimuth: number, distance?: number): Point;