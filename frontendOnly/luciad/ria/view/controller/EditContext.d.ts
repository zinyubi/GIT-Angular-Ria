import { FeatureLayer } from "../feature/FeatureLayer.js";
import { Map } from "../Map.js";
import { Feature } from "../../model/feature/Feature.js";
import { Shape } from "../../shape/Shape.js";
import { EditSettings } from "./EditSettings.js";
/**
 * Provides context information to {@link EditHandle handles},
 * such as the {@link EditContext.feature feature},
 * its {@link EditContext.shape (sub)shape} being edited or created.
 *
 * @since 2022.1
 */
export declare class EditContext {
  /**
   * Creates a new {@link EditContext}.
   *
   * You might want to create a new {@link EditContext} when you want handles to work on a sub-shape,
   * for example the {@link ExtrudedShape.baseShape base shape of an extruded shape}.
   */
  constructor(map: Map, layer: FeatureLayer, feature: Feature, shape: Shape, settings: EditSettings);
  /**
   * The layer of the feature being edited or created.
   */
  get layer(): FeatureLayer;
  /**
   * The map on which the feature is being edited or created.
   */
  get map(): Map;
  /**
   * The feature being edited or created.
   */
  get feature(): Feature;
  /**
   * The (sub)shape being edited or created.
   *
   * This can differ from <code>context.feature.shape</code>, for example when editing
   * the {@link ExtrudedShape.baseShape base shape of an extruded shape}.
   *
   * Typically, you want to use {@link EditContext.shape context.shape} instead of <code>context.feature.shape</code>.
   * This ensures editors and handles work correctly with subshapes and base shapes.
   */
  get shape(): Shape;
  /**
   * Returns the edit settings configured for the current edit context.
   *
   * @see {@link EditController.getSettings}
   * @see {@link CreateController.getSettings}
   */
  get settings(): EditSettings;
}