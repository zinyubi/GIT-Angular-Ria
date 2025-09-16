import { QuantityKind } from "./QuantityKind.js";
/**
 * A Unit Of Measure is a particular scale for measuring quantities of the same kind (see
 * {@link QuantityKind}).
 * <p>
 * You can discern two types of Units Of Measure: Standard and non-standard Units of Measure.
 * <ul>
 *   <li> Standard Units define a standard measure for a QuantityKind (See {@link QuantityKind}). </li>
 *   <li> A non-standard Unit is always defined in terms of a standard Unit, but applies a conversion
 *   factor and offset. </li>
 * </ul>
 * For example, "Meter" is a base Unit Of Measure that measures quantities of kind "Length" (and also
 * of "Distance", "Height", ... which are subtypes of "Length").  An example non-standard Unit related to the
 * "Meter" Unit Of Measure is the "Foot", which is 0.3048 "Meter".</p>
 *
 * <p>A Unit of measure cannot by created, it can only be retrieved from the
 * {@link UnitOfMeasureRegistry}</p>
 *
 * <p>An overview of the Unites of Measure currently supported by LuciadRIA :
 * <ul>
 *   <li>Dimensionless:
 *     <ul>
 *       <li>Number</li>
 *     </ul>
 *   </li>
 *   <li>Time:
 *     <ul>
 *       <li>Second</li>
 *       <li>Minute</li>
 *       <li>Hour</li>
 *       <li>Day</li>
 *     </ul>
 *   </li>
 *   <li>Temperature:
 *     <ul>
 *       <li>Kelvin</li>
 *       <li>Celcius</li>
 *       <li>Fahrenheit</li>
 *     </ul>
 *   </li>
 *   <li>Distance:
 *     <ul>
 *       <li>Meter</li>
 *       <li>FlightLevel</li>
 *       <li>Centimeter</li>
 *       <li>Foot</li>
 *       <li>FootUSSurvey</li>
 *       <li>Kilometer</li>
 *       <li>Mile</li>
 *       <li>NauticalMile</li>
 *     </ul>
 *   </li>
 *   <li>Angle:
 *     <ul>
 *       <li>Radian</li>
 *       <li>DegreeAngle</li>
 *     </ul>
 *   </li>
 *   <li>Raster size:
 *     <ul>
 *       <li>Pixels</li>
 *     </ul>
 *   </li>
 * </ul>
 * </p>
 */
export declare class UnitOfMeasure {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * The name of this UnitOfMeasure.  The name is used to identify the UnitOfMeasure in the
   * {@link UnitOfMeasureRegistry}
   */
  get name(): string;
  /**
   * The symbol of a UnitOfMeasure is typically a shorthand notation of it's name.  Example symbols are
   * "m" for Meter", "ft" for Foot and "°C" for degrees Celcius.
   */
  get symbol(): string;
  /**
   * The {@link QuantityKind} this UnitOfMeasure is a measure for.  Although this is not
   * strictly necessary, a Unit Of Measure typically refers to a base QuantityKind.  An example:  the "Meter"
   * UnitOfMeasure is a measure for the "Length" QuantityKind.
   */
  get quantityKind(): QuantityKind;
  /**
   * In case of a non-standard UnitOfMeasure, this property refers to its standard Unit Of Measure.  For example
   * the "Foot" UnitOfMeasure would refer to the "Meter" UnitOfMeasure.  If the UnitOfMeasure is a
   * standard UnitOfMeasure, this property refers to itself.
   */
  get standardUnitOfMeasure(): UnitOfMeasure;
  /**
   * The factor to convert a quantity expressed in this UnitOfMeasure to a quantity expressed
   * in the standard UnitOfMeasure.  This factor is used in combination with the
   * {@link conversionOffset}.  For a standard Unit Of Measure this multiplier is 1.  For a non standard
   * UnitOfMeasure, this is the value which must be used to convert a value in this UnitOfMeasure to the standard
   * UnitOfMeasure.  For example, for the "Foot" UnitOfMeasure, the conversionMultiplier is 0.3048 to convert feet
   * to meters.
   */
  get conversionMultiplier(): number;
  /**
   * The conversion offset for this Unit Of Measure.  For a standard Unit Of Measure the offset is 0.
   * <p>
   * For a non standard Unit Of Measure, this is the value which must be used to convert a value in this
   * UnitOfMeasure to the standard UnitOfMeasure.  For example, for the "DegreesCelcius" UnitOfMeasure, the
   * conversion offset is 273.15 to convert degrees Celcius to degrees Kelvin (0 degrees celcius corresponds
   * with 273.15 degrees Kelvin).
   * <p>
   * A more complex example is degrees Fahrenheit: the conversionOffset to calculate convert degrees Fahrenheit
   * to Kelvin is 273.15&nbsp;-&nbsp;(32&nbsp;*&nbsp;5&nbsp;/&nbsp;9).  The
   * {@link conversionMultiplier} is 5&nbsp;/&nbsp;9.
   */
  get conversionOffset(): number;
  /**
   * Converts a measure expressed in this UnitOfMeasure to the standard UnitOfMeasure (see
   * {@link standardUnitOfMeasure}).
      * @param value The value to be converted.
   * @returns The converted value.
   */
  convertToStandard(value: number): number;
  /**
   * Converts a measure expressed in the standard UnitOfMeasure to this standard UnitOfMeasure (see
   * {@link standardUnitOfMeasure}).
   * @param value The value to be converted.
   * @returns The converted value.
   */
  convertFromStandard(value: number): number;
  /**
   * Converts a measure expressed in this UnitOfMeasure to the corresponding measure in another, compatible
   * UnitOfMeasure.  Compatible UnitOfMeasures share the same base QuantityKind.
   * @param value The value to be converted
   * @param unit the target UnitOfMeasure.  This UnitOfMeasure must be a measure for a
   * compatible {@link QuantityKind} (i.e. they must share a common base
   * {@link QuantityKind}).
   * @returns {Number} The converted measure
   * @throws {@link QuantityKind} is not compatible with the
   * {@link QuantityKind QuantityKind} of this UnitOfMeasure.
   */
  convertToUnit(value: number, unit: UnitOfMeasure): number;
}