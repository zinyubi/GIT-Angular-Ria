import { Color, Expression } from "../../util/expression/ExpressionFactory.js";
/**
 * This style can be used to add an outline to meshes and/or point clouds.
 *
 * This object can only be used with {@link TileSet3DLayer.outlineStyle} and
 * {@link OcclusionStyle.outlineStyle}.
 *
 * @since 2020.1
 */
export interface OutlineStyle {
  /**
   * Outline color that is applied to the object that is obscured by another object.
   * Note that this outline is only applied to the part of the object that is hidden.
   *
   * Note: The expression must not use an {@link attribute attribute expression}.
   * @since 2020.1
   */
  outlineColorExpression?: Expression<Color> | null;
  /**
   * The width of the outline in pixels. See {@link outlineColorExpression} for more information.
   * The width for the outline, must be larger than or equal to 0. To disable the outline it is recommended
   * to set {@link outlineColorExpression} to null.
   *
   * Note: Setting a large width can have a performance impact.
   *
   * @default 1
   * @since 2020.1
   */
  outlineWidth?: number;
}