import { EditHandle } from "../../EditHandle.js";
import { ShapeStyle } from "../../../style/ShapeStyle.js";
import { EditContext } from "../../../controller/EditContext.js";
import { DrapeTarget } from "../../../style/DrapeTarget.js";
import { Shape } from "../../../../shape/Shape.js";
/**
 * Base class for a handle that draws helper shapes.
 *
 * Subclasses should override {@link EditHandle.onDraw} and draw shapes with {@link getHelperStyle}.
 * Typically the helper style is {@link EditHandleStyles.helperStyle}.
 *
 * @since 2022.1
 */
export declare class HelperHandle extends EditHandle {
  /**
   * Creates a new HelperHandle
   * @param helperStyle The style used to draw helper shapes.
   *                    If not defined, this defaults to the {@link EditHandleStyles.helperStyle context's helper style}.
   *                    If <code>null</code>, no helper shape is drawn.
   */
  constructor(helperStyle?: ShapeStyle | null);
  /**
   * Returns the default helper style.
   *
   * This is the helper style that is used if no <code>helperStyle</code> was passed into the constructor.
   *
   * @param context The edit context
   * @return The context's {@link EditHandleStyles.helperStyle helper style}
   */
  getDefaultHelperStyle(context: EditContext): ShapeStyle | null;
  /**
   * Returns the helper style, to be used for visualizing helper shapes in {@link onDraw}.
   *
   * This returns the helper style that was passed into the constructor.
   * If no helper style was passed into the constructor, this returns the {@link EditHandleStyles.helperStyle context's helper style}.
   *
   * @param context The edit context
   */
  getHelperStyle(context: EditContext): ShapeStyle | null;
  /**
   * Returns the drape target for a shape drawn by this helper handle.
   *
   * This will make sure "flat" helper shapes are draped on meshes, if there is a mesh layer on the map.
   * 3D helper shapes are not draped.
   *
   * In detail, this uses the following heuristics to determine a {@link DrapeTarget}:
   * By default, this uses the {@link ShapeStyle.drapeTarget drapeTarget} of {@link getHelperStyle}.
   * If that is not defined, this looks at the shape's Z bounds (depth). If the shape has depth, this returns {@link DrapeTarget.NOT_DRAPED}.
   * Otherwise, {@link DrapeTarget.ALL} is returned.
   *
   * @param context The edit context
   * @param shape the shape being drawn
   */
  getDrapeTarget(context: EditContext, shape: Shape): DrapeTarget;
}