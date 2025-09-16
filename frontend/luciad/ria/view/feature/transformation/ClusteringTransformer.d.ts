import { Feature } from "../../../model/feature/Feature.js";
import { Classifier } from "./Classifier.js";
import { ClusteringParameters } from "./ClusteringParameters.js";
/**
 * Defines the clustering configuration object used by {@link ClusteringTransformerOptions.classParameters}.
 */
export interface ClassificationConfig {
  /**
   * When the classification of your object matches this exact string then the classification parameters
   * defined by <code>parameters</code> are applied.
   */
  classification: string;
  /**
   * Clustering parameters for this clustering class.
   */
  parameters: ClusteringParameters;
}
/**
 * Defines the clustering configuration object used by {@link ClusteringTransformerOptions.classParameters}.
 */
export interface ClassificationMatcherConfig {
  /**
   * When this predicate function evaluates to true then the <code>parameters</code> classification parameters
   * defined by <code>parameters</code> are applied.
   */
  classMatcher: (classification: string) => boolean;
  /**
   * Class configuration to use when the <code>classMatcher</code> function evaluates to true.
   */
  parameters: ClusteringParameters;
}
/**
 * A set of parameters to customize the clustering behavior used by {@link create}.
 */
export interface ClusteringTransformerOptions {
  /**
   * A classifier that provides a classification for the model objects.
   * By default, a classifier that returns the same classification for all the objects in the model is used.
   */
  classifier?: Classifier;
  /**
   * Default clustering parameters for every classification.
   */
  defaultParameters?: ClusteringParameters;
  /**
   * Array containing classConfig objects indicating specific clustering parameters for every classification or group thereof.
   */
  classParameters?: (ClassificationConfig | ClassificationMatcherConfig)[];
}
/**
 * A set of parameters to customize the clustering behavior used by {@link createScaleDependent}.
 */
export interface ScaleDependentClusteringOptions {
  /**
   * Array containing each of the scales marking the switching points
   * between the different <code>ClusteringTransformer</code> instances.
   */
  levelScales: number[];
  /**
   * The array of clustering transformers.<p/>
   * The length of the array should be greater by one from the length of <code>levelScales</code>.
   */
  clusteringTransformers: ClusteringTransformer[];
}
/**
 * <p>
 *   Transformer that applies clustering: if model elements are located close to each other, they are
 *   instead replaced by a single cluster feature. Whether elements are close is determined
 *   in view space, meaning it depends on the current zoom level and camera position.
 * </p>
 * <p>
 *   Additionally, selected or edited features are excluded from clustering.
 * </p>
 * <p>
 *   Only features with shapes that have a non-null {@link Shape.focusPoint focus point} are eligible for clustering.
 * </p>
 * <p>
 *   Note: A feature with a non-{@link Point} shape is treated as a point located at shape's
 *   {@link Shape.focusPoint focus point} by the clustering transformer.
 * </p>
 * @since 2016.0
 */
export interface ClusteringTransformer {}
/**
 * <p>
 *   Creates a new {@link ClusteringTransformer} instance.
 * </p>
 *
 * <p>
 *   You can assign classifications to the original model elements.
 *   Model elements with different classifications will never be put together in a single cluster.
 *   You can use this, for instance, to prevent air-units and ground-units to be put together in a single cluster.
 *   You can also specify the clustering configuration per classification.
 *   If you do not specify a separate configuration for a classification, the default configuration will be used.
 * </p>
 *
 * <p>
 *   Consult the class documentation for example usages of this method.
 *   The LuciadRIA developer guide contains some more information and examples.
 * </p>
 *
 * @param options A set of optional parameters to help you customize the clustering behavior.
 *
 * <p>
 * A classConfig object is a Javascript Object that contains an identifier for the class on which it applies,
 * and the clustering parameters that should be applied for that class.
 * </p>
 *
 * <p>
 *   To specify the class, the classConfig object must contain exactly one of the following two properties:
 * </p>
 *
 * <ul>
 * <li> <code>classification</code>: apply this configuration if the classification of your object matches this exact string </li>
 * <li> <code>classMatcher</code>: apply this configuration if this function is evaluated to true when passing the
 * classification of your object as a parameter </li>
 * </ul>
 *
 * <p>
 *   To specify the settings for that class, the classConfig object must also contain a <code>parameters</code> property:
 * </p>
 *
 * <ul>
 *   <li><code>parameters</code>: an instance of {@link ClusteringParameters} defining the parameters for the specified class.</li>
 * </ul>
 */
export declare function create(options?: ClusteringTransformerOptions): ClusteringTransformer;
/**
 * <p>
 *   This method returns whether a feature represents a cluster or not.
 * </p>
 *
 * <p>
 *   This method can for example be used when you want to visualize clustered data.
 *   You can use this in a painter to have a different code path for clusters and
 *   regular, non-clustered elements (for instance, to use different icons).
 * </p>
 *
 * @param feature The feature to check
 * @return <code>true</code> if the feature represents a cluster, <code>false</code> otherwise
 */
export declare function isCluster(feature: Feature): boolean;
/**
 * <p>
 *   Method which returns an array with all the features contained in a cluster.
 * </p>
 *
 * @param cluster The cluster. This element must pass the <code>isCluster</code> check.
 *
 * @return an array of <code>Feature</code> instances contained in the cluster.
 *           This array should not be modified.
 */
export declare function clusteredFeatures(cluster: Feature): Feature[];
/**
 * <p>
 *   This method allows to create a {@link ClusteringTransformer}
 *   which uses different clustering parameters for different scales.
 *   This is achieved by providing a set of scales, and for each scale a clustering transformer.
 * </p>
 *
 * <p>
 *   Each of the scales marks the switching point between the settings of the two clustering transformer instances
 *   at the corresponding indices in the clustering transformer array.</br>
 * </p>
 *
 * ```javascript
 * [[include:view/feature/transformation/ClusteringTransformerSnippets.ts_SCALE_DEPENDENT_TRANSFORMER]]
 * ```
 *
 * <p>
 *   Note that the scales needs to be ordered from a low value (=zoomed out scale) to a
 *   high value (=zoomed in scale).
 *   The clustering transformers need to use the same ordering: the transformer corresponding to the most zoomed out scale
 *   first, and the transformer corresponding to the most zoomed in scale last.
 *   As the scales indicate the switching point between two transformers, the number of needed transformers is equal to
 *   the number of scales + 1.
 * </p>
 *
 * <p>
 *   A visual example of the relation between the scale switching points and the different transformers is given below.
 *   The example uses 3 different switching scales, hence requires 4 transformers.
 * </p>
 *
 * ```javascript
 * Scale:             1 : 100 000          1 : 10 000           1 : 1000
 *
 *  (zoomed out) ---------- | ----------------- | ----------------- | ---------- (zoomed in)
 *
 *          transformer[0]      transformer[1]      transformer[2]       transformer[3]
 * ```
 *
 * @param options A set of parameters to help you customize the clustering behavior.
 */
export declare function createScaleDependent(options: ScaleDependentClusteringOptions): ClusteringTransformer;