import { Feature } from "./feature/Feature.js";
/**
 * An iterator over the result set of a query.
 * If the cursor returns features that do not have a <code>shape</code> property, then you will need to configure
 * a {@link ShapeProvider} on the {@link FeatureLayer} if you want to display the objects on a {@link Map}.
 *
 * @typeParam T Represents the type of elements that are served by the cursor.
 */
export interface Cursor<T = Feature> {
  /**
   * Returns <code>true</code> when the <code>Cursor</code> contains more elements.
   * @return <code>true</code> when the <code>Cursor</code> contains more elements.
   */
  hasNext(): boolean;
  /**
   * Returns the next element of the <code>Cursor</code>.
   * @return the next element of the <code>Cursor</code>.
   */
  next(): T;
}