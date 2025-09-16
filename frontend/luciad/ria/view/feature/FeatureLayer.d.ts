import { Feature } from "../../model/feature/Feature.js";
import { FeatureModel } from "../../model/feature/FeatureModel.js";
import { PanoramaModel } from "../../model/tileset/PanoramaModel.js";
import { Bounds } from "../../shape/Bounds.js";
import { Layer } from "../Layer.js";
import { LayerConstructorOptions } from "../LayerTreeNode.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
import { Snappable } from "../Snappable.js";
import { FeaturePainter } from "./FeaturePainter.js";
import { LoadingStrategy } from "./loadingstrategy/LoadingStrategy.js";
import { ShapeProvider } from "./ShapeProvider.js";
import { ClusteringTransformer } from "./transformation/ClusteringTransformer.js";
import { WorkingSet } from "./WorkingSet.js";
/**
 * Filter predicate type that checks visibility for each feature in the layer's working set.
 * See {@link FeatureLayer.filter}
 */
export type FilterPredicateType = (feature: Feature) => boolean;
/**
 * Defines settings that can be used with {@link FeatureLayerConstructorOptions.performanceHints}.
 * @since 2022.0
 */
export declare enum PerformanceHint {
  /**
   * Prefer maximum performance, possibly at the expense of visual quality, accuracy or correctness.
   */
  PREFER_PERFORMANCE = 0,
  /**
   * Prefer visual quality, accuracy and correctness, possibly at the expense of painting or loading performance.
   */
  PREFER_QUALITY = 1,
}
/**
 * Constructor options for {@link FeatureLayer}.
 */
export interface FeatureLayerConstructorOptions extends LayerConstructorOptions {
  /**
   * Whether the new layer is selectable, false by default for all layers.
   */
  selectable?: boolean;
  /**
   * Whether the new layer should be a potential target for snapping. True by default for all layers.
   */
  isSnapTarget?: boolean;
  /**
   * Whether the new layer is editable, true by default for feature layers.
   */
  editable?: boolean;
  /**
   * The feature painter to use. If omitted, a default {@link FeaturePainter} will be used.
   * This painter will draw the shape of the model object with a simple blue style. Set this
   * property to replace this with custom visualization behavior.
   */
  painter?: FeaturePainter;
  /**
   * The {@link loadingStrategy loading strategy} to use. If not set, the defaults are the following:
   * <ul>
   *   <li>If the model supports spatial querying, then a {@link LoadSpatially} data loading strategy is used.</li>
   *   <li>Else, an {@link LoadEverything} data loading strategy is used.</li>
   * </ul>
   */
  loadingStrategy?: LoadingStrategy;
  /**
   * ShapeProvider generates the shape which is associated with the feature from the model.
   */
  shapeProvider?: ShapeProvider;
  /**
   *  Configures the layer so it will not render all features at once,
   *  but instead will render them in small batches.
   *  This is useful when the layer contains a lot of data
   *  (e.g. a layer with many small features, or a layer with few very large features).
   *  In such cases, rendering can cause slow script warnings in the browser.
   *  On the one hand, by setting this flag to <code>true</code>, such warnings are
   *  avoided. On the other hand, the time it takes to draw all features on screen will
   *  be longer. Note that the added value of setting this flag to true depends very much
   *  on the nature of the data and the application. It is most useful for layers which
   *  visualize data that does not change very often, and in applications which need to
   *  remain responsive under frequent panning and zooming. When this value is undefined,
   *  the default value depends on this layer's loadingStrategy.
   */
  incrementalRendering?: boolean;
  /**
   * The clustering model transformer for this layer.
   */
  transformer?: ClusteringTransformer;
  /**
   * Predicate filter function for this layer.
   */
  filter?: FilterPredicateType;
  /**
   * The model used to retrieve images for `drawPanoramic` calls.
   * @see {@link GeoCanvas.drawPanorama}
   * @since 2020.1
   */
  panoramaModel?: PanoramaModel;
  /**
   * Whether the new layer detects hovering (i.e. a cursor hovering over features), false by default for all layers.
   * @since 2021.0
   */
  hoverable?: boolean;
  /**
   * Settings which affect the layer's painting and/or data loading performance.
   * @since 2022.0
   */
  performanceHints?: {
    /**
     * Determines which algorithm is used to triangulate polygons. The default setting is
     * {@link PerformanceHint.PREFER_QUALITY}, which chooses a fully robust triangulation algorithm. Using
     * {@link PerformanceHint.PREFER_PERFORMANCE} selects a faster but less robust algorithm. The fast algorithm expects
     * shapes which consist of a single outer ring and zero or more inner rings which form holes. The inner or outer
     * rings may neither intersect one another, nor may they be self-intersecting. Note that this setting only affects
     * filled area shapes.
     */
    tessellation?: PerformanceHint;
    /**
     * Specifies the quality setting to be used for the discretization of shapes such as geodetic lines. Using
     * {@link PerformanceHint.PREFER_PERFORMANCE} will produce fewer vertices but will therefore result in a less
     * accurate approximation of the actual shape. The default settings is {@link PerformanceHint.PREFER_QUALITY}.
     */
    discretization?: PerformanceHint;
    /**
     * Specifies the time per frame (in milliseconds) that the layer is allowed to spend on processing new features to
     * be drawn. Lower numbers will ensure that frame rate remains high, but can increase the time it takes for the map
     * to be fully up to date. Higher numbers will increase the throughput of updates at the cost of hiccups in the
     * frame rate. If this property is not set, a default value will be chosen based on the layer type. Values in the
     * range of 20 to 200 milliseconds are considered sensible. Much higher values can lead to disturbing hiccups
     * when interacting with the map.
     */
    maxPaintUpdateTimePerFrame?: number;
  };
}
/**
 * A feature layer displays a collection of Features ({@link Feature})
 * in the {@link Map}. Rendering of features is controlled via a
 * {@link FeaturePainter} object.
 */
