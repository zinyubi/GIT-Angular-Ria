import { Feature, FeatureId } from "../../model/feature/Feature.js";
import { Bounds } from "../../shape/Bounds.js";
import { MatchAction } from "./MatchAction.js";
/**
 * <p>An expression that can be evaluated to produce a value.  This includes
 * {@link OGCExpression}, {@link OGCCondition} and {@link Identifier}.
 *
 * <p>For example: Boolean And, Boolean Not, Like, Add, Div, ...
 *
 * <p>It is not possible to create an <code>Expression</code> directly. Use {@link FilterFactory} functions instead.
 */
export declare class Expression {
  protected constructor();
}
/**
 * <p>An {@link Expression} that represents a condition that
 * evaluates to a boolean value.
 * <p>Must be created with FilterFactory functions.
 */
export declare abstract class OGCCondition extends Expression {}
/**
 * <p>Represent a feature ID filter. An ID filter limits a result set to just the features whose ids
 * match the ids represented by this filter. An ID filter is not an expression and cannot be used in
 * combination with other expressions.
 *
 * <p>Must be created with the {@link identifiers} method.</p>
 */
export declare class Identifiers {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
}
/**
 * <p>An OGC expression is a combination of one or more elements that form part of a predicate:
 * <p><u>OGC Filter specification 2.0</u>
 * <ul>
 *   <li> Literals (<code>&lt;fes:Literal&gt;</code>): {@link Literal}</li>
 *   <li> ValueReference (<code>&lt;fes:ValueReference&gt;</code>): {@link PropertyName}</li>
 *   <li> Functions (<code>&lt;fes:Function&gt;</code>):</li>
 * </ul>
 * <p><u>OGC Filter specification 1.0</u>
 * <ul>
 *   <li> Literals (<code>&lt;ogc:Literal&gt;</code>): {@link Literal}</li>
 *   <li> PropertyName (<code>&lt;ogc:PropertyName&gt;</code>): {@link PropertyName}</li>
 *   <li> Functions (<code>&lt;ogc:Function&gt;</code>): </li>
 *   <li> Arithmetic operators </li> </li>
 *   <ul>
 *     <li> Addition (<code>&lt;ogc:Add&gt;</code>): {@link add}</li>
 *     <li> Subtraction (<code>&lt;ogc:Sub&gt;</code>): {@link sub}</li>
 *     <li> Multiplication (<code>&lt;ogc:Mul&gt;</code>): {@link mul}</li>
 *     <li> Division (<code>&lt;ogc:Div&gt;</code>): {@link div}</li>
 *   </ul>
 * </ul>
 */
export declare abstract class OGCExpression extends Expression {}
/**
 * A mapping of XML namespace prefixes to namespace URLs.
 * @since 2023.1
 */
export interface XMLNamespaceMap {
  [prefix: string]: string;
}
/**
 * Represents the property of a feature. It corresponds to:
 *
 * <ul>
 *   <li><code>&lt;fes:ValueReference&gt;</code> element in the OGC Filter specification 2.0
 *   <li><code>&lt;ogc:PropertyName&gt;</code> element in the OGC Filter specification 1.0
 * </ul>
 *
 * <p>Must be created with the {@link property} method.
 */
export declare class PropertyName extends OGCExpression {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
}
/**
 * <p>Represents any explicitly stated value, such as a string, a pattern, or a number.
 * It corresponds to the OGC Filter <code>&lt;Literal&gt;</code> element.</p>
 *
 * <p>Must be created with the {@link literal} method.</p>
 */
export declare class Literal extends OGCExpression {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
}
/**
 * Creates an ID filter, which limits a result set to just the features whose ids match the ids
 * represented by the ID filter.
 * <p>An arbitrary number of IDs can be passed to the identifier method.
 *
 * ```javascript
 *   identifiers( [3, 5, "seven"] );
 * ```
 * @param objectIds An array containing id values: ResourceId values (OGC Filter ver. 2.0),
 *                  or GmlObjectId values (OGC Filter ver. 1.0)
 * @param featureIds An array containing FeatureId values (OGC Filter ver. 1.0 only).
 * @return The ID filter
 * @throws {@link !Error Error} when provided input parameters are not arrays
 */
