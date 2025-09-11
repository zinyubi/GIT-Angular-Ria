import { Feature } from "../feature/Feature.js";
import { Cursor } from "../Cursor.js";
/**
 * A {@link Cursor} implementation that iterates over an array of elements.
 * <code>ArrayCursor</code> can be used in a custom implementation of {@link Codec} to return
 * a cursor over features.
 *
 * @typeParam T Represents the type of elements that are served by the cursor.
 *
 * @since 2023.0
 */
export declare class ArrayCursor<T = Feature> implements Cursor<T> {
  /**
   * Creates a new instance of <code>ArrayCursor</code>.
   * @param array an array of elements to iterate over
   */
  constructor(array: T[]);
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