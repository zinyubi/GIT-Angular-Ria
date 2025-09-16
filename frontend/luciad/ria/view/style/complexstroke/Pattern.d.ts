/**
 * This class represents a complex stroke pattern, for example a dash or an arrow.
 * This is a building block for creating complex stroked line styles
 * (see  {@link ComplexStrokedLineStyle}).
 *
 * <p>
 * Patterns cannot be instantiated directly.
 * Use the factory methods in the {@link PatternFactory} module to create Pattern instances.
 * Once created, you can combine patterns in a
 * {@link ComplexStrokedLineStyle}.
 * </p>
 *
 * @see {@link PatternFactory}
 * @see {@link ComplexStrokedLineStyle}
 * @since 2018.1
 **/
export declare class Pattern {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
}