export declare function identifiers(objectIds: FeatureId[], featureIds?: FeatureId[]): Identifiers;
/**
 * Creates a boolean AND condition. It represents a boolean AND evaluation of two or more conditions.
 * <p>Note that combining {@link Identifier} expressions with other expressions will result in an error.</p>
 *
 * ```javascript
 *   FilterFactory.and(
 *     FilterFactory.gt(
 *       FilterFactory.property("TOT_POP"),
 *       FilterFactory.literal(100000)
 *     ),
 *     FilterFactory.lt(
 *       FilterFactory.property("TOT_POP"),
 *       FilterFactory.literal(500000)
 *     )
 *   );
 * ```
 * @param condition1 The first {@link OGCCondition}.
 * @param condition2 The second {@link OGCCondition}.
 * @param varargs any number of additional {@link OGCCondition}.
 * @return The And Logical Operator.
 * @throws {@link !Error Error} if not all parameters are {@link OGCCondition}
 */
export declare function and(condition1: OGCExpression, condition2: OGCExpression, ...varargs: Expression[]): OGCCondition;
/**
 * Creates a boolean OR expression. It represents a boolean OR evaluation of two or more conditions.
 * It takes any number of parameters, each one being an expression.
 * <p>Note that combining {@link Identifier} expressions with other expressions will result in an error.</p>
 *
 * ```javascript
 *   FilterFactory.or(
 *     FilterFactory.lt(
 *       FilterFactory.property("TOT_POP"),
 *       FilterFactory.literal(500000)
 *     ),
 *     FilterFactory.eq(
 *      FilterFactory.property("city_name"),
 *      FilterFactory.literal("New York")
 *    );
 *   );
 * ```
 * @param firstExpression The first {@link OGCCondition}.
 * @param secondExpression The second {@link OGCCondition}.
 * @param varargs any number of additional {@link Expression}.
 * @return The Or expression.
 * @throws {@link !Error Error} if not all parameters are {@link Expression}
 */
export declare function or(firstExpression: Expression, secondExpression: Expression, ...varargs: Expression[]): OGCCondition;
/**
 * Creates an addition OGC expression.  It takes two parameters, each one being an OGC expression.
 * <p/>
 * Note that arithmetic operators are no longer supported in OGC Filter 2.0.
 * You will get an error when you use them in OGC Filter 2.0 XML (for example WFS 2.0).
 * You can still create them, evaluate them and use them in OGC Filter 1.1 XML though.
 *
 * ```javascript
 *   FilterFactory.add(
 *     FilterFactory.literal(12),
 *     FilterFactory.property("age")
 *   );
 * ```
 * @param firstExpression the first expression
 * @param secondExpression the second expression
 * @returns BinaryOperator
 * @throws {@link !Error Error} if not all parameters are {@link OGCExpression}
 */
export declare function add(firstExpression: OGCExpression, secondExpression: OGCExpression): OGCCondition;
/**
 * Creates a subtraction OGC expression.  It takes two parameters, each one being an OGC expression.
 * <p/>
 * Note that arithmetic operators are no longer supported in OGC Filter 2.0.
 * You will get an error when you use them in OGC Filter 2.0 XML (for example WFS 2.0).
 * You can still create them, evaluate them and use them in OGC Filter 1.1 XML though.
 *
 * ```javascript
 *   FilterFactory.sub(
 *     FilterFactory.property("age")
 *     FilterFactory.literal(18),
 *   );
 * ```
 * @param  firstExpression the first expression
 * @param  secondExpression the second expression
 * @returns BinaryOperator
 * @throws {@link !Error Error} if not all parameters are {@link OGCExpression}
 */
