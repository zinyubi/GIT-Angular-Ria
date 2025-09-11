import { HSPCTilesModel } from "../../model/tileset/HSPCTilesModel.js";
import { OGC3DTilesModel } from "../../model/tileset/OGC3DTilesModel.js";
import { Bounded } from "../../shape/Bounded.js";
import { Bounds } from "../../shape/Bounds.js";
import { OrientedBox } from "../../shape/OrientedBox.js";
import { Affine3DTransformation } from "../../transformation/Affine3DTransformation.js";
import { Evented, Handle } from "../../util/Evented.js";
import { Layer } from "../Layer.js";
import { LayerConstructorOptions } from "../LayerTreeNode.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
import { MeshStyle } from "../style/MeshStyle.js";
import { OcclusionStyle } from "../style/OcclusionStyle.js";
import { OutlineStyle } from "../style/OutlineStyle.js";
import { PointCloudStyle } from "../style/PointCloudStyle.js";
import { TileLoadingStatus } from "./TileLoadingStatus.js";
/**
 * Settings that affect the layer's performance.
 * For more information about how to use the performanceHints:
 * <a href="articles://howto/ogc3dtiles/tuning_pointclouds.html#_limiting_the_number_of_points_in_a_point_cloud_layer">
 * Howto: Tuning point clouds: Limiting the number of points in a point cloud layer.
 * </a>
 *
 * @since 2023.0
 */
export interface TileSet3DLayerPerformanceHints {
  /**
   * Determines the maximum number of points that can be displayed for point clouds.
   * If this value is set to null (which is the default), the number of points is unlimited.
   */
  maxPointCount: number | null;
}
/**
 * Constructor options for {@link TileSet3DLayer}.
 */
