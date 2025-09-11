import { Invalidation } from "../../util/Invalidation.js";
import { Bounded } from "../../shape/Bounded.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Bounds } from "../../shape/Bounds.js";
import { ModelDescriptor } from "../ModelDescriptor.js";
import { Model } from "../Model.js";
import { CoordinateType } from "../../reference/CoordinateType.js";
import { Handle } from "../../util/Evented.js";
import { HttpRequestOptions } from "../../util/HttpRequestOptions.js";
/**
 * Constructor options for {@link RasterImageModel}.
 */
export interface RasterImageModelConstructorOptions extends HttpRequestOptions {
  /**
   * The spatial reference of the images of an {@link RasterImageModel}
   */
  reference: CoordinateReference;
}
/**
 * A model that can provide access to raster images. To visualize such a model in a
 * {@link RasterImageLayer}.
 *
 * There are two implementations: {@link WMSImageModel}.
 *
 * <p>Note that this is an "abstract" model and should never be instantiated directly.
 * Only its subtypes can be directly instantiated.</p>
 *
 * <p><code>RasterImageModel</code> is not supported in hardware-accelerated map.</p>
 *
 *
 * @since 2013.1
 */
export declare abstract class RasterImageModel extends Invalidation implements Model, Bounded {
  /**
   * Creates a new image model with the given options. This is an "abstract" model and should never be instantiated directly.
   * @param options parameters to configure the {@link RasterImageModel}.
   */
  protected constructor(options?: RasterImageModelConstructorOptions);
  get coordinateType(): CoordinateType;
  get reference(): CoordinateReference;
  abstract get bounds(): Bounds;
  get modelDescriptor(): ModelDescriptor;
  set modelDescriptor(modelDescriptor: ModelDescriptor);
  /**
   * Signals that the underlying data for the tiled images has changed. If this model is
   * added to a map using a {@link RasterImageLayer}, calling this method will
   * thus trigger a refresh of the visualization.
   */
  invalidate(): void;
  /**
   * An event indicating that this Controller is invalidated.
   * Invalidated means that data has changed and the visualization needs to be refreshed.
   * This event fires when #invalidate is called.
   * @event
   */
  on(event: "Invalidated", callback: (...args: any[]) => void, context?: any): Handle;
}