export declare function sub(firstExpression: Expression, secondExpression: Expression): OGCCondition;
/**
 * Creates a multiplication OGC expression.  It takes two parameters, each one being an OGC expression.
 * <p/>
 * Note that arithmetic operators are no longer supported in OGC Filter 2.0.
 * You will get an error when you use them in OGC Filter 2.0 XML (for example WFS 2.0).
 * You can still create them, evaluate them and use them in OGC Filter 1.1 XML though.
 *
 * ```javascript
 *   FilterFactory.mul(
 *     FilterFactory.property("population"),
 *     FilterFactory.literal(1000)
 *   );
 * ```
 * @param  firstExpression the first expression
 * @param  secondExpression the second expression
 * @returns BinaryOperator
 * @throws {@link !Error Error} if not all parameters are {@link OGCExpression}
 */
export declare function mul(firstExpression: OGCExpression, secondExpression: OGCExpression): OGCCondition;
/**
 * Creates a division OGC expression.  It takes two parameters, each one being an
 * OGC expression.
 * <p/>
 * Note that arithmetic operators are no longer supported in OGC Filter 2.0.
 * You will get an error when you use them in OGC Filter 2.0 XML (for example WFS 2.0).
 * You can still create them, evaluate them and use them in OGC Filter 1.1 XML though.
 *
 * ```javascript
 *   FilterFactory.div(
 *     FilterFactory.property("population"),
 *     FilterFactory.literal(1000)
 *   );
 * ```
 * @param firstExpression the first expression
 * @param secondExpression the second expression
 * @returns BinaryOperator
 * @throws {@link !Error Error} if not all parameters are {@link OGCExpression}
 */
export declare function div(firstExpression: OGCExpression, secondExpression: OGCExpression): OGCCondition;
/**
 * <p>Creates an "is like" expression which evaluates to <code>true</code> when the value of <code>expression</code>
 * matches the specified pattern. It is possible to not specify the <code>wildCard</code>, <code>singleChar</code> and
 * <code>escapeChar</code> arguments. In that case the OGC default values will be used (wildCard: '*', single char: '.' and
 * escapeChar character: '!').</p>
 *
 * ```javascript
 *   FilterFactory.like(
 *     FilterFactory.property('city_name'),
 *     FilterFactory.literal('New*')
 *   )
 * ```
 * @param  propertyName the propertyName to check
 * @param  pattern the pattern to match
 * @param  [wildCard="*"] the wildCard in the pattern (represents 0 or more characters)
 * @param  [singleChar="." the single character wildCard in the pattern (represents any sequence of length 1)
 * @param  [escapeChar="!"] the escapeChar character. Any character after this is evaluated as a literal.
 * @param  [matchCase] indicates whether the "is like" operator is case sensitive or not.
 *                 The default value is <code>true</code>
 * @return The "is like" expression.
 */
export declare function like(propertyName: PropertyName, pattern: Literal, wildCard?: string, singleChar?: string, escapeChar?: string, matchCase?: boolean): OGCCondition;
/**
 * Creates a boolean NOT expression. It represents the negation of the expression.
 * <p>Note: The {@link Identifier} is not allowed as an input for the NOT operator.
 *
 * ```javascript
 *   FilterFactory.not(
 *     FilterFactory.eq(
 *       FilterFactory.property("city_name"),
 *       FilterFactory.literal("New York")
 *     )
 *   );
 * ```
 *
 * @param  expression the expression to negate.
 * @return The Not expression.
 * @throws {@link !Error Error} if the parameter is not an expression
 */
export declare function not(expression: Expression): OGCCondition;
/**
 * <p>Creates an "is null" expression. It evaluates to true if the value of the expression is null.</p>
 *
 * ```javascript
 *   FilterFactory.isNull( FilterFactory.property( "city_name" ) );
 *
 *   FilterFactory.isNull( FilterFactory.func( "getCityName" ) );
 * ```
 *
 * @param  expression the expression to evaluate
 * @return the isNull expression
 */