export interface TileSet3DLayerConstructorOptions extends LayerConstructorOptions {
  /**
   * <p>
   *   Set of parameters to balance the quality and performance of the layer.
   * </p>
   * @since 2023.0
   */
  performanceHints?: Partial<TileSet3DLayerPerformanceHints>;
  /**
   * <p>
   *   This floating point value determines the detail and general quality of the loaded tiles,
   *   providing a trade off between visual quality and performance.
   * </p>
   *
   * <ul>
   *   <li>A value of 1.0 indicates that it is up to the dataset to determine the quality.</li>
   *   <li>A higher value (such as 1.2) will load more tiles.</li>
   *   <li>A lower value (such as 0.5) will load less tiles.</li>
   * </ul>
   *
   * <p>
   *   It is generally recommended to keep this close to default, as high numbers might result in drastically reduced performance.
   *   A low number will improve performance, making it a good consideration for mobile devices.
   * </p>
   * <p>
   *   Default is 1.0.
   *   The valid range is any positive, non-zero number.
   * </p>
   */
  qualityFactor?: number;
  /**
   * Information on how the quality factor should be treated over the distance.
   * By default, the quality factor is treated as constant over the whole distance.
   * This corresponds to a farQualityFactorMultiplier equal to 1.
   * @since 2020.1
   */
  qualityFactorDistanceFalloff?: QualityFactorFalloffOptions;
  /**
   * <p>If set to true, the terrain elevation will be offset to avoid unwanted intersections with this layer.
   * False will leave terrain elevation at its original values.</p>
   * <p>Alternatively you can also set an object literal with some options: </p>
   * <ul>
   *   <li>enabled: true to enable, false to disable</li>
   *   <li>precise: true to enable a precise mode that more accurately matches the dataset.
   *   Note that this will use more CPU and memory.(default is false)</li>
   *   <li>offset: A number that indicates how many meters the terrain should be offset by when it
   *   intersects with this 3D mesh. Default is 20 meters, meaning the terrain will be pushed 20
   *   meters lower than this mesh to avoid intersections.</li>
   * </ul>
   * <p>The default is false.</p>
   */
  offsetTerrain?: {
    enabled?: boolean;
    precise?: boolean;
    offset?: number;
  } | boolean;
  /**
   * The styling of the layer's point cloud.
   */
  pointCloudStyle?: PointCloudStyle;
  /**
   * The styling of the layer's mesh.
   */
  meshStyle?: MeshStyle;
  /**
   * see {@link TileSet3DLayer.outlineStyle}
   * @since 2020.1
   */
  outlineStyle?: OutlineStyle | null;
  /**
   * see {@link TileSet3DLayer.selectedOutlineStyle}
   * @since 2023.1
   */
  selectedOutlineStyle?: OutlineStyle | null;
  /**
   *  see {@link TileSet3DLayer.occlusionStyle}
   *  @since 2020.1
   */
  occlusionStyle?: OcclusionStyle | null;
  /**
   *  see {@link TileSet3DLayer.selectedOcclusionStyle}
   *  @since 2023.1
   */
  selectedOcclusionStyle?: OcclusionStyle | null;
  /**
   * see {@link TileSet3DLayer.transparency}
   * @since 2020.1
   */
  transparency?: boolean;
  /**
   * The affine 3D transformation to
   * position, rotate and scale this dataset.
   * @since 2020.0
   */
  transformation?: Affine3DTransformation;
  /**
   * If set to false, this mesh will not be considered part of terrain.
   * This has implications on mapToViewTransformations that are set to mode TERRAIN. Default is true.
   * @since 2020.0
   */
  isPartOfTerrain?: boolean;
  /**
   * If set to true, draped content that is set to be draped on meshes will get draped on the mesh in this layer.
   * Default is false.
   *
   * Note that you can reduce "smearing" of draped content by using {@link drapeSlopeAngle}.
   *
   * @see {@link GenericIconStyle.drapeTarget}
   * @see {@link ShapeStyle.drapeTarget}
   * @see {@link RasterStyle.drapeTarget}
   *
   * @since 2022.1
   */
  isDrapeTarget?: boolean;
  /**
   * In the case where this mesh is draped, you might want to limit the slopes of the mesh that will receive draping data.
   * By default, any slope of your mesh will be draped. From flat surfaces (0°) to vertical walls (90°).
   * By setting the drapeSlopeAngle parameter you can limit the slope you allow draping data to be draped on. Only slopes between 0° and the angle set will be draped.
   * The value has to be given in degrees and has to be between 0° and 90°.
   * @since 2022.1
   */
  drapeSlopeAngle?: number;
  /**
   * The time tiles will take to fade in / out when changing their visibility, in milliseconds.
   * Setting this to 0 disables fading of tiles. They appear as soon as they are available.
   * Default is 200ms.
   * @since 2020.0
   */
  fadingTime?: number;
  /**
   * Sets the tile loading strategy to be used by this layer. Have a look at {@link TileLoadingStrategy}
   * for more details.
   * <p>
   * Default is {@link HSPCTilesModel HSPC}.
   * </p>
   * @since 2020.0
   */
  loadingStrategy?: TileLoadingStrategy;
  /**
   * Configure whether to use GPU-compressed textures or not for tiled mesh data.
   * <p/>
   * This can greatly reduce the amount of GPU memory needed, improve performance and stability.
   * <p/>
   * Enable when displaying meshes with large textures, such as reality capture reconstructions.
   * Disable when displaying meshes with lookup textures, such as CAD models.
   * <p/>
   * If your environment does not support GPU texture compression, this flag has no effect.
   * Use the "Device Support" sample to check if texture compression is supported by your device.
   * <p/>
   * Default is enabled.
   * @since 2022.0
   */
  textureCompression?: boolean;
  /**
   * The property that should be used to identify individual 3D models in the tileset.
   * Selection is only possible if the tileset provides relevant metadata,
   * and the configured ID property is available in the metadata of the downloaded content.
   * @since 2020.0
   */
  idProperty?: string;
  /**
   * Whether the layer is selectable. This means that, if possible, individual
   * 3D models from the data can be selected. This will only be possible if the idProperty option is set.
   * @since 2020.0
   */
  selectable?: boolean;
  /**
   * List of attributes that can be used in the meshStyle
   * {@link Expression expressions}. These attributes must be present in the source data set.
   * For {@link OGC3DTilesModel OGC 3D Tiles} only attributes from the binary batch table are currently supported.
   * @since 2020.0
   */
  attributes?: string[];
  /**
   * <p>An optional set of property names with a mandatory default value.
   * <p>Each property name indicates a value that can be used for expression-based styling. These properties
   * are not set on the model, but on the layer, thus allowing the same model to have different properties
   * exposed on different layers, and thus allowing different styling on different layers.
   * <p>Note that a property set on the layer can override a property (with the same name) that is already present in the model.
   * <p>Note that only numbers can be used as default values and update values.
   * <p>The key of the property is the name of the property. The value contains a default value. The default value
   * will be used as long as no other values are pushed to the layer. </p>
   * Example:
   *
   * ```javascript
   * [[include:view/tileset/TileSet3DLayerSnippets.ts_CREATE_SELECTABLE_LAYER_WITH_EXTRA_PROPERTIES]]
   * ```
   *
   * For more information about plugging in properties:
   * <a href="articles://howto/ogc3dtiles/plugging_in_properties.html">
   * Howto: plugging in properties from external data sources
   * </a>
   *
   * @since 2021.0
   */
  properties?: PropertiesDescriptor;
}
/**
 * Quality factor distance information.
 * This controls the distance curve at which quality factor gets altered.
 * Visually, it can be represented like this :
 *
 * <pre>
 * qualityFactor _______ A
 *                      \
 *                       \ B
 *                        -----------  qualityFactor * farQualityFactorMultiplier
 * </pre>
 *
 * With A being the nearDistance, and B the farDistance.
 *
 * @since 2020.1
 */
