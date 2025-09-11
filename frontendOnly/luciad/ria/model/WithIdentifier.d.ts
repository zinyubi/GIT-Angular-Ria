/**
 * Interface to identify an object based on an id.
 * This interface can be used to indicate that objects must have an id in some cases, for example
 * when checking whether an object is selected with {@link Map.isSelected}
 * @since 2021.0
 */
export interface WithIdentifier {
  /**
   * This unique id must uniquely identify the object within a layer/model.
   */
  id: number | string;
}