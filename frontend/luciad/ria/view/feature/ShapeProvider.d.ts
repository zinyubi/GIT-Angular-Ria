import { Evented, Handle } from "../../util/Evented.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Feature, FeatureId } from "../../model/feature/Feature.js";
import { Shape } from "../../shape/Shape.js";
/**
 * <p>
 * A ShapeProvider allows you to map {@link Feature} from a single
 * model into different geometric representations. It is used by a
 * {@link FeatureLayer}.
 *
 * <p>
 * A common use case is to visualize a model on both a geographic map and a cartesian chart.
 *
 * For example, a <code>ShapeProvider</code> helps you display trajectories on a geodetic map in one layer,
 * and display same trajectories on a vertical chart in another layer.
 *
 * ```javascript
 * [[include:view/feature/ShapeProviderSnippets.ts_TRAJECTORY_SHAPE_PROVIDER]]
 * ```
 *
 * <p>
 * Example for a <code>ShapeProvider</code> that provides shapes asynchronously.
 *
 * ```javascript
 * [[include:view/feature/ShapeProviderSnippets.ts_ASYNC_SHAPE_PROVIDER]]
 * ```
 */
declare class ShapeProvider implements Evented {
  /**
   * An object that provides a {@link Feature} object.
   */
  constructor();
  /**
   * Returns a shape for the given feature.
   *
   * @param feature the feature for which this method provides a shape.
   * @return the shape associated with the input feature.
   */
  provideShape(feature: Feature): Shape | null;
  /**
   * Invalidates this ShapeProvider.
   * @deprecated Please use {@link ShapeProvider.invalidateAll invalidateAll} instead.
   */
  /**
   * Invalidates the shape for a specific object.
   * <p> Call this method when any state that determines the mapping for a feature to a shape has changed.
   * Calling this method guarantees that the object will be repainted with a new shape during the next map render.
   *
   * @param feature the feature whose shape should be reevaluated
   */
  invalidate(feature: Feature): void;
  /**
   * Invalidates this shape for a specific object by id.
   * <p> Call this method when any state that determines the mapping for a feature to a shape has changed.
   * Calling this method guarantees that the object will be repainted with a new shape during the next map render.
   *
   * @param featureId The id of the feature. It corresponds to `luciad/model/feature/Feature#id`.
   */
  invalidateById(featureId: FeatureId): void;
  /**
   * Invalidates shapes for all objects.
   * <p> Calling this method guarantees that all the objects will be repainted with new shapes during the next map render.
   */
  invalidateAll(): void;
  on(event: string, callback: (...args: any[]) => void, scope?: any): Handle;
  /**
   * The reference of the shapes produced by the provideShape method.
   *
   * <p> When the <code>ShapeProvider</code> instance is added to a <code>FeatureLayer</code>, and then
   * the layer is attached to a map, LuciadRIA determines if it is possible to visualize shapes on the map
   * by matching the shape provider reference to the map reference.
   *
   * <p> This property is optional. When it is not set, the <code>FeatureLayer</code> expects all shape references
   * to be the same as the reference of the <code>FeatureModel</code>.
   */
  get reference(): CoordinateReference | null;
  set reference(reference: CoordinateReference | null);
}
export { ShapeProvider };