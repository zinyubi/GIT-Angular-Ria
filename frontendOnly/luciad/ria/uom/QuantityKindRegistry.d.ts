/**
 * A registry that maintains the known {@link QuantityKind}.
 * @packageDocumentation
 */
/**
 *
 */
import { QuantityKind } from "./QuantityKind.js";
/**
 * Retrieves a {@link QuantityKind} with the given name.
 * @param name the name by which the QuantityKind is known.
 * @returns the QuantityKind with the given name.
 * @throws {@link !Error Error} if the quantityKind is not known.
 */
export declare function getQuantityKind(name: string): QuantityKind;
/**
 * Register a new quantity kind.
 *
 * ```javascript
 * var altitude = QuantityKindRegistry.registerKind("Altitude", "Length");
 * ```
 *
 * @param name the name of the {@link QuantityKind} to register.
 * @param generalization The generalization this subtype belongs to. Use <code>null</code> if
 * this quantity kind is not a subtype
 */
export declare function registerQuantityKind(name: string, generalization: string | null): QuantityKind;