export declare function isNull(expression: Expression): OGCCondition;
/**
 * <p>Creates an "exists" expression. It evaluates to true if the value of the expression is defined.</p>
 *
 * ```javascript
 *   FilterFactory.exists( FilterFactory.property( "city_name" ) );
 *
 *   FilterFactory.exists( FilterFactory.func( "getCityName" ) );
 * ```
 *
 * @param  expression the expression to evaluate
 * @return the exists expression
 * @since 2022.1
 */
export declare function exists(expression: Expression): OGCCondition;
/**
 * <p>Creates a Between expression. It evaluates to <code>true</code> when the expression is
 * contained in the [<code>lowerBounds</code>, <code>upperBounds</code>] interval.</p>
 *
 * ```javascript
 *   FilterFactory.between(
 *     FilterFactory.property("total_population"),
 *     FilterFactory.literal(10000),
 *     FilterFactory.literal(20000)
 *   );
 *
 *   FilterFactory.between(
 *     FilterFactory.func( "getTotalPopulation" ),
 *     FilterFactory.literal(10000),
 *     FilterFactory.literal(20000)
 *   );
 * ```
 *
 * @param expression the expression to evaluate
 * @param lowerBounds the lower bounds of the interval
 * @param upperBounds the upper bounds of the interval
 * @return The Between expression
 */
export declare function between(expression: OGCExpression, lowerBounds: OGCExpression, upperBounds: OGCExpression): OGCCondition;
/**
 * <p>Creates a condition that evaluates to <code>true</code> when both expressions are equal.</p>
 *
 * ```javascript
 *   FilterFactory.eq(
 *     FilterFactory.property( "city_name" ),
 *     FilterFactory.literal( "New York" )
 *   );
 *
 *   FilterFactory.eq(
 *     FilterFactory.func( "getCityNames" ),
 *     FilterFactory.literal( "New York" ),
 *     false,
 *     MatchAction.ANY
 *   );
 * ```
 *
 * @param  firstExpression the first expression
 * @param  secondExpression the second expression
 * @param  [matchCase] indicates whether this comparison operator is case sensitive or not.
 *         If omitted the string comparisons shall match case.
 * @param  [matchAction] specifies how the comparison shall be evaluated for a collection of values.
 *         Please refer to the {@link MatchAction} class for more details.<br>
 *         Note: This parameter has been introduced in the OGC Filter specification 2.0.0
 * @return  A BinaryComparison of type "Equals".
 * @throws {@link !Error Error} if not both expressions are {@link OGCExpression}.
 */
export declare function eq(firstExpression: Expression, secondExpression: Expression, matchCase?: boolean, matchAction?: MatchAction): OGCCondition;
/**
 * <p>Creates a condition that evaluates to <code>true</code> when both expressions are not equal.</p>
 *
 * ```javascript
 *   FilterFactory.neq(
 *     FilterFactory.property( "city_name" ),
 *     FilterFactory.literal( "New York" )
 *   );
 *
 *   FilterFactory.neq(
 *     FilterFactory.func( "getCityName" ),
 *     FilterFactory.literal( "New York" )
 *   );
 * ```
 * @param firstExpression the first expression
 * @param secondExpression the second expression
 * @param [matchCase] indicates whether this comparison operator is case sensitive or not.
 *        If omitted the string comparisons shall match case.
 * @param [matchAction] specifies how the comparison shall be evaluated for a collection of values.
 *         Please refer to the {@link MatchAction} class for more details.<br>
 *         Note: This parameter has been introduced in the OGC Filter specification 2.0.0
 * @return A BinaryComparison of type "NotEquals".
 */
