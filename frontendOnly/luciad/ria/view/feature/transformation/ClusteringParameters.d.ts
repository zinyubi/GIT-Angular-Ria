import { ClusterShapeProvider } from "./ClusterShapeProvider.js";
/**
 * This object literal represents a set of optional parameters which can be used in the
 * creation of a {@link ClusteringTransformer}.
 * @since 2016.0
 */
export interface ClusteringParameters {
  /**
   * An object that defines the location at which the center of the cluster will be placed.
   * By default, the location of the element closest to the center of mass of the contained elements is chosen.
   */
  clusterShapeProvider?: ClusterShapeProvider;
  /**
   * <p>
   *   Approximate cluster size in pixels.
   *   This size indicates the area of the cluster in screen space.
   *   For example, when passing 200 as value, the clustering algorithm will try to create clusters that are 200 pixels apart.
   * </p>
   *
   * <p>
   *   Note that the given size is an approximate size. The clustering algorithm may create smaller
   *   or larger clusters, depending on the data. The size of the cluster is influenced by:
   * </p>
   *
   * <ul>
   *   <li><i>This setting</i></li>
   *   <li><i>The proximity of other clusters.</i> Different clusters can start competing, trying to include the same
   *   point. This will cause clusters to be closer together than indicated by this setting, and thus be smaller.</li>
   *   <li><i>The amount of points in the cluster.</i> Clusters with a small amount of points will break down sooner
   *   than clusters with many points. This means that clusters with a small amount of points will typically be
   *   smaller.</li>
   * </ul>
   */
  clusterSize?: number;
  /**
   * Minimum number of elements with the same classification required to create a cluster.
   * By default, a cluster must contain at least 2 objects.
   */
  minimumPoints?: number;
  /**
   * Indicates whether clustering should be applied.
   * By default, clustering is enabled.
   * If noClustering is set to true, the other parameters won't be taken into account as no data will be clustered.
   */
  noClustering?: boolean;
}