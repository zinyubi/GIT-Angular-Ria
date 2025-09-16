import { Color, Expression } from "../../util/expression/ExpressionFactory.js";
import { Vector3 } from "../../util/Vector3.js";
import { FacetCullingType } from "./FacetCullingType.js";
import { MipmapFilteringType } from "./MipmapFilteringType.js";
import { PBRSettings } from "./PBRSettings.js";
/**
 * This is the general interface that describes a Mesh style object.
 *
 * <p/>
 * The Mesh style object defines styling expressions used by {@link TileSet3DLayer} layer to style Mesh data.
 * All properties are optional.
 * @since 2019.0
 */
export interface MeshStyle {
  /**
   * An expression to specify what colors to apply to mesh data.
   * <p/>
   *  To create expressions, you must use the factory methods in the {@link ExpressionFactory} module.
   *  The expression must be well-formed and resolve to a color value.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expression.
   * Changing the values of parameters is more efficient than replacing the whole expression.
   * <p/>
   * If you define a colorExpression, the texture data, if any, will not be displayed.
   * The color expression will determine the color.
   * <p/>
   * Note that the alpha component of the color is ignored so the color will be fully opaque, unless you enable {@link TileSet3DLayer.transparency}.
   * <p/>
   *
   * @default <code>null</code> If not set, the mesh will use the texture data of the mesh, if any.
   */
  colorExpression?: Expression<Color> | null;
  /**
   * Boolean indicating whether lighting effects should be applied to the mesh.
   * <p/>
   * The {@link GraphicsEffects graphics effects}.
   * This boolean indicates whether the lighting graphical effects should be applied to meshes styled with this style.
   * <p/>
   *
   * @default <code>true</code>
   */
  lighting?: boolean;
  /**
   * An expression to specify what colors to apply to selected mesh data.
   * <p/>
   *  To create expressions, you must use the factory methods in the {@link ExpressionFactory} module.
   *  The expression must be well-formed and resolve to a color value.
   *  This value can also be set to null to prevent selection from changing the color.
   * <p/>
   * If you want to update the styling very often, consider using parameters in your expression.
   * Changing the values of parameters is more efficient than replacing the whole expression.
   * <p/>
   * If you define a selectedColorExpression, the texture data, if any, will not be displayed while
   * selection is active for the selected part of the mesh.
   * The color expression will determine the color.
   *
   * ```javascript
   * [[include:view/style/MeshStyleSnippets.ts_CREATE_MESH_STYLE]]
   * ```
   *
   * <p/>
   * Note that the alpha component of the color is ignored so the selection color will be fully opaque.
   * <p/>
   *
   * @since 2020.0
   * @default An orange color expression.
   */
  selectedColorExpression?: Expression<Color> | null;
  /**
   * An expression to filter mesh data.
   * <p/>
   *  To create expressions, you must use the factory methods in the {@link ExpressionFactory} module.
   *  The expression must be well-formed and resolve to a boolean value.
   * <p>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than replacing the whole expression.
   *
   * ```javascript
   *   // Example of a visibility expression that makes everything inside a shape invisible.
   *   var _  = ExpressionFactory;
   *   var shape = _.orientedBox(layer.orientedBox);
   *   meshStyle.visibilityExpression =  _.not(_.isInside(shape));
   * ```
   * @default null meshes are visible by default.
   * @since 2020.0
   */
  visibilityExpression?: Expression<boolean> | null;
  /**
   * An expression to displace mesh data.
   * <p/>
   *  To create expressions, you must use the factory methods in the {@link ExpressionFactory} module.
   *  The expression must be well-formed and resolve to a point value.
   * <p>
   * If you want to update the styling very often, consider using parameters in your expressions.
   * Changing the values of parameters is more efficient than replacing the whole expression.
   *
   * ```javascript
   *   // Example of a displacement expression that pushes down everything inside a shape.
   *   var _  = ExpressionFactory;
   *   var shape = _.orientedBox(layer.orientedBox);
   *   meshStyle.displacementExpression =  _.pushDown(shape);
   * ```
   * @default null meshes are not displaced by default.
   * @since 2020.0
   */
  displacementExpression?: Expression<Vector3> | null;
  /**
   * This setting determines which side of the surfaces (facets) that make up a mesh are omitted (culled) from the rendering result.
   *
   * When rendering meshes, all surfaces that make up the mesh face a certain direction. This direction is often called the normal direction.
   * This normal is used to determine if the surface is being seen from the front or the back. When rendering objects that have no holes in
   * them, it is only possible to see the front of all surfaces. Graphics pipelines therefore often don't render the back sides of those surfaces
   * to speed up rendering.
   *
   * Apart from performance, some applications are made possible by enabling back-face culling. Consider for example a mesh that represents a room.
   * Its normals would all point to the inside of the room. When enabling back-face culling, you can see the walls and floor of the room, without
   * having to move the camera inside the room itself.
   *
   * In some cases however, enabling back-face culling (i.e. not rendering the back-side of surfaces) can have undesired artifacts. This can for example
   * happen:
   * - for objects with incorrect normals. In that case, you will for example only see the inside of a mesh instead of the outside
   * - for objects with holes in them. In that case, you won't be able to see the inside of the mesh, even when looking through the hole
   *
   * Both can be resolved by disabling culling.
   *
   * By default, no culling takes place and both sides of a surface are painted.
   *
   * ```javascript
   *   // Example of enabling backface culling
   *   meshStyle.facetCulling = FacetCullingType.BACKFACE_CULLING;
   * ```
   * @since 2021.0.1
   */
  facetCulling?: FacetCullingType;
  /**
   * This setting determines which mip map filtering to use when rendering large textures on small areas.
   *
   * Mipmap filtering is a technique used in computer graphics to improve the quality of textures when they are
   * displayed at different sizes. When a texture is displayed at a smaller size, the system selects the most
   * appropriate smaller version (mipmap) to reduce visual artifacts.
   *
   * If the mipmap filtering is set to MipmapFilteringType.BASED_ON_DATA and the data does not specify any type
   * of filtering, then no mipmap filtering will be applied. In this specific case, mipmap filtering is only enabled
   * if the data explicit says it is needed.
   *
   * However, mipmap filtering is not compatible with every type of texture. In effect, tile sets that use a
   * texture atlas may introduce visual artifacts. If you notice such artifacts, you should turn to
   * MipmapFilteringType.BASED_ON_DATA or MipmapFilteringType.NO_MIPMAP_FILTERING.
   *
   * This parameter should only be set during initialization. Modifying the filtering subsequently may result in the
   * new parameter not being applied to previously loaded geometries. A warning will be issued if the filtering is
   * changed post-initialization.
   *
   * By default, MipmapFilteringType.BASED_ON_DATA is assumed.
   *
   * ```javascript
   *   // force linear mipmapping
   *   meshStyle.mipMapFiltering = MipmapFilteringType.LINEAR_MIPMAPPING;
   * ```
   * @since 2024.0.03
   */
  mipMapFiltering?: MipmapFilteringType;
  /**
   * Configures the PBR shading effects applied to the mesh.
   * <p/>
   *
   * @default <code>null</code>
   * @since 2021.1
   */
  pbrSettings?: PBRSettings | null;
}