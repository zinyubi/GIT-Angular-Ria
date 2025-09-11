import { Mesh } from "../../geometry/mesh/Mesh.js";
import { PBRSettings } from "./PBRSettings.js";
import { BloomStyle } from "./BloomStyle.js";
import { FacetCullingType } from "./FacetCullingType.js";
import { HttpRequestOptions } from "../../util/HttpRequestOptions.js";
/**
 * Base properties of a {@link Icon3DStyle}
 *
 * A 3D Icon is a styled, positioned and oriented mesh.
 * The mesh can either be generated using the {@link create3DMesh MeshFactory#create3DMesh} , or
 * it can be a GLB or glTF file, linked using an url.
 * <p>
 * In LuciadRIA, when working with a Topocentric reference (also known as ENU - East North Up reference)
 * or with a plain Cartesian reference, we use a <b>right-handed coordinate system</b>
 * in which we expect <b>+Z to align with the up-direction</b> and
 * <b>+Y to align with the forward-direction, which we define as pointing towards the north</b>.
 * <p>
 * These axis-definitions are important when working with orientation, especially heading, when styling the mesh.
 * A heading is always interpreted as the clockwise rotation starting from the north. Not having
 * a correctly oriented icon to start from might lead to unexpected orientations when applying heading.
 * <p>
 * When working with a GLB or glTF file, linked by an url, our axis-definition remains the same.
 * This means that we interpret the meaning of the coordinates inside the GLB mesh. When doing so, we
 * start from the official axis-definitions in GLB (+Y = UP, +Z = FORWARD (towards the viewer), -X = RIGHT)
 * to position and orient your icon to the best of our abilities:
 * we rotate it in such a way that the GLB-FORWARD (+Z) direction points North, which aligns with our own axes-definitions.
 * This however counts on the "correct" use of the GLB-defined-axes, which is something we cannot guarantee.
 * <p>
 * When working with an icon from URL, we strongly suggest the following strategy:
 * <ul>
 *   <li>First visualize the icon without any orientation or rotation applied.</li>
 *   <li>Next apply only rotation, until the top faces up and the expected forward direction faces north.
 *       This step "zeroes" the rotation, so that the actual orientation can easily be set in the next step.</li>
 *   <li>Now orient your icons in the world as desired: a heading of 0 makes it face north, a heading of 90 makes if face east.</li>
 * </ul>
 * Note that, in our experience, GLB's extracted from 3D Tiles datasets, need a 180° Z-rotation to have their
 * orientation correctly "zeroed".
 */
