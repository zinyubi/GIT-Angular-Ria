import { Shape } from "../../shape/Shape.js";
/**
 * Describes the type of the feature id (RIA-3293).
 * @since 2023.1
 */
export type FeatureId = string | number;
/**
 * Interface describing feature properties.
 * @since 2020.1
 */
export interface FeatureProperties {
  [key: string]: any;
}
/**
 * Represents a vector data object with a shape. It may include application specific properties.
 *
 * @typeParam TShape Represents the type of feature's shape.
 *            Default type is inferred from the 'shape' passed to the constructor.
 * @typeParam TProperties Represents the type of feature's properties.
 *            Default type is inferred from the 'properties' passed to the constructor.
 *            If the 'properties' is not provided the type is defaulted to {@link FeatureProperties}.
 *
 * ```javascript
 * [[include:model/feature/FeatureSnippets.ts_TYPE_INFERENCE]]
 * ```
 */
export declare class Feature<TShape extends Shape | null = Shape | null, TProperties extends FeatureProperties = FeatureProperties> {
  /**
   * Creates a new feature with the given geometry and properties.
   * Represents a vector data object with a shape. It may include application specific properties.
   * @param shape the feature's shape.
   * @param properties an object hash containing the Feature's properties.
   * @param id the identifier of the Feature. This id may be omitted when instantiating a new feature: for example, before adding a Feature to a {@link MemoryStore}.
   * However, note that features which are part of the result of a {@link FeatureModel.query model query} must have an id.
   */
  constructor(shape: TShape, properties?: TProperties, id?: FeatureId);
  /**
   * The unique identifier of the Feature.
   * This unique id must uniquely identify the Feature within the context of a model, ie.within the context of a <code>luciad.model.feature.FeatureModel</code>.
   */
  get id(): FeatureId;
  set id(value: FeatureId);
  /**
   * The properties of the data object. This is optional and may be left undefined. Usually, this object is a key/value pair object.
   */
  get properties(): TProperties;
  set properties(value: TProperties);
  /**
   * Makes a deep clone of this feature.
   * @return a copy of this feature
   */
  copy(): Feature<TShape, TProperties>;
  /**
   * The shape of the feature
   */
  get shape(): TShape;
  set shape(shape: TShape);
}