export declare function neq(firstExpression: Expression, secondExpression: Expression, matchCase?: boolean, matchAction?: MatchAction): OGCCondition;
/**
 * <p>Creates a condition that evaluates to <code>true</code> when the first expression is greater than the second
 * expression.</p>
 *
 * Examples:
 *
 * ```javascript
 *   FilterFactory.gt(
 *     FilterFactory.property("total_population"),
 *     FilterFactory.literal(10000)
 *   );
 * ```
 *
 * ```javascript
 *   FilterFactory.gt(
 *     FilterFactory.func("getTotalPopulation"),
 *     FilterFactory.literal(10000)
 *   );
 * ```
 * @param  firstExpression the first expression
 * @param  secondExpression the second expression
 * @param  [matchCase] indicates whether this comparison operator is case sensitive or not.
 *         If omitted the string comparisons shall match case.
 * @param  [matchAction] specifies how the comparison shall be evaluated for a collection of values.
 *         Please refer to the {@link MatchAction} class for more details.<br>
 *         Note: This parameter has been introduced in the OGC Filter specification 2.0.0
 * @return A BinaryComparison of type "GreaterThan".
 */
export declare function gt(firstExpression: Expression, secondExpression: Expression, matchCase?: boolean, matchAction?: MatchAction): OGCCondition;
/**
 * <p>Creates a condition that evaluates to <code>true</code> when the first expression is lesser than the second
 * expression.</p>
 *
 * Examples:
 *
 * ```javascript
 *   FilterFactory.lt(
 *     FilterFactory.property("total_population"),
 *     FilterFactory.literal(10000)
 *   );
 * ```
 *
 * ```javascript
 *   FilterFactory.lt(
 *     FilterFactory.func("getTotalPopulation"),
 *     FilterFactory.literal(10000)
 *   );
 * ```
 * @param firstExpression the first expression
 * @param secondExpression the second expression
 * @param  [matchCase] indicates whether this comparison operator is case sensitive or not.
 *         If omitted the string comparisons shall match case.
 * @param  [matchAction] specifies how the comparison shall be evaluated for a collection of values.
 *         Please refer to the {@link MatchAction} class for more details.<br>
 *         Note: This parameter has been introduced in the OGC Filter specification 2.0.0
 * @return A BinaryComparison of type "LessThan".
 */
export declare function lt(firstExpression: Expression, secondExpression: Expression, matchCase?: boolean, matchAction?: MatchAction): OGCCondition;
/**
 * <p>Creates a condition that evaluates to <code>true</code> when the first expression is greater than or equal to the second
 * expression.</p>
 *
 * Examples:
 *
 * ```javascript
 *   FilterFactory.gte(
 *     FilterFactory.property("total_population"),
 *     FilterFactory.literal(10000)
 *   );
 * ```
 *
 * ```javascript
 *   FilterFactory.gte(
 *     FilterFactory.func("getTotalPopulation"),
 *     FilterFactory.literal(10000)
 *   );
 * ```
 * @param firstExpression the first expression
 * @param secondExpression the second expression
 * @param [matchCase] indicates whether this comparison operator is case sensitive or not.
 *         If omitted the string comparisons shall match case.
 * @param  [matchAction] specifies how the comparison shall be evaluated for a collection of values.
 *         Please refer to the {@link MatchAction} class for more details.<br>
 *         Note: This parameter has been introduced in the OGC Filter specification 2.0.0
 * @return A BinaryComparison of type "GreaterThanOrEqual".
 */
export declare function gte(firstExpression: Expression, secondExpression: Expression, matchCase?: boolean, matchAction?: MatchAction): OGCCondition;
/**
 * <p>Creates a condition that evaluates to <code>true</code> when the first expression is lesser than or equal to the second
 * expression.</p>
 *
 * ```javascript
 *   FilterFactory.lte(
 *     FilterFactory.property("total_population"),
 *     FilterFactory.literal(10000)
 *   );
 *
 *   FilterFactory.lte(
 *     FilterFactory.func("getTotalPopulation"),
 *     FilterFactory.literal(10000)
 *   );
 * ```
 *
 * @param  firstExpression the first expression
 * @param  secondExpression the second expression
 * @param  [matchCase] indicates whether this comparison operator is case sensitive or not.
 *         If omitted the string comparisons shall match case.
 * @param  [matchAction] specifies how the comparison shall be evaluated for a collection of values.
 *         Please refer to the {@link MatchAction} class for more details.<br>
 *         Note: This parameter has been introduced in the OGC Filter specification 2.0.0
 * @return A BinaryComparison of type "LessThanOrEqual".
 */
