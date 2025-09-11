import { Mesh } from "./Mesh.js";
/**
 * Options to create a mesh with {@link create3DMesh}.
 */
export interface MeshCreateOptions {
  /**
   * An array of (U,V) coordinates. Each set of (U,V) coordinates must match
   * one (X,Y,Z) position in the positions array. The (U,V) coordinates map
   * to the image parameter.
   */
  texCoords?: number[];
  /**
   * The texture used by the 3D mesh.
   * It can either be a static image which can be :
   * - An HTMLImageElement
   * - An HTMLCanvasElement
   * - A path to an image
   *
   * Or it can be a HTMLVideoElement. For more information about using videos as textures:
   * <a href="articles://howto/featurepainting/visualizing_3d_icons.html?subcategory=ria_visualizing_features#video_texture">
   * Howto: Visualizing 3D icons
   * </a>
   */
  image?: HTMLImageElement | HTMLCanvasElement | string | HTMLVideoElement;
  /**
   * An array of (R,G,B,A) colors. Each set of (R,G,B,A) colors must match exactly
   * one (X,Y,Z) position in the positions array. If both colors and texture coordinates
   * are given for a vertex, then the resulting color will be combined by multiplying
   * the value of the image with the value of the color of the vertex. This allows
   * the colors attribute to act as a modulation color on top of a texture.
   */
  colors?: number[];
  /**
   * An array of (X,Y,Z) normals. Each (X,Y,Z) normal should match exactly one (X,Y,Z) position.
   * Normals have an effect on lighting, and should point outwards.
   */
  normals?: number[];
}
/**
 * Creates a 3D mesh, with the given parameters.
 *
 * ```javascript
 *  //Create a simple triangle in the X-Y plane
 *  var mesh = MeshFactory.create3DMesh([0,0,0, 1,0,0, 0,1,0], [0,1,2], {});
 *  //In your FeaturePainter
 *  featurePainter.paintBody = function(geocanvas, feature, shape, layer, map, paintState) {
 *    //An instance of Icon3DStyle
 *    var icon3dstyle = {mesh: mesh, legacyAxis: false};
 *    geocanvas.drawIcon3D(shape, icon3dstyle);
 * };
 * ```
 *
 * @param positions An array of positions containing (X,Y,Z) positions defined in a local cartesian reference.
 *                          The unit of measure is assumed to be meters.
 *                          You can control how the local mesh is placed in the world with {@link Icon3DStyle}.
 *                          Its documentation also provides a more in depth explanation of how to place the (local) positions in the world.
 *                          In short; the Y-axis points north, the X-axis points east and the Z-axis points up.
 *                          <table border="0" align="center">
 *                            <tr align="center">
 *                              <td width="300"><img src="media://icons3d/alignedmesh.png" alt="The positions in local cartesian reference" width="300"></td>
 *                              <td width="20"><br></td>
 *                              <td width="400"><img src="media://icons3d/localtoworld.png" alt="Local positions placed in world" width="400"></td>
 *                            </tr>
 *                            <tr align="center">
 *                              <td>The positions in local cartesian reference</td>
 *                              <td></td>
 *                              <td>Local positions placed in world</td>
 *                            </tr>
 *                          </table>
 * @param indices An array of indices connecting the various positions together as a set of triangles. Each triple of
 *                        indices points to the 3 vertices of a triangle. The indices of the triangle must match the indices
 *                        of the positions in the positions array.
 * @param options An object literal containing various options to create this 3D mesh.
 * @return A 3D mesh that can be painted by a {@link FeaturePainter}.
 */
declare function create3DMesh(positions: number[], indices: number[], options?: MeshCreateOptions): Mesh;
export { create3DMesh };