export interface QualityFactorFalloffOptions {
  /**
   * Distance at which the quality factor starts to be altered, in meters.
   * Closer than this distance, the layer quality factor is used.
   * Further, it starts to be impacted by the farQualityFactorMultiplier.
   */
  nearDistance: number;
  /**
   * Distance at which the factor is fully interpolated, in meters.
   * Between nearDistance and farDistance, linear interpolation on the distance occurs to alter the layer's
   * quality factor based on farQualityFactorMultiplier.
   * Further, the farQualityFactorMultiplier is fully applied.
   */
  farDistance: number;
  /**
   * The quality factor multiplier to apply in the distance.
   */
  farQualityFactorMultiplier: number;
}
/**
 * Represents a loading approach for 3D Data such as 3D tiles. This strategy
 * can have a large impact on memory usage, latency and visual behavior of your dataset.
 * This strategy can be set using {@link TileSet3DLayer.loadingStrategy}
 */
export declare enum TileLoadingStrategy {
  /**
   * This loading strategy will prioritize downloading detailed 3D data, given
   * the current camera position. This results in low latency as well as low memory usage. The
   * downside is that when the camera moves quickly, holes can appear temporarily where
   * no data has been requested before.
   * <p/>
   * For tiles with "additive" refinement, tiles of different levels will be loaded concurrently.
   * <p/>
   * This is the best strategy for tiles with "additive" refinement.  This includes {@link HSPCTilesModel HSPC}.
   */
  DETAIL_FIRST = 0,
  /**
   * This loading strategy will prioritize downloading low-level overview 3D data,
   * given the current camera position. This strategy will download tile levels in-order until
   * the required detail level is achieved. This has the benefit that it behaves better when
   * the camera is moving around quickly. The downside is that it has a relatively high
   * latency and an increased memory requirement to store the additional tile levels.
   * <p/>
   * This is the best strategy for tiles with "replacement" refinement.  This is usually the case for {@link OGC3DTilesModel OGC 3D Tiles}.
   */
  OVERVIEW_FIRST = 1,
}
/**
 * A <code>TileSet3DLayer</code> is a {@link Layer} that visualizes OGC 3D Tiles data.
 */
