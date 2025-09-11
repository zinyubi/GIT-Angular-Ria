import { UnitOfMeasure } from "./UnitOfMeasure.js";
/**
 * Retrieves the Unit of Measure that is identified with a given name.

 * @param name The name that identifies the Unit of Measure being requested.
 * @returns The requested Unit Of measure
 * @throws {@link !Error Error} if the requested Unit Of Measure does not exist
 */
export declare function getUnitOfMeasure(name: string): UnitOfMeasure;
/**
 * Register a new unit of measure that acts as a standard for a quantity kind. All non-standard unit of measures
 * of the same quantity kind will map to this standard unit of measure.
 *
 * ```javascript
 * var squareMeterUOM = UnitOfMeasureRegistry.registerStandardUnit("SquareMeter", "m2", "Area");
 * var acreUOM = UnitOfMeasureRegistry.registerConversionUnit("Acre", "ac", "Area", 4046.68, 0);
 * ```
 *
 * @param name {@link UnitOfMeasure}
 * @param symbol The symbol of the {@link UnitOfMeasure}
 * @param quantityKindName The name of the QuantityKind of this {@link UnitOfMeasure}.
 *     A QuantityKind with this name MUST exist in the QuantityKindRegistry.
 * @returns the registered {@link UnitOfMeasure}
 *
 */
export declare function registerStandardUnit(name: string, symbol: string, quantityKindName: string): UnitOfMeasure;
/**
 * Register a non-standard unit-of-measure, with given conversion factors and offsets, to be able to map to the
 * standard unit-of-measure for that specific quantity kind.
 *
 * ```javascript
 * var yardUOM = UnitOfMeasureRegistry.registerConversionUnit("Yard", "yd", "Length", 0.9144, 0);
 * ```
 *
 * @param name {@link UnitOfMeasure}
 * @param symbol The symbol of the {@link UnitOfMeasure}
 * @param quantityKindName The name of the QuantityKind of this {@link UnitOfMeasure}.
 *     A QuantityKind with this name MUST exist in the QuantityKindRegistry.
 * @param conversionMultiplier The conversion multiplier (Number) of the {@link UnitOfMeasure}
 * @param conversionOffset The conversion offset of the {@link UnitOfMeasure}
 * @returns the registered {@link UnitOfMeasure}
 *
 *
 */
export declare function registerConversionUnit(name: string, symbol: string, quantityKindName: string, conversionMultiplier: number, conversionOffset: number): UnitOfMeasure;