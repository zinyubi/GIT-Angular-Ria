import { Feature, FeatureProperties } from "../../model/feature/Feature.js";
import { ShapeType } from "../../shape/ShapeType.js";
import { FeatureLayer } from "../feature/FeatureLayer.js";
import { Map } from "../Map.js";
import { CreateController, CreateControllerConstructorOptions } from "./CreateController.js";
/**
 * A basic create controller implementation that creates shapes based on a shape type
 * that is passed to the constructor.  Most shapes available in {@link ShapeFactory}
 * are supported.
 *
 * The minimum point count is set to 3 for polygons and 2 for polylines by default. You can set the minimum and
 * maximum number of points that should be created by this controller by using the
 * {@link CreateController.setPointCount} method.
 * <p>
 * Note that creation of {@link ShapeType.COMPLEX_POLYGON complex polygons},
 * {@link ShapeType.SHAPE_LIST shape lists},
 * {@link ShapeType.EXTRUDED_SHAPE extruded shapes} and
 * {@link ShapeType.ORIENTED_BOX oriented boxes} is not supported by this controller.
 * </p>
 */
export declare class BasicCreateController extends CreateController {
  /**
   * Constructs a new {@link BasicCreateController}.
   * @param shapeType The type of shape that must be created.
   * @param defaultProperties An optional object hash containing the properties that should be set on newly
   *                                   created features.
   * @param options an optional object hash containing general create controller options.
   */
  constructor(shapeType: ShapeType, defaultProperties?: FeatureProperties, options?: CreateControllerConstructorOptions);
  /**
   * Called when a new feature instance needs to be created. This implementation
   * will create a new Feature with an empty geometry of the type that was given at construction
   * time. The properties of the feature will be populated with the values, if any, that were
   * given at construction of the BasicCreateController.
   * @param map the map view
   * @param layer the layer
   * @return a new feature
   */
  onCreateNewObject(map: Map, layer: FeatureLayer): Feature;
  /**
   * Called when a complete feature has been created.
   *
   * The BasicCreateController will delegate to {@link CreateController.onObjectCreated}
   * only if a shape has been created. For example, if the controller is deactivated before the user
   * constructed a shape, the feature will not be added to the model.
   *
   * <p/>
   * The default implementation of this method adds the created object to the model
   * of the given layer. When the return is <code>true</code>, the controller will deactivate immediately.
   * When the return is a <code>Promise</code>, the controller will deactivate when the promise is resolved or when the promise is rejected.
   * <p/>
   *
   * @return When a <code>Promise</code> is returned, the controller will deactivate when the promise is resolved or when the promise is rejected.
   *         When no <code>Promise</code> is returned, the controller will deactivate immediately.
   */
  onObjectCreated(map: Map, layer: FeatureLayer, feature: Feature): void | Promise<void>;
}