export interface GenericIcon3DStyle {
  /**
   * <p>The color of the mesh. For example <code>"rgb(125, 125, 125)"</code> or
   * <code>"rgba(125, 125, 125, 0.5)"</code>.</p>
   * <p>The default for this value is opaque white: rgba(255,255,255,1.0)</p>
   *
   * <p>Note that if the mesh contains textures, this color will act as a modulation color. This can be useful for selection:</p>
   *
   * ```javascript
   *   painter.paintBody = function(geoCanvas, feature, shape, map, layer, state) {
   *      //Applying a selection style using modulation color
   *      var icon3DStyle = {
   *         meshUrl: "aircraft.gltf",
   *         color: state.selected ? "rgba(255,0,0,0.5)" : "rgba(255,255,255,1.0)"
   *      }
   *      geoCanvas.drawIcon3D(shape, icon3DStyle);
   *    };
   * ```
   */
  color?: string;
  /**
   * Adds a {@link BloomEffect} to the 3D icon.
   *
   * Bloom is only supported on WebGL maps.
   *
   * @since 2022.1
   */
  bloom?: BloomStyle;
  /**
   * <p>Defines the orientation of a 3D icon. It can contain the following properties: </p>
   *
   *  <ul>
   *    <li> roll: A number defining the roll in degrees. Default value is 0 (parallel with earth). </li>
   *    <li> pitch: A number defining the pitch in degrees. Default value is 0 (parallel with earth). </li>
   *    <li> heading: A number defining the heading in degrees. Default value is 0 (north). </li>
   *  </ul>
   *
   *  The orientation is applied as roll first, then pitch and lastly heading.
   *
   *  <p>The difference between orientation and rotation is that orientation is defined in the world reference. Rotation
   *  on the other hand is defined in the local reference of the mesh.</p>
   *  <p>You should use rotation to align the mesh to its axes, before it is added to the world.</p>
   *  <p>You should use orientation to point the mesh in a certain world direction, after it has been added to the world.</p>
   *
   * ```javascript
   *    // The following example illustrates a plane rising upward with a pitch of 20 degrees against the horizon,
   *    // while heading west (270 degree azimuth).
   *   var orientation = {
   *     roll: 0,
   *     pitch: 20,
   *     heading: 270
   *   };
   * ```
   */
  orientation?: {
    /**
     * A rotation around the 3D icon's forward direction (aka "bank"). Negative angles bank the 3D icon left; positive angles bank the 3D icon right.
     */
    roll?: number;
    /**
     * The angle wrt. the horizon (aka. "tilt"). A value of 0 points the 3D icon towards the horizon (i.e. horizontally).
     * -90 points the 3D icon straight down towards the ground and +90 points the 3D icon straight up, towards the sky.
     * For 3D cartesian references, -90 points the 3D icon in the negative z direction and +90 points it in the positive z direction.
     */
    pitch?: number;
    /**
     * The angle wrt. the north direction. A value of 0 points the 3D icon towards the North pole.
     * The angle increases in clockwise direction, , e.g. +90 points the 3D icon to the east.
     * For 3D cartesian references, the y-direction serves as the north direction.
     */
    heading?: number;
  };
  /**
   * Defines the rotation angle in degrees around the various axes of the mesh in its local reference. Rotation
   * happens around (0,0,0) in the local reference of the mesh.
   * <p>By default the rotation is 0 for all axis. The rotation for any axis should be defined in degrees and be a positive floating point
   * number between 0 and 360.</p>
   *  <p>The difference between orientation and rotation is that orientation is defined in the world reference. Rotation
   *  on the other hand is defined in the local reference of the mesh.</p>
   *  <p>You should use rotation to align the mesh to its axes, before it is added to the world.</p>
   *  <p>You should use orientation to point the mesh in a certain world direction, after it has been added to the world.</p>
   *
   * ```javascript
   *   // Example of an orientation object with a 90 degrees rotation around the X-axis.
   *   var rotation = {
   *     x: 90,
   *     y: 0,
   *     z: 0
   *   };
   * ```
   */
  rotation?: {
    /**
     * The rotation around the x-axis. Default is 0.
     */
    x?: number;
    /**
     * The rotation around the y-axis. Default is 0.
     */
    y?: number;
    /**
     * The rotation around the z-axis. Default is 0.
     */
    z?: number;
  };
  /**
   * Defines the factor by which the 3D icon is scaled along the various axes of the mesh's local reference. Scale can be used
   * to convert a mesh from its local unit-of-measure to meters. By default, we assume that a mesh is defined in meters. If this
   * is not the case, scale can be used to enlarge or shrink the mesh to fit its own unit of measure.
   * <p>By default the scale is 1 for all axis. Note that the scale must be a positive, non-zero floating point value.</p>
   *
   * ```javascript
   *   // Example of scaling an object by a factor of a 1000, to convert it from millimeters to meters.</caption>
   *   var scale = {
   *     x: 1000,
   *     y: 1000,
   *     z: 1000
   *   };
   * ```
   */
  scale?: {
    /**
     * The rotation for the x-axis. Default is 1.
     */
    x?: number;
    /**
     * The rotation for the y-axis. Default is 1.
     */
    y?: number;
    /**
     * The rotation for the z-axis. Default is 1.
     */
    z?: number;
  };
  /**
   * Defines the distance by which coordinates are translated in the various axes direction of the mesh local reference. This
   * property should be used to center a mesh to (0,0,0) in its own local cartesian reference. This allows you to set the
   * anchorpoint of the mesh, which is useful when you want to rotate the mesh around a specific point.
   * <p>By default the translation is 0 for all axis. The translation can be a negative, or positive floating point number.</p>
   *
   * ```javascript
   *    // Example of how to translate a mesh 1000 meters along the Z-axis.</caption>
   *   var translation = {
   *     x: 0,
   *     y: 0,
   *     z: 1000
   *   };
   * ```
   */
  translation?: {
    /**
     * The translation via the x-axis. Default is 0.
     */
    x?: number;
    /**
     * The translation via the y-axis. Default is 0.
     */
    y?: number;
    /**
     * The translation via the z-axis. Default is 0.
     */
    z?: number;
  };
  /**
   * Configures the PBR shading effects applied to the mesh.
   * <p/>
   *
   * @default <code>null</code>
   * @since 2021.1
   */
  pbrSettings?: PBRSettings | null;
  /**
   * The Z-order of this shape. Shapes will be painted from lowest to highest Z-order, so that shapes with a higher
   * Z-order are painted on top of shapes with a lower Z-order. The default value is 0.
   *
   * <p> Note that the Z-order only has meaning in 2D.</p>
   *
   * By default the Z-order is 0.
   */
  zOrder?: number;
  /**
   * Indicates whether transparent surfaces should be painted transparently.
   *
   * <p>
   *    A transparent surface is a surface with either a color or a texture with an alpha channel value lower than 1.
   *    The transparency of a surface is not auto-detected.
   * </p>
   *
   * <p>
   *   If you set this property to true, LuciadRIA considers the mesh to have transparent surfaces, and renders it as such.
   *   If you set it to false, there is no guarantee that LuciadRIA renders the transparent surfaces of the mesh properly.
   *   For example, if you set transparency to false for this jet with a transparent cockpit, it has a see-through hole
   *   where the cockpit should be:</p>
   * <p>
   *
   *  <table border="0" align="center">
   *   <tr align="center">
   *    <td width="300"> <img src="media://icons3d/transparencyOff.png" alt="Transparency set to false" width="300"> </td>
   *    <td width="300"> <img src="media://icons3d/transparencyOn.png" alt="Transparency set to true" width="300">   </td>
   *    </tr>
   *   <tr align="center">
   *     <td>Transparency Off </td>
   *     <td>Transparency On  </td>
   *   </tr>
   * </table>
   * </p>
   *
   * <p>
   *   Note that setting this flag to true might affect performance.
   *   Use it for meshes with transparent surfaces only. Drawing a mesh with the transparency flag enabled comes at a cost. It amounts to drawing the mesh twice.
   * </p>
   * <p>
   *   This setting only applies to 3D maps.
   * </p>
   * @default <code>false</code>
   * @since 2022.0
   */
  transparency?: boolean;
  /**
   * <p>
   *   In LuciadRIA 2023.1 the axis directions were changed. This flag was added for compatibility reasons.
   * </p>
   * <p>
   *     This flag sets whether to use the legacy (< 2023.1) axis system (true) or Z-up (false) axis system.
   *     For maps with a cartesian reference, this flag is ignored and the Z-up axis system is used.
   *     For all other references, this flag is true by default.
   * </p>
   * <p>
   *     When this flag is enabled, the axis system will behave as it did in LuciadRIA 2023.0 and earlier:
   *     glTF meshes will have their forward vector face up, and their down vector face east.
   *     The XYZ coordinates of custom meshes are interpreted as North, West, and Up respectively.
   *     Rotations for all meshes are counterclockwise as seen from these directions.
   * </p>
   * <p>
   *     When legacy axis is disabled, glTF meshes will be rotated such that their forward vector faces north,
   *     and their down vector faces down. The XYZ coordinates of custom meshes are interpreted as East, North,
   *     and Up respectively. Rotations for all meshes are counterclockwise as seen from these directions.
   * </p>
   * <p>
   *   For more information, see
   *   <a href="articles://howto/featurepainting/visualizing_3d_icons.html?subcategory=ria_visualizing_features">
   *   Howto: Visualizing 3D icons</a>.
   * </p>
   *
   * @default <code>false</code>
   * @since 2023.1
   */
  legacyAxis?: boolean;
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
   *   iconStyle.facetCulling = FacetCullingType.BACKFACE_CULLING;
   * ```
   *
   * @default <code>FacetCullingType.NO_CULLING</code>
   * @since 2023.1
   */
  facetCulling?: FacetCullingType;
}
/**
 * <code>Icon3DStyle</code> that requires a {@link Mesh}.
 */
export interface MeshIcon3DStyle extends GenericIcon3DStyle {
  /**
   * A JavaScript object defining a 3D mesh. It can be created using the factory methods in the {@link MeshFactory} module.
   *
   *  <p>
   *  The vertices of the mesh are not georeferenced. Instead, it is assumed that the mesh is modeled in its own local
   *  coordinate system (i.e. the origin is in or near the mesh). The unit of measure is meters, but the scale factor
   *  can be used to scale this to a different unit. The axis order is as follows:
   *  </p>
   *
   *  <ul>
   *    <li> X-axis: forward-direction </li>
   *    <li> Y-axis: left-direction </li>
   *    <li> Z-axis: up-direction </li>
   *  </ul>
   *
   * ```javascript
   *    // Example of a simple 3D mesh defining a single triangle.</caption>
   *   var mesh = MeshFactory.create3DMesh([
   *       0, 0, 0,           // Vertex 0
   *       100000, 0, 100000  // Vertex 1
   *       0, 0, 100000       // Vertex 2
   *     ],
   *     [
   *       0, 1, 2            // Triangle 0-1-2
   *     ]
   *   );
   * ```
   */
  mesh: Mesh;
}
/**
 * <code>Icon3DStyle</code> that requires a URL to retrieve a 3D mesh.
 */
export interface MeshUrlIcon3DStyle extends GenericIcon3DStyle, HttpRequestOptions {
  /**
   * A URL referring to a mesh resource. For example <code>http://www.example.com/mesh.gltf</code>.
   * <p>
   *   Currently only the glTF format is supported.
   * </p>
   */
  meshUrl: string;
}
/**
 * An <code>Icon3DStyle</code> describes how a 3D icon is painted in a 2D and a 3D view.
 * <p>
 *   The key parts of an Icon3DStyle are:
 *   <ul>
 *     <li>A 3D mesh, such as a plane, a building, and so on</li>
 *     <li>A set of transformation parameters to align the 3D mesh in its own local origin: scale, rotation, and translation</li>
 *     <li>Transformation parameters to align the 3D mesh in the world: orientation</li>
 *   </ul>
 * </p>
 * <p>
 *   You can define a mesh with a mesh JavaScript object, or with a URL to a file that contains mesh data, such as a glTF file. By default, the following
 *   assumptions are made about the 3D mesh in LuciadRIA:
 *   <ul>
 *     <li>The Y-axis points forward: the part of the mesh that is considered the front is pointing in the positive Y-direction</li>
 *     <li>The X-axis points right: the right side of the mesh is facing the positive X-direction</li>
 *     <li>The Z-axis points up: the top of the mesh is facing the positive Z-direction</li>
 *     <li>The mesh is defined in meters</li>
 *     <li>The anchor point or center point of the mesh is at the XYZ-location (0,0,0)</li>
 *   </ul>
 *
 *   If any of the above does not hold true for your mesh, you can use the scale, rotation and translation parameters to make sure that
 *   the mesh is aligned to accommodate the list above.
 * </p>
 * <p>
 *   Example: you have a 3D aircraft mesh. The aircraft is defined in millimeters, and it
 *   points to the halfway point between the X and Y direction.
 * </p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="300"><img src="media://icons3d/aircraftMesh.png" alt="Aircraft mesh" width="300"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Aircraft mesh</td>
 *   </tr>
 * </table>
 * <p>
 *   If you want to align this mesh with our assumptions, you must scale by a factor of 1/1000, and rotate
 *   by 45 degrees about the Z-axis:
 * </p>
 *
 * ```javascript
 *    var icon3DStyle = {
 *      meshUrl: "aircraft.gltf",
 *      rotation:{
 *        z: 45
 *      },
 *      scale:{
 *        x: 1/1000,
 *        y: 1/1000,
 *        z: 1/1000
 *      }
 *    };
 * ```
 *
 * <p>
 *   This results in:
 * </p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="300"><img src="media://icons3d/alignedmesh.png" alt="Mesh" width="300"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Aligned mesh</td>
 *   </tr>
 * </table>
 * <p>
 *   Once you have your mesh correctly aligned in its own local reference using rotation, scale and translation, you are
 *   ready to orient the 3D mesh in the world.
 * </p>
 * <p>
 *   By default, the position of the mesh is parallel to the surface of the ellipsoid. The Y-direction points towards the north
 *   and the X-direction points towards the east.
 * </p>
 * <p>
 *   Note that since LuciadRIA 2023.1 {@link GenericIcon3DStyle.legacyAxis} was introduced. When this flag is set to true the 3D icons will
 *   still be rendered with the legacy axis system, where the X-axis points to the north and the Y-axis to the west.
 *   From the LuciadRIA 2024.0 release onwards, the default value of the legacy axis will be false. It is recommended to
 *   already set this to false.
 * </p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="300"><img src="media://icons3d/headingnorth.png" alt="Default orientation" width="300"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Default orientation</td>
 *   </tr>
 * </table>
 * <p>
 *   Note: when the mesh is visualized on a map with a cartesian world reference, the forward axis of the mesh points in the direction
 *   of the Y-axis of the cartesian coordinate system.
 * </p>
 * <p>
 *   You can change the heading, pitch and roll of the mesh by adjusting the orientation.
 * </p>
 * <p>
 *   Example: you want your aircraft to point to the east. You must make sure that its heading is 90 degrees, measured clockwise from the north.
 * </p>
 *
 * ```javascript
 *    var icon3DStyle = {
 *      meshUrl: "aircraft.gltf",
 *      ...
 *      orientation: {
 *        heading: 90 //make aircraft point to the east, or 90 degree azimuth.
 *      }
 *    };
 * ```
 *
 *  <p>
 *    This orientation results in:
 *  </p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="300"><img src="media://icons3d/headingeast.png" alt="Heading to the east" width="300"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Heading to the east</td>
 *   </tr>
 * </table>
 * <p>
 *   In addition to heading, an orientation object allows you to specify pitch and roll.
 *   See below for the effect of those parameters on the aircraft.
 * </p>
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="300"><img src="media://icons3d/headingeastpitch.png" alt="Heading and pitch" width="300"></td>
 *     <td width="20"><br></td>
 *     <td width="300"><img src="media://icons3d/headingeastpitchroll.png" alt="Heading, pitch and roll" width="300"></td>
 *   </tr>
 *   <tr align="center">
 *     <td>Heading and pitch</td>
 *     <td></td>
 *     <td>Heading, pitch and roll</td>
 *   </tr>
 * </table>
 * <p>
 *   Note that orientation.heading is analogous to IconStyle.heading, but for 3D meshes.
 * </p>
 * @since 2016.1
 */
type Icon3DStyle = MeshUrlIcon3DStyle | MeshIcon3DStyle;
export { Icon3DStyle };