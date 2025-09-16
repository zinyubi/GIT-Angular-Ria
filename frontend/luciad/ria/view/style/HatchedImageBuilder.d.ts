/**
 *
 * <p>Builder for creating a hatched image with a given line width and color. A typical use case of such
 * a hatched image is as image in a {@link FillStyle}.</p>
 *
 * <p>The generated image will only contain one line in every necessary direction (horizontal, vertical, slash
 * or backslash) on top of the background color (if background is enabled). When used in a <code>FillStyle</code>, this
 * image will be tiled to the required area, resulting in a hatched fill.</p>
 * <p/>
 *
 * Example code:
 *
 * ```javascript
 * [[include:view/style/HatchedImageBuilderSnippets.ts_HATCHED_PATTER]]
 * ```
 *
 * </p>
 * An example use case of such a pattern is as fill for a shape, for example:
 *
 * ```javascript
 * [[include:view/style/HatchedImageBuilderSnippets.ts_SHAPE_STYLE_WITH_PATTERN]]
 * ```
 */
declare class HatchedImageBuilder {
  /**
   *   Constructs a new builder.
   */
  constructor();
  /**
   * Builds the pattern with the current settings of this builder instance.
   *
   * @return An Image based on the current settings.
   */
  build(): HTMLImageElement;
  /**
   * Specifies which patterns should be used. This can be any combination of the constants defined in {@link Pattern}.
   *
   * @param patterns An array containing <code>Pattern</code> instances
   * @return this builder instance
   */
  patterns(patterns: HatchedImageBuilder.Pattern[]): HatchedImageBuilder;
  /**
   * <p>Sets the pixel size of the filling pattern. The pattern is created by drawing one line
   * in every necessary direction (horizontal, vertical, slash or backslash). This pattern is then
   * tiled to fill the required area. Changing the size of this pattern allows to define the spacing
   * between adjacent lines.  Defining a non-square pattern size for slanted patterns (slash and
   * backslash) allows to change the angle of the slanted lines. For example a slash pattern
   * with a pattern size of 20x10 results in 26.6 degree lines (Math.atan(10/20)).</p>
   *
   * <p>Width and height must be strictly larger than twice (line width + 2). The values should be small for
   * performance reasons, for example 10x10 or 20x10 pixels.</p>
   *
   * @param width The width in pixels
   * @param height The height in pixels
   * @return this builder instance
   */
  patternSize(width: number, height: number): HatchedImageBuilder;
  /**
   * <p>Sets the line width.</p>
   *
   * <p>Note that increasing the line width might require to increase {@link HatchedImageBuilder.patternSize} as well to obtain
   * the desired result.</p>
   *
   * @param lineWidth The line width in pixels
   * @return this builder instance
   * @see {@link patternSize}
   */
  lineWidth(lineWidth: number): HatchedImageBuilder;
  /**
   * Sets the line color
   *
   * @param lineColor The line color specified as a CSS string
   * @return this builder instance
   */
  lineColor(lineColor: string): HatchedImageBuilder;
  /**
   * <p>Sets the background color.</p>
   *
   * <p>Note that the background color will only be applied when the <code>BACKGROUND</code> pattern
   * is set on this builder.</p>
   *
   * @param backgroundColor The background color specified as a CSS string
   * @return this builder instance
   */
  backgroundColor(backgroundColor: string): HatchedImageBuilder;
}
declare namespace HatchedImageBuilder {
  /**
   * Enumeration for the different pattern types. Patterns can be combined, for example by
   * specifying both horizontal and vertical.
   */
  enum Pattern {
    /**
     * Fill pattern that hatches horizontally.
     */
    HORIZONTAL = "horizontal",
    /**
     * Fill pattern that hatches vertically.
     */
    VERTICAL = "vertical",
    /**
     * Fill pattern that hatches slanted, from lower left to upper right.
     */
    SLASH = "slash",
    /**
     * Fill pattern that hatches slanted, from upper left to lower right.
     */
    BACK_SLASH = "back_slash",
    /**
     * Fill pattern that fills the background with a given color.
     */
    BACKGROUND = "background",
  }
}
export { HatchedImageBuilder };