declare class TileSet3DLayer extends Layer implements Bounded, Evented {
  /**
   * Creates a <code>TileSet3DLayer</code> that can visualize 3D tiles in a LuciadRIA {@link Map}.
   * Supported models include:
   * <ul>
   *   <li>{@link OGC3DTilesModel}</li>
   *   <li>{@link HSPCTilesModel}</li>
   * </ul>
   * <p><img src="media://3dtiles/marseille.png" alt="Marseille mesh" width="300" /></p>
   * @param model A model containing 3D tiles-based data. If the given
   * model is not compatible, a ProgrammingError will be thrown.
   * @param options The options for this layer.
   */
  constructor(model: OGC3DTilesModel | HSPCTilesModel, options?: TileSet3DLayerConstructorOptions);
  isPaintRepresentationSupported(paintRepresentation: PaintRepresentation): boolean;
  /**
   * Erases the cached values of all external properties for the given IDs.
   * Consider calling this method when features with these IDs go out of view. It is especially useful for dynamically changing values.
   * Note that without calling an update, this will result in the default value being used for all properties when
   * these IDs come back in view.
   * You can only erase values for properties that were defined at construction time.
   * @see {@link TileSet3DLayerConstructorOptions.properties}
   * You can use the "FeaturesInViewChange" event to erase properties for features that left the view only.
   * @see {@link TileSet3DLayer.on}
   *
   * For more information about erasing plugged-in properties:
   * <a href="articles://howto/ogc3dtiles/plugging_in_properties.html">
   * Howto: plugging in properties from external data-sources
   * </a>
   *
   * @param ids the IDs you want to erase data for
   * @since 2021.0
   */
  eraseProperties(ids: number[]): void;
  /**
   * Updates the values for the external properties you describe with the update parameter. The update parameter
   * looks a lot like the properties descriptor used to create the layer. You provide a set of properties with IDs and
   * updateValues.
   * You can only update values for properties that were defined at construction time.
   * @see {@link TileSet3DLayerConstructorOptions.properties}
   * You can use the "FeaturesInViewChange" event to send updates for features that are present in the view only.
   * @see {@link TileSet3DLayer.on}
   *
   * Example:
   *
   * ```javascript
   * [[include:view/tileset/TileSet3DLayerSnippets.ts_UPDATE_PROPERTIES]]
   * ```
   *
   * For more information on updating plugged-in properties:
   * <a href="articles://howto/ogc3dtiles/plugging_in_properties.html">
   * Howto: plugging in properties from external data sources
   * </a>
   *
   * @param updates
   * @since 2021.0
   */
  updateProperties(updates: PropertiesUpdate): void;
  /**
   * The model of this layer.
   */
  get model(): HSPCTilesModel | OGC3DTilesModel;
  /**
   * <p>
   * The transformation applied to this <code>Tileset3DLayer</code>.
   * Can be changed to reposition, rotate and scale the entire dataset.
   * This transformation can be used to change the reference of the model. For cases where the model is
   * not-referenced, you will have to set a transformation before you can add this layer to a map.
   * </p>
   * <p>
   * Note that this will also impact the layer's {@link Bounds bounds}.
   * </p>
   * <p>
   * This layer will emit a {@link on TransformationChanged} event when this
   * transformation property has been changed.
   * </p>
   */
  get transformation(): Affine3DTransformation | null;
  set transformation(affine3DTransformation: Affine3DTransformation | null);
  /**
   * The bounds of the layer.
   * Those bounds are derived from those of the model, after applying the transformation provided through {@link Transformation transformation}, if any.
   * If no transformation is given, then the bounds are the same as the ones from the model.
   * In the case of 3D Tiles, it is recommended to use these bounds rather than the model bounds, so that the final reference and position can be captured.
   */
  get bounds(): Bounds;
  /**
   * The styling object used for this layer with Mesh data.
   * This layer will emit a {@link on MeshStyleChanged} event when its
   * meshStyle property or any property of the meshStyle have been changed.
   */
  get meshStyle(): MeshStyle;
  set meshStyle(style: MeshStyle);
  /**
   * The time tiles will take to fade in / out when changing their visibility, in milliseconds.
   * If set to 0, tiles will be popping as they are loaded on screen (fading disabled).
   * The longer it is, the longer tiles will be going from fully transparent to fully visible.
   * @since 2020.0
   */
  get fadingTime(): number;
  set fadingTime(timeMs: number);
  /**
   * The styling object used for this layer with PointCloud data.
   *
   * The layer will emit a {@link on PointCloudStyleChanged} event when its
   * pointCloudStyle property or any property of the pointCloudStyle have been changed.
   */
  get pointCloudStyle(): PointCloudStyle;
  set pointCloudStyle(style: PointCloudStyle);
  /**
   * When set an outline with the specified parameters will be drawn on the edges of the 3D object.
   * Note that when a point cloud is not dense, an outline can be visible around individual points.
   *
   * More information can be found in the howto article
   *     <a href="articles://howto/ogc3dtiles/occlusion_outline_highlight.html">
   *     Highlighting mesh and point cloud data</a>.
   *
   * The layer will emit a {@link on OutlineStyleChanged} event when its
   * outlineStyle property has been changed.
   *
   * @default null no outline is drawn around the 3D object.
   */
  get outlineStyle(): OutlineStyle | null;
  set outlineStyle(outlineStyle: OutlineStyle | null);
  /**
   * Similar to {@link TileSet3DLayer.outlineStyle} but the outline effect will only apply to object(s)
   * that are currently selected on the map.
   *
   * More information can be found in the howto article
   *     <a href="articles://howto/ogc3dtiles/occlusion_outline_highlight.html#occlusion_outline_selection">
   *     Using occlusion and outline styles for selected features</a>.
   *
   * The layer will emit a {@link on SelectedOutlineStyleChanged} event when its
   * selectedOutlineStyle property has been changed.
   *
   * @default null no outline is drawn around the selected 3D object(s).
   */
  get selectedOutlineStyle(): OutlineStyle | null;
  set selectedOutlineStyle(outlineStyle: OutlineStyle | null);
  /**
   * The occlusion style can be used to visualize 3D objects when they are obscured by other objects,
   * for example to highlight a building. When set the occluded part of the object will always be visible with the
   * outline and/or color configured on the {@link OcclusionStyle}.
   *
   * More information can be found in the howto article
   *     <a href="articles://howto/ogc3dtiles/occlusion_outline_highlight.html">
   *     Highlighting mesh and point cloud data</a>.
   *
   * Note: This styling is only applied when the 3D object is obscured by objects from the same layer or
   * from layers that are beneath the layer containing the mesh.
   * Objects from layers higher up in the layer tree are not taken into account. Additionally, the
   * occlusion style is not applied to parts of the mesh that are obscured by the mesh itself (for example buildings in
   * a reality mesh).
   *
   * The layer will emit a {@link on OcclusionStyleChanged} event when its
   * occlusionStyle property has been changed.
   *
   * @default null the 3D object will not be visible when occluded by another layer.
   */
  get occlusionStyle(): OcclusionStyle | null;
  set occlusionStyle(occlusionStyle: OcclusionStyle | null);
  /**
   * Similar to {@link TileSet3DLayer.occlusionStyle} but the occlusion effect will only apply to objects
   * that are currently selected on the map.
   *
   * More information can be found in the howto article
   *     <a href="articles://howto/ogc3dtiles/occlusion_outline_highlight.html#occlusion_outline_selection">
   *     Using occlusion and outline styles for selected features</a>.
   *
   * Note: This styling is only applied when the selected 3D object is obscured by objects from the same layer or
   * from layers that are beneath the layer containing the mesh.
   * Objects from layers higher up in the layer tree are not taken into account. Additionally, the
   * occlusion style is not applied to parts of the mesh that are obscured by the mesh itself (for example buildings in
   * a reality mesh).
   *
   * The layer will emit a {@link on SelectedOcclusionStyleChanged} event when its
   * selectedOcclusionStyle property has been changed.
   *
   * @default null the selected 3D object(s) will not be visible when occluded by other objects.
   * @since 2023.1
   */
  get selectedOcclusionStyle(): OcclusionStyle | null;
  set selectedOcclusionStyle(occlusionStyle: OcclusionStyle | null);
  /**
   * Indicates whether transparent surfaces should be painted transparent.
   * <p/>
   * Enable this if you know your data has transparency, and you want to see it.
   * The transparency can originate from transparent pixels in an rgba texture, transparent colors in a vertex attribute, or transparent colors from a {@link MeshStyle.colorExpression}.
   * <p/>
   * Note that this can have a significant performance impact, and as such it is disabled by default.
   * When disabled, transparent surfaces will just be opaque.
   *
   * @default <code>false</code>
   * @since 2020.1
   */
  get transparency(): boolean;
  set transparency(transparency: boolean);
  /**
   * The orientedBox is a tight-fitting 3D box around the dataset. The reference of this box is either the
   * reference of the model, or the output reference of {@link Transformation transformation}, if
   * a transformation has been set on this layer.
   * @since 2020.0
   */
  get orientedBox(): OrientedBox;
  /**
   * A property that hints the map whether not to treat this mesh as part of the terrain.
   * It is recommended to set this to true for all reality meshes (meshes that contain captures of the real world), and
   * set to false for any other tileset 3D layers, such as CAD models, BIM models or any other data type that does
   * not contain terrain as part of it.
   * Default value is true.
   * @since 2020.0
   */
  get isPartOfTerrain(): boolean;
  set isPartOfTerrain(isPartOfTerrain: boolean);
  /**
   * A property that indicates if draping content that is set to be draped on meshes should be draped on the mesh in this layer.
   * @default false.
   * @since 2022.1
   */
  get isDrapeTarget(): boolean;
  set isDrapeTarget(isDrapeTarget: boolean);
  /**
   * In the case where this mesh is set as a drape Target, this parameter sets the upper bound angle of slopes that will receive draping content. By default, slopes between 0° (flat surfaces) and 90° (vertical walls) will receive draping content.
   * If set, slopes between 0° and the drapeSLopeAngle will be draped.
   * Must be between 0° and 90°.
   * @default 90°.
   * @since 2022.1
   */
  get drapeSlopeAngle(): number;
  set drapeSlopeAngle(slopeAngle: number);
  /**
   * The quality factor active for the layer.
   * The quality factor along with the geometry error is used to decide if a given tile should be displayed at certain scales.
   * It's a non-zero, positive value. The default value is 1.0.
   *
   * The layer will emit a {@link on QualityFactorChanged} event when its qualityFactor property has been changed.
   */
  get qualityFactor(): number;
  set qualityFactor(qualityFactor: number);
  /**
   * Settings that affect the layer's performance.
   * The layer will emit a {@link on PerformanceHintsChanged} event when its performanceHints property has been changed.
   */
  get performanceHints(): TileSet3DLayerPerformanceHints;
  set performanceHints(performanceHints: TileSet3DLayerPerformanceHints);
  /**
   * The distance quality factor information.
   * With this it is possible to alter the quality factor in the distance.
   * For instance, specifying options like :
   *
   * <code>
   * {
   *   nearDistance: 50,
   *   farDistance: 900,
   *   farQualityFactorMultiplier: 0.2
   * }
   * </code>
   *
   * Will make the layer :
   * <ul>
   *   <li>Use its quality factor closer to 50m</li>
   *   <li>Interpolate between its quality factor and the far quality between 50 and 900m</li>
   *   <li>Use a quality factor of qualityFactor * 0.2 farther than 900m away</li>
   * </ul>
   *
   * @since 2020.1
   */
  get qualityFactorDistanceFalloff(): QualityFactorFalloffOptions;
  set qualityFactorDistanceFalloff(distanceInformation: QualityFactorFalloffOptions);
  /**
   * The {@link TileLoadingStrategy} used by this layer.
   * <p>
   * Default is {@link HSPCTilesModel HSPC}.
   */
  get loadingStrategy(): TileLoadingStrategy;
  set loadingStrategy(loadingStrategy: TileLoadingStrategy);
  /**
   * The ID property of the layer. This is the data property that is used to identify objects within the layer.
   */
  get idProperty(): string | undefined;
  set idProperty(value: string | undefined);
  get supportedPaintRepresentations(): PaintRepresentation[];
  /**
   * Determines whether the layer is selectable. This means that, if possible, individual
   * 3D models from the data can be selected. This will only be possible if
   * the {@link TileSet3DLayerConstructorOptions.idProperty} option is set.
   */
  get selectable(): boolean;
  set selectable(selectable: boolean);
  /**
   * Indicates the current status of tile loading.
   * @since 2023.0
   */
  get loadingStatus(): TileLoadingStatus;
  on(event: string, callback: (...args: any[]) => void, context?: any): Handle;
  /**
   * Called when the transformation on this layer has been changed.
   * @param event the 'TransformationChanged' event.
   * @param callback the callback to be invoked when the transformation of the layer changes. The callback gets the 'transformation'
   * {@link Affine3DTransformation} parameter, which is the new affine 3D transformation for the layer.
   * @event
   */
  on(event: "TransformationChanged", callback: (transformation: Affine3DTransformation) => void): Handle;
  /**
   * Subscribe on this event to sync your property updates with the changes of features in the view.
   *
   * ```javascript
   * [[include:view/tileset/TileSet3DLayerSnippets.ts_SUBSCRIBE_ON_FEATURES_IN_VIEW_CHANGE]]
   * ```
   *
   * This event will only get fired if you defined properties at construction time:
   * @see {@link TileSet3DLayerConstructorOptions.properties}
   * You can use this event to trigger an update or deletion of property values based on the features present in the view
   * @see {@link TileSet3DLayer.eraseProperties}
   *
   * For more information about subscribing to the layer event:
   * <a href="articles://howto/ogc3dtiles/plugging_in_properties.html">
   * Howto: plugging in properties from external data sources
   * </a>
   *
   * @param event
   * @param callback
   * @param context
   * @event
   * @since 2021.0
   */
  on(event: "FeaturesInViewChange", callback: (idsEnteredView: number[], idsLeftView: number[]) => void, context?: any): Handle;
  /**
   * Called when the qualityFactor on this layer has been changed.
   * @param event The "QualityFactorChanged" event.
   * @param callback The callback to be invoked when the qualityFactor changes.
   * The callback gets a number parameter, which is the new qualityFactor for the layer.
   * @event
   * @since 2023.0
   * */
  on(event: "QualityFactorChanged", callback: (qualityFactor: number) => void): Handle;
  /**
   * Fired when at least one of the {@link performanceHints} attribute changed.
   * @param event The "PerformanceHintsChanged" event.
   * @param callback The callback to be invoked when the performanceHints changes.
   * The callback gets a {@link TileSet3DLayerPerformanceHints} parameter, which is the new performanceHints for the layer.
   * @event
   * @since 2023.0
   */
  on(event: "PerformanceHintsChanged", callback: (performanceHints: TileSet3DLayerPerformanceHints) => void): Handle;
  /**
   * Fired whenever the {@link loadingStatus} attribute changes. For example, whenever new tiles have been loaded or
   * requested.
   *
   * @param event the 'LoadingStatusChanged' event.
   * @param callback the callback to be invoked when the tile loading status of the layer changes.
   * @event LoadingStatusChanged
   *
   * @since 2023.0
   */
  on(event: "LoadingStatusChanged", callback: (loadingStatus: TileLoadingStatus) => void): Handle;
  /**
   * Called when the pointCloudStyle on this layer has been changed.
   * @param event the 'PointCloudStyleChanged' event.
   * @param callback the callback to be invoked when the pointCloudStyle of the layer changes.
   * The callback gets a {@link PointCloudStyle} parameter, which is the new pointCloudStyle for the layer.
   * @event
   * @since 2024.1.01
   */
  on(event: "PointCloudStyleChanged", callback: (pointCloudStyle: PointCloudStyle) => void): Handle;
  /**
   * Called when the meshStyle on this layer has been changed.
   * @param event the 'MeshStyleChanged' event.
   * @param callback the callback to be invoked when the meshStyle of the layer changes.
   * The callback gets a {@link MeshStyle} parameter, which is the new meshStyle for the layer.
   * @event
   * @since 2024.1.01
   */
  on(event: "MeshStyleChanged", callback: (meshStyle: MeshStyle) => void): Handle;
  /**
   * Called when the outlineStyle on this layer has been changed.
   * @param event the 'OutlineStyleChanged' event.
   * @param callback the callback to be invoked when the outlineStyle of the layer changes.
   * The callback gets a {@link OutlineStyle} parameter, which is the new outlineStyle for the layer.
   * @event
   * @since 2024.1.01
   */
  on(event: "OutlineStyleChanged", callback: (outlineStyle: OutlineStyle) => void): Handle;
  /**
   * Called when the selectedOutlineStyle on this layer has been changed.
   * @param event the 'SelectedOutlineStyleChange' event.
   * @param callback the callback to be invoked when the selectedOutlineStyle of the layer changes.
   * The callback gets a {@link OutlineStyle} parameter, which is the new selectedOutlineStyle for the layer.
   * @event
   * @since 2024.1.01
   */
  on(event: "SelectedOutlineStyle", callback: (selectedOutlineStyle: OutlineStyle) => void): Handle;
  /**
   * Called when the occlusionStyle on this layer has been changed.
   * @param event the 'OcclusionStyleChanged' event.
   * @param callback the callback to be invoked when the occlusionStyle of the layer changes.
   * The callback gets a {@link OcclusionStyle} parameter, which is the new occlusionStyle for the layer.
   * @event
   * @since 2024.1.01
   */
  on(event: "OcclusionStyleChanged", callback: (occlusionStyle: OcclusionStyle) => void): Handle;
  /**
   * Called when the selectedOcclusionStyle on this layer has been changed.
   * @param event the 'SelectedOcclusionStyleChange' event.
   * @param callback the callback to be invoked when the selectedOcclusionStyle of the layer changes.
   * The callback gets a {@link OcclusionStyle} parameter, which is the new selectedOcclusionStyle for the layer.
   * @event
   * @since 2024.1.01
   */
  on(event: "SelectedOcclusionStyle", callback: (selectedOcclusionStyle: OcclusionStyle) => void): Handle;
}
export { TileSet3DLayer };
/**
 * A type to provide the definition for properties.
 *
 * @see {@link TileSet3DLayerConstructorOptions.properties}
 * @since 2021.0
 */
