import { Pattern } from "./Pattern.js";
/**
 * An object literal describing a decoration.
 * A decoration is a Pattern that is positioned once at a relative location along a line.
 * @since 2018.1
 **/
export interface Decoration {
  /**
   * The location at which to position the {@link pattern}.
   * This location is a relative position on the stroked line.
   * It is a value in the [0, 1] interval,
   * where 0 means the start of the line and 1 means the end of the line.
   *
   **/
  location: number;
  /**
   * The {@link Pattern} that is positioned at {@link location}.
   *
   * @see {@link PatternFactory}
   *
   **/
  pattern: Pattern;
  /**
   * Determines how the pattern is aligned to its {@link location}.
   * For example, if you use <code>"center"</code>, the middle of the pattern will coincide with the specified location.
   * If you use <code>"right"</code>, the right of the pattern will coincide with the specified location. This means that it will appear at the left of the location.
   * If it is not defined, the alignment is automatically determined: <code>"left"</code> if the location is 0, <code>"right"</code>
   * if the location is 1, and <code>"center"</code> otherwise.
   * <p>This property is optional.</p>
   **/
  alignment?: "left" | "center" | "right";
}