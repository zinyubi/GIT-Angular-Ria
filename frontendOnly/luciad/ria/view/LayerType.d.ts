/**
 * An enumeration. A LayerType can be assigned to a {@link Layer}. The choice for a LayerType usually depends on the nature of the data that the Layer is visualizing.
 */
export declare enum LayerType {
  /**
   * "BASE" LayerType.
   * <p/>
   * Indicates the layer must always be positioned as the last layer in the {@link Map}, behind all other layers.
   * Even when multiple BASE Layers are added to a {@link Map}, only the top one will be drawn.
   * <p/>
   * In practice this means that the visibility of other BASE-layers will be automatically turned off when a new visible BASE Layer is added.
   * <p/>
   * Layers of this type are usually layers with raster data.
   */
  BASE = "BASE",
  /**
   * "STATIC" LayerType.
   * <p/>
   * LuciadRIA uses this flag to optimize the rendering with the assumption that the model contains data that does not change often or at all.
   * <p/>
   * This is the default.
   */
  STATIC = "STATIC",
  /**
   * "DYNAMIC" LayerType.
   * <p/>
   * LuciadRIA uses this flag to optimize rendering with the assumption that a lot of data in the model changes often.
   * Use this layer type when you want the data updates on screen as fast as possible.
   */
  DYNAMIC = "DYNAMIC",
}