export declare class FeatureLayer extends Layer implements Snappable {
  isSnapTarget: boolean;
  /**
   * Creates a FeatureLayer that displays the data represented by a given
   * {@link FeatureModel}.  A number of parameters
   * and flags can be set at construction time, such as amongst others the
   * {@link FeaturePainter}, {@link LoadingStrategy}, whether the layer is visible and/or selectable, etc.
   *
   * @param model the feature model to visualize
   * @param options an object hash containing layer parameters
   */
  constructor(model: FeatureModel, options?: FeatureLayerConstructorOptions);
  /**
   * Determines if the given paint representation is supported by this layer.
   * @param paintRepresentation a paint representation
   * @return {boolean} true if the paint representation is supported; false otherwise
   */
  isPaintRepresentationSupported(paintRepresentation: PaintRepresentation): boolean;
  get editable(): boolean;
  set editable(editable: boolean);
  get model(): FeatureModel;
  /**
   * The query used by this Layer.
   *
   * @deprecated Use a {@link QueryProvider} instead of the <code>query</code> property.
   *
   * <p>
   *   The simplest way to upgrade existing code to the {@link QueryProvider} approach is to create
   *   a {@link LoadEverything} loading strategy configured with the value of the `query` property.
   *   See the code example.
   * </p>
   * <p>
   *   For more information, see the
   *   <a href="articles://howto/featurepainting/performance/loading_strategies.html">
   *     How to use loading strategies and a query provider to load feature data
   *   </a>
   *   guide.
   * </p>
   *
   * ```javascript
   * [[include:view/feature/FeatureLayerSnippets.ts_QUERY_PARAMS]]
   * ```
   */
  get query(): any | null;
  set query(query: any | null);
  /**
   * The model transformer for this layer.
   * Set a {@link ClusteringTransformer} if you want to enable clustering,
   * or null when clustering should be disabled.
   */
  get transformer(): ClusteringTransformer | undefined;
  set transformer(transformer: ClusteringTransformer | undefined);
  get supportedPaintRepresentations(): PaintRepresentation[];
  /**
   * The bounds of the layer (read-only). This is the bounds of all the objects that are currently in this layer's workingSet.
   * The return value is undefined when no objects are shown. <br/>
   *
   * Note that this bounds includes all features that are currently in the working set. If there is a {@link FeatureLayer.filter} on the layer,
   * this means that the bounds may be bigger than what is actually visible on the screen.
   *
   * In order to get the bounds that applies only to the features that pass the filter, you can use the below utility function.
   *
   * ```javascript
   * [[include:view/feature/FeatureLayerSnippets.ts_COMPUTE_BOUNDS_WITH_FILTER]]
   * ```
   */
  get bounds(): Bounds | undefined;
  /**
   * The painter used to paint the objects in the layer. The property is both readable and writable.
   * If assigning to this property, the new value must have <code>luciad.view.feature.FeaturePainter</code>
   * in its prototype chain.
   */
  get painter(): FeaturePainter;
  set painter(painter: FeaturePainter);
  /**
   * <p>
   * The {@link LoadingStrategy} used by this layer.
   * This property can only be set through the constructor option.
   * </p>
   * <p>
   * If a loading strategy is not explicitly configured, a one will be selected automatically:  if the FeatureLayer's
   * {@link FeatureModel} supports spatial querying, the
   * {@link LoadSpatially} loading strategy will be used.  if not,
   * the {@link LoadEverything} data loading strategy will be used.
   * A {@link FeatureModel} supports spatial querying if its
   * {@link Store.spatialQuery spatialQuery}
   * method.
   * </p>
   *
   * @since 2015.0
   */
  get loadingStrategy(): LoadingStrategy;
  /**
   * The shape provider used by this layer.  A ShapeProvider maps a model object to a shape.
   * This shape is the geometry which is visualized by the layer.
   * It does not necessarily have to be the same as the .shape property of a <code>Feature</code>.
   * Both gettable and settable.
   */
  get shapeProvider(): ShapeProvider;
  set shapeProvider(shapeProvider: ShapeProvider);
  /**
   * The working set of this layer (read-only). A working set represents the objects which are being visualized by
   * the <code>FeatureLayer</code>. This may be a subset of the objects which are contained within the
   * <code>FeatureModel</code> of the FeatureLayer. This will be the case when the Store (either client side, or on
   * the server) has applied a filter on the results, based on the query-parameter. This may also be the case when
   * the FeatureLayer has not yet completed processing all objects or completed processing all model updates.
   */
  get workingSet(): WorkingSet;
  /**
   * <p>
   * Get or set the layer's filter function. This is a <b>predicate function</b>, a plain javascript function which
   * must return either <code>true</code> or <code>false</code>. The argument of this function is a
   * <code>Feature</code> contained in the workingSet.
   * </p>
   *
   * <p>
   *    If the feature does not pass the test of the filter function, the feature will not be visualized on the map.
   *    Selected objects which do not pass the filter will be deselected.
   * </p>
   * <p>
   *    Even though features may fail the filter-test, they still remain present in the layer's workingSet.
   *   To exclude features from the workingSet, use model-based filtering.
   * </p>
   *
   * <p>
   * For performance reasons, the result of the function is cached. This means that the filter function must be
   * idempotent: for identical input, the function must return the same boolean value. In practice, this means that
   * the function should not depend on mutable global state. If there is a state-change during the runtime of the
   * application which requires that the filter function must be re-evaluated, simply reset the filter on the layer.
   * </p>
   *
   * <p>
   *   Note that you can also use  <code>OGCConditions</code> as a filter. In order to do so, first convert the
   *   condition to a function with {@link toFeaturePredicate FilterFactory.toFeaturePredicate}.
   * </p>
   */
  get filter(): FilterPredicateType | null;
  set filter(filter: FilterPredicateType | null);
  /**
   * Determines whether the layer is selectable.
   */
  get selectable(): boolean;
  set selectable(selectable: boolean);
  /**
   * Determines whether the layer is hoverable (i.e. detects a cursor hovering over features).
   *
   * This flagged is used by the {@link HoverController}.
   * If you want to enable hovering, also make sure this controller is being used.
   * This controller is part of the default LuciadRIA map behavior.
   *
   * @see {@link PaintState.hovered}
   * @since 2021.0
   */
  get hoverable(): boolean;
  /**
   * Determines whether the layer is hoverable (i.e. detects a cursor hovering over features).
   * @since 2021.0
   */
  set hoverable(enabled: boolean);
  /**
   * The model used to retrieve panoramic images for {@link GeoCanvas.drawPanorama} calls.
   * Note that this is set once at construction time, and cannot be changed afterwards.
   * @since 2020.1
   */
  get panoramaModel(): PanoramaModel | null;
}