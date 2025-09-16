/**
 * An enumeration to describe face culling used in {@link MeshStyle}
 * @since 2021.0.1
 */
export declare enum FacetCullingType {
  /**
   * Indicates that faces should not be culled. This will paint a mesh with both its back-face and front-face.
   */
  NO_CULLING = 0,
  /**
   * Indicates that the back-face of a triangle should not be painted. This face culling type
   * can improve performance over {@link NO_CULLING}, and is recommended if you have data with
   * correctly oriented normals.
   *
   * Back-face culling can have functional benefits as well, as shown below. If you have a 3D scan
   * of the interior of a building, you can use backface culling to see the interior while your
   * camera is located on the outside of the mesh.
   *
   * <img src="media://3dtiles/ria_tileset_facet_culling.webp" alt="Using backface culling to see the interior of a mesh" width="600">
   */
  BACKFACE_CULLING = 1,
  /**
   * Indicates that the front-face of a triangle should not be painted. This face culling type
   * can improve performance over {@link NO_CULLING}.
   *
   * It is not very common to cull the front-face of the triangles of your dataset, as it will make your dataset
   * invisible from the intended viewing angle.
   *
   * This face culling mode can be used in very specialized applications, or in the case when your dataset
   * has inverted normals.
   */
  FRONTFACE_CULLING = 2,
  /**
   * Indicates that you know or assume that the data specifies the ideal face culling mode.
   * If the data does not specify anything, then {@link NO_CULLING} will be used as the fallback mode and both faces will be shown.
   *
   * Use this face culling mode in these cases:
   *
   * - You are not sure what the ideal culling mode is, so you want {@link NO_CULLING} as the default mode unless there is a better option.
   * - The data set uses glTF 2.0 which explicitly defines face culling.
   * - The data set has a mix of double-sided and single-sided materials.
   *
   * If the culling behavior of your data is not as you expected, you can still override with one of the other options.
   * @since 2023.1
   */
  BASED_ON_DATA = 3,
}