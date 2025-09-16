import { Color, Expression } from "../../util/expression/ExpressionFactory.js";
import { OutlineStyle } from "./OutlineStyle.js";
/**
 * This style can be used to visualize meshes and/or point clouds that are hidden by other objects (e.g. a building
 * behind another one, underground pipes, etc.).
 *
 * This object can only be used with {@link TileSet3DLayer.occlusionStyle}.
 *
 * @since 2020.1
 */
export interface OcclusionStyle {
  /**
   * Modulation color that is applied to the object that is obscured by another object.
   * To obtain the original color of the body you can use {@link defaultColor}
   * in the expression.
   * Note: The expression must not use an {@link attribute attribute expression}.
   * @since 2020.1
   */
  bodyColorExpression?: Expression<Color> | null;
  /**
   * When set an outline with the specified parameters will be drawn on the edges of the obscured 3D object.
   * Note that when a point cloud is not dense, an outline can be visible around individual points.
   *
   * @default null no outline is drawn around the obscured 3D object.
   * @since 2020.1
   */
  outlineStyle: OutlineStyle | null;
}