export type PropertiesDescriptor = {
  [propertyName: string]: PropertyDefinition;
};
/**
 * A type to provide updates for properties
 * see {@link TileSet3DLayer.updateProperties}
 * @since 2021.0
 */
export type PropertiesUpdate = {
  [propertyName: string]: UpdateDefinitionSingleValue | UpdateDefinitionMultiValue;
};
/**
 * When defining a property, you must provide a default value that will be used whenever
 * an actual value is missing or the cache has been cleared after erasing property values.
 * @see {@link TileSet3DLayerConstructorOptions}
 * @see {@link PropertiesDescriptor}
 * @since 2021.0
 */
export interface PropertyDefinition {
  default: number;
}
/**
 * When updating a property, you must provide the IDs that require an update.
 * see {@link TileSet3DLayer.updateProperties}
 * @since 2021.0
 */
export interface UpdateDefinition {
  ids: number[];
}
/**
 * When updating a property, you can provide a single value for all IDs that require an update.
 * see {@link TileSet3DLayer.updateProperties}
 * @since 2021.0
 */
export interface UpdateDefinitionSingleValue extends UpdateDefinition {
  value: number;
}
/**
 * When updating a property, you can provide multiple values for all IDs that require an update.
 * The number of values must equal the number of provided IDs. The order of both must match.
 * see {@link TileSet3DLayer.updateProperties}
 * @since 2021.0
 */
export interface UpdateDefinitionMultiValue extends UpdateDefinition {
  values: number[];
}