export declare function lte(firstExpression: Expression, secondExpression: Expression, matchCase?: boolean, matchAction?: MatchAction): OGCCondition;
/**
 * Create a bounding box expression.
 *
 * ```javascript
 *   FilterFactory.bbox(
 *     createBounds( reference, coordinates ),
 *     FilterFactory.property("geometry")
 *   );
 * ```
 * @param bounds the bounds of the bounding box.
 * @param [geometryName] an optional geometry name.
 * @return A Bbox operator
 */
export declare function bbox(bounds: Bounds, geometryName?: PropertyName | string): OGCCondition;
/**
 * Create a bounding box expression.
 *
 * ```javascript
 *   FilterFactory.bbox(0, 0, 20, 40, "EPSG:4326");
 * ```
 * @param minX x coordinate of the box's lower corner
 * @param minY y coordinate of the box's lower corner
 * @param maxX x coordinate of the box's upper corner
 * @param maxY y coordinate of the box's upper corner
 * @param [srsName] name of the reference the box is defined in.
 * @param [geometryName] an optional geometry name.
 * @return A Bbox operator
 */
export declare function bbox(minX: number, minY: number, maxX: number, maxY: number, srsName?: string, geometryName?: PropertyName | string): OGCCondition;
/**
 * Creates a custom OGC function with the given name and arguments.
 *
 * ```javascript
 *   FilterFactory.func(
 *     "getCityName"
 *   );
 * ```
 *
 * ```javascript
 *   FilterFactory.func(
 *     "geometryType",
 *     FilterFactory.property( "geom" )
 *   );
 * ```
 * @param name The name of a custom function
 * @param args The arguments that should be passed to the function. This can be any number of {@link OGCExpression}.
 * @return The custom OGC function
 */
export declare function func(name: string, ...args: Expression[]): OGCCondition;
/**
 * Creates a value reference (OGC Filter version 2.0) or a property name (OGC Filter version 1.0)
 * that represents a value that is to be evaluated by a filter predicate.
 *
 * <p> At runtime, a predicate is evaluated by replacing the value reference (property name) by the value it refers to.
 *
 * @param propertyName the property name (or path) of a feature
 * @param [namespacesMap] an object containing namespaces as <code>string</code>
 * @return The property instance for the <code>propertyName</code>
 */
export declare function property(propertyName: string, namespacesMap?: XMLNamespaceMap): PropertyName;
/**
 * Options for the {@link literal} function.
 * @since 2024.1
 */
export interface LiteralOptions {
  /**
   * if <code>true</code>, the literal value will be used as provided. "01697532" will not be considered equal to 1697532.
   * @default false
   */
  strict?: boolean;
}
/**
 * Creates a <code>Literal</code> instance for <code>value</code>.
 * @param value The value used for the <code>Literal</code> instance
 * @param options The <code>LiteralOptions</code> for the <code>Literal</code> instance
 * @return The <code>Literal</code> instance for <code>value</code>
 */
export declare function literal(value: string | number | boolean, options?: LiteralOptions): Literal;
/**
 * Converts a feature into a javascript feature filter function, that can be used to filter features on the client side.
 *
 * <p> The returned function takes a single argument, a {@link Feature}. It returns <code>true</code> when
 * the argument satisfies the condition. It returns <code>false</code> when the argument does not satisfy the condition.
 * <p> The condition may not contain function expressions.
 *
 * ```javascript
 *   var filter = FilterFactory.gte(
 *     FilterFactory.property("total_population"),
 *     FilterFactory.literal(10000)
 *   );
 *
 *   aFeatureLayer.filter = FilterFactory.toFeaturePredicate( filter );
 * ```
 * @param condition the condition to convert.
 * @return A predicate function.
 */
export declare function toFeaturePredicate(condition: OGCCondition | Identifiers): (feature: Feature) => boolean;