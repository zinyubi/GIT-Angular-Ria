/**
 * A Quantity Kind is any observable property that can be measured and quantified numerically (http://qudt.org).
 * Example quantity kinds are "Length", "Time", "Mass", ...
 * <p>
 * QuantityKinds can be subtypes of other kinds.  For example, Length can be seen as a generalization of Distance,
 * Height or Altitude.  Vice versa is Distance a subtype of Length.
 * <p>
 * QuantityKinds cannot be instantiated, but must be retrieved from the
 * {@link QuantityKindRegistry}.
 */
export declare class QuantityKind {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * The name of this QuantityKind.  This name is unique and identifies the QuantityKind in the {@link QuantityKindRegistry}.
   */
  get name(): string;
  /**
   * The base QuantityKind is the topmost supertype of this QuantityKind.  For a base QuantityKind, this property
   * refers to itself.
   */
  get baseQuantityKind(): QuantityKind;
  /**
   *  * The generalization of this QuantityKind is the immediate supertype of this QuantityKind.
   * In case of a base QuantityKind the generalization is <code>null</code>.
   */
  get generalization(): QuantityKind | null;
  /**
   * Checks wether the passed quantityKind is a supertype of this QuantityKind.
   * @param quantityKind the QuantityKind that may or may not be a supertype of this QuantityKind
   * @returns <code>true</code> if the passed quantity is a supertype of this QuantityKind,
   * <code>false</code> otherwise.
   */
  isSubTypeOf(quantityKind: QuantityKind): boolean;
}