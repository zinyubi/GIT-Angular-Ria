import { OrientedBox } from "../../shape/OrientedBox.js";
import { ParameterizedPointStyle } from "../../view/style/ParameterizedPointStyle.js";
import { Vector3 } from "../Vector3.js";
/**
 * <p>An expression that can be evaluated to produce a value.
 * <p>For example:
 *
 * ```javascript
 * if (value1 < value2) {
 *    return "rgba(255, 55, 55, 0.5)";
 * else {
 *    return "rgba(55, 255, 55, 0.5)";
 * }
 * ```
 * can be converted to an expression:
 * ```javascript
 * var _ = ExpressionFactory;
 * var expression = _.ifThenElse(_.lt(_.number(value1), _.number(value2)),
 *                               _.color("rgba(255, 55, 55, 0.5)"),
 *                               _.color("rgba(55, 255, 55, 0.5)"));
 * ```
 * <p>It is not possible to create an <code>Expression</code> directly.
 * Use the {@link ExpressionFactory} instead.
 *
 * @since 2017.0
 */
export interface Expression<T> {}
/**
 * A parameter expression, see {@link booleanParameter}, {@link numberParameter}, {@link pointParameter} or {@link colorParameter}.
 */
export interface ParameterExpression<T> extends Expression<T> {
  value: T;
}
/**
 * An alias for <code>string</code> representing a Color.
 */
export type Color = string;
/**
 * Expression that can be used to add a condition to your expression.
 * See {@link cases} for more information.
 */
export interface CaseExpression<T> extends Expression<T> {
  /**
   * Adds a test case to this case expression.
   * @param test the expression to evaluate.
   */
  when(test: Expression<boolean>): CaseThenExpression<T>;
}
/**
 * Expression that can be used to add the expression that needs to be evaluated
 * when the {@link CaseExpression.when} evaluates to true.
 */
export interface CaseThenExpression<T> extends Expression<T> {
  /**
   * Adds the expression to evaluate when the {@link CaseExpression.when} evaluates to true.
   * @param result the expression to evaluate.
   */
  then(result: Expression<T>): CaseExpression<T>;
}
/**
 * Returns an attribute expression.
 * Expressions are evaluated for certain objects.  Those object may have attributes ascribed to them.
 * This expression allows access to those attributes by name.
 * Which attributes are available depends on the evaluator of the expression.
 * For example, for parameterized point painting, those attributes are defined in the constructor of the {@link ParameterizedPointPainter}.
 *
 * @param  name The name of the attribute to use.
 * @param  vectorSize The length of the attribute's vector, 1 if it is a simple number.
 * @returns An expression that represents the attribute.
 */
export declare function attribute(name: string, vectorSize?: number): Expression<number>;
/**
 *
 * Creates an expression that represents the map (or world) position of the feature.
 *
 * For example, this can be used to style dependent on the distance of the mouse to the feature.
 * Note that the mouse parameter in the code example below needs to be updated when the mouse moves (not shown).
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   var position = _.positionAttribute();
 *   var mouseParam = _.pointParameter({x: 0, y: 0, z: 0});//Initial value.  Needs updating.
 *   var distanceToMouse = _.distance(position, mouseParam);//World (Euclidean) distance.
 *
 *   var radiusOfEffect = _.number(1000000);//Only apply when the mouse is (relatively) close to the feature.
 *   var mouseMultiplier = _.ifThenElse(_.lt(distanceToMouse, radiusOfEffect),
 *                                      _.divide(radiusOfEffect, distanceToMouse),
 *                                      _.number(1));
 *   var colorExpression = _.multiply(_.color("rgba(127, 127, 127, 1)"), mouseMultiplier);//Brighten as the mouse moves closer.
 * ```
 *
 * @returns An expression that represents the position of a feature.
 */
export declare function positionAttribute(): Expression<Vector3>;
/**
 * Creates a new parameter expression.
 * The difference with {@link boolean} is that
 * you can change the value of a parameter later on, and the styling will
 * be updated to reflect the new value without having to re-create the expressions in which it is used.
 * Only booleans may be used as value.
 *
 * ```javascript
 *   var parameter = ExpressionFactory.booleanParameter(true);
 *   ...
 *   parameter.value = false;//Only ever assign booleans.
 * ```
 *
 * @param value The initial value of the parameter.
 * @returns A parameter expression.
 */
export declare function booleanParameter(value: boolean): ParameterExpression<boolean>;
/**
 * Creates a new parameter expression.
 * The difference with {@link number} is that
 * you can change the value of a parameter later on, and the styling will
 * be updated to reflect the new value without having to re-create the expressions in which it is used.
 * Only numbers may be used as value.
 *
 * ```javascript
 *   var parameter = ExpressionFactory.numberParameter(47);
 *   ...
 *   parameter.value = 83;//Only ever assign numbers.
 * ```
 *
 * @param value The initial value of the parameter.
 * @returns A parameter expression.
 */
export declare function numberParameter(value: number): ParameterExpression<number>;
/**
 * Creates a new parameter expression.
 * The difference with {@link point} is that
 * you can change the value of a parameter later on, and the styling will
 * be updated to reflect the new value without having to re-create the expressions in which it is used.
 * Only points may be used as value.
 *
 * ```javascript
 *   var parameter = ExpressionFactory.pointParameter(p1);
 *   ...
 *   parameter.value = p2;//Only ever assign points.
 * ```
 *
 * @param value The initial value of the parameter. Can be an object literal with x, y and z properties.
 * @returns A parameter expression.
 */
export declare function pointParameter(value: Vector3): ParameterExpression<Vector3>;
/**
 * Creates a new parameter expression.
 * The difference with {@link color} is that
 * you can change the value of a parameter later on, and the styling will
 * be updated to reflect the new value without having to re-create the expressions in which it is used.
 * Only colors may be used as value.
 *
 * ```javascript
 *   var parameter = ExpressionFactory.colorParameter("rgba(47, 83, 127, 1)");
 *   ...
 *   parameter.value = "rgba(255, 255, 255, 1)";//Only ever assign colors.
 * ```
 *
 * @param color The initial value of the parameter, represented by a CSS color string.
 * @returns A color parameter expression.
 */
export declare function colorParameter(color: Color): ParameterExpression<Color>;
/**
 * Creates an expression representing a boolean.
 *
 * @param value The value of the boolean.
 * @returns A boolean constant expression.
 */
export declare function boolean(value: boolean): Expression<boolean>;
/**
 * Creates an expression representing a number.
 *
 * @param value The value of the number constant.
 * @returns A number constant expression.
 */
export declare function number(value: number): Expression<number>;
/**
 * Creates an expression representing a point.
 *
 * @param value The value of the point constant.
 * @returns A point constant expression.
 */
export declare function point(value: Vector3): Expression<Vector3>;
/**
 * Creates an expression representing a Color.
 *
 * @param value The value of the color constant, represented by a CSS color string.
 * @returns A color constant expression.
 */
export declare function color(value: Color): Expression<Color>;
/**
 * Creates an expression representing an oriented box.
 * @param orientedBox An oriented box
 * @returns An expression representing an oriented box.
 * @since 2020.0
 */
export declare function orientedBox(orientedBox: OrientedBox): ParameterExpression<OrientedBox>;
/**
 * Creates an expression that evaluates whether the two given expression evaluate to the same value.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse} expression,
 * as a when-expression in a {@link cases} expression
 * or anywhere an expression that resolves to a boolean is required.
 *
 * @param left The first expression to evaluate.
 * @param right The second expression to evaluate.
 * @returns An expression that evaluates to true if the two expressions evaluate to the same value.
 */
export declare function eq<T extends number | Vector3 | Color | boolean>(left: Expression<T>, right: Expression<T>): Expression<boolean>;
/**
 * Creates an expression that evaluates whether the two given expression evaluate to the same value.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse} expression,
 * as a when-expression in a {@link cases} expression
 * or anywhere an expression that resolves to a boolean is required.
 *
 * @param left The first expression to evaluate.
 * @param right The second expression to evaluate.
 * @param threshold The Expression describing the maximum threshold before considering both values not equal.
 * @returns An expression that evaluates to true if the two expressions evaluate to the same value.
 */
export declare function eq(left: Expression<number>, right: Expression<number>, threshold?: Expression<number>): Expression<boolean>;
/**
 * Creates an expression that evaluates whether the two given expression evaluate to close values, given some threshold.
 * To be used with floating point numbers, depending on the context.
 *
 * @param a The first expression to evaluate.
 * @param b The second expression to evaluate.
 * @param threshold The Expression describing the maximum threshold before considering both values too far from each other.
 * @returns An expression that evaluates to true if the two expressions evaluate to close values, given the maximum threshold.
 * @since 2020.0
 */
export declare function areClose(a: Expression<number>, b: Expression<number>, threshold: Expression<number>): Expression<boolean>;
/**
 * Creates an expression that evaluates whether the two given expression do not evaluate to the same value.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a {@link cases}
 *  case expression or anywhere an expression that resolves to a boolean is required.
 *
 * @param left The first expression to evaluate.
 * @param right The second expression to evaluate.
 * @returns  An expression that evaluates to false if the two expressions evaluate to the same value.
 */
export declare function neq<T extends number | boolean | Vector3 | Color>(left: Expression<T>, right: Expression<T>): Expression<boolean>;
/**
 * Creates an expression that evaluates whether the result of the first expression is strictly less than the result of the second expression.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a {@link cases} case expression.
 * or anywhere an expression that resolves to a boolean is required.
 *
 * @param left The first expression to evaluate.
 * @param right The second expression to evaluate.
 * @returns An expression that evaluates to true if the result of the first expression is strictly less than the result of the second expression
 */
export declare function lt(left: Expression<number>, right: Expression<number>): Expression<boolean>;
/**
 * Creates an expression that returns an expression with the absolute value.
 *
 * @param value The expression to evaluate.
 * @returns An expression that evaluates to the absolute value of the given expression.
 * @since 2020.0
 **/
export declare function abs(value: Expression<number>): Expression<number>;
/**
 * Creates an expression that evaluates whether the result of the first expression is less than or equal to the result
 * of the second expression.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a
 * {@link cases} case expression or anywhere an expression that resolves to a boolean is required.
 *
 * @param left The first expression to evaluate.
 * @param right The second expression to evaluate.
 * @returns An expression that evaluates to true if the result of the first expression is less than or equal to the result
 * of the second expression
 */
export declare function lte(left: Expression<number>, right: Expression<number>): Expression<boolean>;
/**
 * Creates an expression that evaluates whether the result of the first expression is strictly greater than the result
 * of the second expression.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a
 * {@link cases case expression} or anywhere an expression that resolves to a boolean is required.
 *
 * @param left The first expression to evaluate.
 * @param right The second expression to evaluate.
 * @returns An expression that evaluates to true if the result of the first expression is strictly greater than the result of the second expression
 */
export declare function gt(left: Expression<number>, right: Expression<number>): Expression<boolean>;
/**
 * Creates an expression that evaluates whether the result of the first expression is greater than or equal to the result of the second expression.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a {@link cases} case expression
 * or anywhere an expression that resolves to a boolean is required.
 *
 * @param left The first expression to evaluate.
 * @param right The second expression to evaluate.
 * @returns An expression that evaluates to true if the result of the first expression is greater than or equal to the result of the second expression
 */
export declare function gte(left: Expression<number>, right: Expression<number>): Expression<boolean>;
/**
 * Creates an expression that evaluates whether the result of the operand is between a lower and upper bound (inclusive).
 * In other words, this expression checks whether operand is in the range <code>[lowerBound, upperBound]</code>.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a {@link cases} case expression
 * or anywhere an expression that resolves to a boolean is required.
 *
 * @param operand The operand to evaluate.
 * @param lowerBound The lowerBound to evaluate.
 * @param upperBound The upperBound to evaluate.
 * @returns An expression that evaluates to true if the result of operand >= the result of lowerBound and <= the result of upperBound.
 */
export declare function between(operand: Expression<number>, lowerBound: Expression<number>, upperBound: Expression<number>): Expression<boolean>;
/**
 * An expression that is the boolean 'and' of the given expressions.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a {@link cases} expression
 * or anywhere an expression that resolves to a boolean is required.
 *
 * @param expressions The expressions to be 'and'ed together. This can be any number of expressions. Each one should result in a boolean.
 * @returns An expression that is the boolean 'and' of all given expressions. Results in a boolean.
 */
export declare function and(...expressions: Expression<boolean>[]): Expression<boolean>;
/**
 * An expression that is the boolean 'or' of the given expressions.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a {@link cases} expression.
 * or anywhere an expression that resolves to a boolean is required.
 *
 * @param expressions The expressions to be 'or'ed together. This can be any number of expressions. Each one should result in a boolean.
 * @returns An expression that is the boolean 'or' of all given expressions. Results in a boolean.
 */
export declare function or(...expressions: Expression<boolean>[]): Expression<boolean>;
/**
 * An expression that is the boolean 'not' of the given expression.
 *
 * Use this kind of expression as the if-expression in an {@link ifThenElse}, as a when-expression in a {@link cases} expression.
 * or anywhere an expression that resolves to a boolean is required.
 *
 * @param  operand The operand. Should result in a boolean.
 * @returns An expression that is the boolean 'not' of the given expression. Results in a boolean.
 */
export declare function not(operand: Expression<boolean>): Expression<boolean>;
/**
 * An expression that adds the result of the given expressions.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 3.
 *   var sum = _.add(_.number(1), _.number(2));
 *   //Evaluates to (3, 4, 5).
 *   var point = _.add(_.point({x: 1, y: 2, z: 3}), _.number(2));
 * ```
 *
 * @param left The first expression to evaluate. Should result in a number, point or color.
 * @param right The second expression to evaluate. Should result in the same type as left or a number.
 * @returns An expression that adds the results of the given expressions. Results in a number, point or color depending on the type of the operands.
 * When a number is used with an other type, the operation is applied to the individual element values and the result is of the other type.
 */
export declare function add<T extends number | Vector3 | Color>(left: Expression<T>, right: Expression<T | number>): Expression<T>;
/**
 * An expression that subtracts the result of the second expression from the result of the first expression.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 1.
 *   var number = _.subtract(_.number(3), _.number(2));
 *   //Evaluates to (1, 2, 3).
 *   var point = _.subtract(_.point({x: 3, y: 4, z: 5}), _.number(2));
 * ```
 *
 * @param left The first expression to evaluate. Should result in a number, point or color.
 * @param right The second expression to evaluate. Should result in the same type as left or a number.
 * @returns An expression that subtracts the result of the second expression from the result of the first expression.
 * Results in a number, point or color depending on the type of the operands.
 * When a number is used with an other type,
 * the operation is applied to the individual element values and the result is of the other type.
 */
export declare function subtract<T extends number | Vector3 | Color>(left: Expression<T>, right: Expression<T | number>): Expression<T>;
/**
 * An expression that multiplies the result of the given expressions.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 2.
 *   var number = _.multiply(_.number(1), _.number(2));
 *   //Evaluates to (2, 4, 6).
 *   var point = _.multiply(_.point({x: 1, y: 2, z: 3}), _.number(2));
 * ```
 *
 * @param left The first expression to evaluate. Should result in a number, point or color.
 * @param right The second expression to evaluate. Should result in the same type as left or a number.
 * @returns An expression that multiplies the results of the given expressions.
 *                                                    Results in a number, point or color depending on the type of the operands.
 *                                                    When a number is used with an other type,
 *                                                    the operation is applied to the individual element values and the result is of the other type.
 */
export declare function multiply<T extends number | Vector3 | Color>(left: Expression<T>, right: Expression<T | number>): Expression<T>;
/**
 * An expression that divides the result of the first expression with the result of the second expression.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 1.
 *   var number = _.divide(_.number(2), _.number(2));
 *   //Evaluates to (1, 2, 3).
 *   var point = _.divide(_.point({x: 2, y: 4, z: 6}), _.number(2));
 * ```
 *
 * @param left The first expression to evaluate. Should result in a number, point or color.
 * @param right The second expression to evaluate. Should result in the same type as left or a number.
 * @returns An expression that divides the result of the first expression with the result of the second expression.
 *                                                    Results in a number, point or color depending on the type of the operands.
 *                                                    When a number is used with an other type,
 *                                                    the operation is applied to the individual element values and the result is of the other type.
 */
export declare function divide<T extends number | Vector3 | Color>(left: Expression<T>, right: Expression<T | number>): Expression<T>;
/**
 * Returns an expression that calculates the percentage of the given operand in the range <code>[lowerBound, upperBound]</code>.
 * The expression evaluates to <code>(operand - lowerBound) / (upperBound - lowerBound)</code>.
 * For values of operand outside the range <code>[lowerBound, upperBound]</code>, the results will lie outside the range <code>[0, 1]</code>.
 *
 * @param operand The operand to evaluate. Should result in a number, point or color.
 * @param lowerBound The lowerBound to evaluate. Should result in the same type as operand or a number.
 * @param upperBound The upperBound to evaluate. Should result in the same type as operand or a number.
 * @returns An expression that calculates the percentage of the given operand in the range <code>[lowerBound, upperBound]</code>.
 *                                                    Results in a number, point or color depending on the type of the operands.
 *                                                    When a number is used with an other type,
 *                                                    the operation is applied to the individual element values and the result is of the other type.
 */
export declare function fraction<T extends number | Vector3 | Color>(operand: Expression<T>, lowerBound: Expression<T | number>, upperBound: Expression<T | number>): Expression<T>;
/**
 * An expression that returns the minimum of the given expressions.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 1.
 *   var number = _.min(_.number(1), _.number(2));
 *   //Evaluates to (1, 2, 2).
 *   var point1 = _.min(_.point({x: 1, y: 2, z: 3}), _.number(2));
 *   //Evaluates to (1, 2, 1).
 *   var point2 = _.min(_.point({x: 1, y: 2, z: 3}), _.point({x: 3, y: 2, z: 1});
 * ```
 *
 * @param first The first expression to evaluate. Should result in a number, point or color.
 * @param second The second expression to evaluate. Should result in the same type as first or a number.
 * @returns An expression that returns the minimum of the result of the first expression and the result of the second expression.
 *                                                    Results in a number, point or color depending on the type of the operands.
 *                                                    When a number is used with an other type,
 *                                                    the operation is applied to the individual element values and the result is of the other type.
 */
export declare function min<T extends number | Vector3 | Color>(first: Expression<T>, second: Expression<T | number>): Expression<T>;
/**
 * An expression that returns the maximum of the given expression.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 2.
 *   var number = _.max(_.number(1), _.number(2));
 *   //Evaluates to (2, 2, 3).
 *   var point1 = _.max(_.point({x: 1, y: 2, z: 3}), _.number(2));
 *   //Evaluates to (3, 2, 3).
 *   var point2 = _.max(_.point({x: 1, y: 2, z: 3}), _.point({x: 3, y: 2, z: 1});
 * ```
 *
 * @param first The first expression to evaluate. Should result in a number, point or color.
 * @param second The second expression to evaluate. Should result in the same type as first or a number.
 * @returns An expression that returns the maximum of the result of the first expression and the result of the second expression.
 *                                                    Results in a number, point or color depending on the type of the operands.
 *                                                    When a number is used with an other type,
 *                                                    the operation is applied to the individual element values and the result is of the other type.
 */
export declare function max<T extends number | Vector3 | Color>(first: Expression<T>, second: Expression<T | number>): Expression<T>;
/**
 * An expression that returns the remainder of the division of a value by a divider.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 2.
 *   var number = _.mod(_.number(5), _.number(3));
 *   //Evaluates to (2, 2, 4).
 *   var point1 = _.mod(_.point({x: 7, y: 12, z: 4}), _.number(5));
 *   //Evaluates to (3, 1, 4).
 *   var point2 = _.mod(_.point({x: 8, y: 12, z: 4}), _.point({x: 5, y: 11, z: 6});
 * ```
 *
 * @param first The first expression to evaluate. Should result in a number, point or color.
 * @param second The second expression to evaluate. It can be the same type as first or a number.
 * @returns An expression that returns the remainder of the division of first expression the result of the second expression.
 *                                                    Results in a number or point depending on the type of the first operand.
 *                                                    When a number is used with an other type,
 *                                                    the operation is applied to the individual element values and the result is of the other type.
 * @since 2024.1
 */
export declare function mod<T extends number | Vector3 | Color>(first: Expression<T>, second: Expression<T | number>): Expression<T>;
/**
 * An expression that returns the result of the first expression raised to the power of the result of the second expression.
 * The type of the operands should be the same.
 * The (elements of the) first argument must not be less than 0 and if it is 0, the (corresponding elements of the) second argument must be greater than 0.
 *
 * @param first The first expression to evaluate. Should result in a number, point or color.
 * @param second The second expression to evaluate. Should result in the same type as first.
 * @returns An expression that returns the result of the first expression to the power of the result of the second expression.
 *                                                    Results in a number, point or color depending on the type of the operands.
 */
export declare function pow<T extends number | Vector3 | Color>(first: Expression<T>, second: Expression<T>): Expression<T>;
/**
 * Returns an expression that limits an operand to a range.
 * The type of the bounds should be the same.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 47.
 *   var number = _.clamp(_.number(42), _.number(47), _.number(83));
 *   //Evaluates to a point with values clamped between 47 and 83.
 *   var clamped = _.clamp(_.point(p1), _.number(47), _.number(83));
 *   //Evaluates to a point with values of p1 clamped between p2 and p3.
 *   var elementsIndividuallyClamped = _.clamp(_.point(p1), _.point(p2), _.point(p3));
 * ```
 *
 * @param operand The operand to evaluate. Should result in a number, point or color.
 * @param lowerBound The lowerBound to evaluate. Should result in the same type as operand or a number.
 * @param upperBound The upperBound to evaluate. Should result in the same type as lowerBound.
 * @returns An expression that limits a value to the given range.
 *                                                    Results in a number, point or color depending on the type of the operands.
 *                                                    When a number is used with an other type,
 *                                                    the operation is applied to the individual element values and the result is of the other type.
 */
export declare function clamp<T extends number | Vector3 | Color>(operand: Expression<T>, lowerBound: Expression<T | number>, upperBound: Expression<T | number>): Expression<T>;
/**
 * Returns an expression that calculates an interpolated or extrapolated result between
 * the result of first and second based on the result of third.
 * The type of the result of the first two expressions should be the same.  You can interpolate between numbers, points or colors.
 * The type of the result of the last expression can be a number or of the same type as the first two.
 * The last argument represents the fraction to use when interpolating or extrapolating.
 *
 * ```javascript
 *   var _ = ExpressionFactory;
 *   //Evaluates to 83.
 *   var number : _.mix(_.number(47), _.number(83), _.number(1));
 *   //Evaluates to a point halfway between p1 and p2.
 *   var middle = _.mix(_.point(p1), _.point(p2), _.number(0.5));
 *   //Evaluates to a point for which the y-component is close to but not equal to the middle.
 *   var notTheMiddle = _.mix(_.point(p1), _.point(p2), _.point({x: 0.5, y: 0.4, z: 0.5}));
 * ```
 *
 * @param  first The first expression to evaluate. Should result in a number, point or color.
 * @param  second The second expression to evaluate. Should result in the same type as first.
 * @param  third The third expression to evaluate. Should result in the same type as first or a number.
 *                                                        Represents the fraction.
 *                                                        In range <code>[0,1]</code> for interpolation, <code><0</code> or <code>>1</code> for extrapolation.
 * @returns An expression that calculates an interpolated or extrapolated result between
 *                                                    the result of first and second based on the result of third.
 *                                                    Results in a number, point or color depending on the type of the operands.
 *                                                    When a number is used with an other type,
 *                                                    the operation is applied to the individual element values and the result is of the other type.
 */
export declare function mix<T extends number | Vector3 | Color>(first: Expression<T>, second: Expression<T>, third: Expression<T | number>): Expression<T>;
/**
 * An expression that takes the sine of another expression.
 *
 * @param operand The expression of which to take the sine.
 *                                                          Should result in a number, point or color.
 *                                                          For points or colors, the function is applied to the individual element values.
 *                                                          Values assumed to be in radians.
 * @returns An expression that takes the sine of another expression. Results in a number, point or color.
 */
export declare function sin<T extends number | Vector3 | Color>(operand: Expression<T>): Expression<T>;
/**
 * An expression that takes the arcsine of another expression.
 * The range of values returned by asin is <code>[-PI/2, PI/2]</code>.
 * <code>|operand|</code> must be less than or equal to <code>1</code>.
 *
 * @param operand The expression of which to take the arcsine. Should result in a number, point or color.
 * @returns An expression that takes the arcsine of another expression. Results in a number, point or color.
 */
export declare function asin<T extends number | Vector3 | Color>(operand: Expression<T>): Expression<T>;
/**
 * An expression that takes the cosine of another expression.
 *
 * @param operand The expression of which to take the cosine.
 * Should result in a number, point or color.
 * For points or colors, the function is applied to the individual element values.
 * Values assumed to be in radians.
 * @returns An expression that takes the cosine of another expression. Results in a number, point or color.
 */
export declare function cos<T extends number | Vector3 | Color>(operand: Expression<T>): Expression<T>;
/**
 * An expression that takes the arccosine of another expression.
 * The range of values returned by acos is <code>[0, PI]</code>.
 * <code>|operand|</code> must be less than or equal to <code>1</code>.
 *
 * @param operand The expression of which to take the arccosine. Should result in a number, point or color.
 * @returns An expression that takes the arccosine of another expression. Results in a number, point or color.
 */
export declare function acos<T extends number | Vector3 | Color>(operand: Expression<T>): Expression<T>;
/**
 * An expression that takes the tangent of another expression.
 *
 * @param operand The expression of which to take the tangent.
 *                                                          Should result in a number, point or color.
 *                                                          For points or colors, the function is applied to the individual element values.
 *                                                          Values assumed to be in radians.
 * @returns An expression that takes the tangent of another expression. Results in a number, point or color.
 */
export declare function tan<T extends number | Vector3 | Color>(operand: Expression<T>): Expression<T>;
/**
 * An expression that takes the arctangent of another expression.
 * The range of values returned by atan is <code>[-PI/2, PI/2]</code>.
 *
 * @param operand The expression of which to take the arctangent. Should result in a number, point or color.
 * @returns An expression that takes the arctangent of another expression. Results in a number, point or color.
 */
export declare function atan<T extends number | Vector3 | Color>(operand: Expression<T>): Expression<T>;
/**
 * An expression that takes the natural logarithm of another expression.
 *
 * @param operand The expression of which to take the natural logarithm. Should result in a number, point or color.
 * @returns An expression that takes the natural logarithm of another expression. Results in a number, point or color.
 * @since 2021.0
 */
export declare function log<T extends number | Vector3 | Color>(operand: Expression<T>): Expression<T>;
/**
 * An expression that calculates the dot product of the given expressions.
 * The type of the result of the two given expressions should be the same.
 * You can take the dot product of numbers, points or colors.
 * Points and colors are interpreted as vectors for this operation.
 *
 * @param first The first expression to evaluate. Should result in a number, point or color.
 * @param second The second expression to evaluate. Should result in the same type as first.
 * @returns An expression that calculates the dot product of the given expressions. Results in a number.
 */
export declare function dotProduct<T extends number | Vector3 | Color>(first: Expression<T>, second: Expression<T>): Expression<T>;
/**
 * An expression that calculates the cross product of two expressions representing vectors.
 *
 * @param first The first expression to evaluate. Should result in a point (representing a vector).
 * @param second The second expression to evaluate. Should result in a point (representing a vector).
 * @returns An expression that calculates the cross product of the given expressions. Results in a point (vector).
 */
export declare function crossProduct(first: Expression<Vector3>, second: Expression<Vector3>): Expression<Vector3>;
/**
 * An expression that calculates the Euclidean distance between two expressions representing points.
 *
 * @param first The first expression to evaluate. Should result in a number, point or color.
 * @param second The second expression to evaluate. Should result in a number, point or color.
 * @returns An expression that calculates the Euclidean distance between two expressions representing points.
 *                                                    Results in a number.
 */
export declare function distance<T extends number | Vector3 | Color>(first: Expression<T>, second: Expression<T>): Expression<number>;
/**
 * An expression that normalizes an expression representing a 3d or 4d vector.
 *
 * @param operand The expression to evaluate. Should result in a point or color.
 * @returns Results in an expression the computes the normalized point or color.
 * @since 2022.0
 */
export declare function normalize<T extends Vector3 | Color>(operand: Expression<T>): Expression<T>;
/**
 * An expression that calculates the length of an expression representing a 3d or 4d vector.
 *
 * @param operand The first expression to evaluate. Should result in a point or color.
 * @returns Results in an expression that computes the length as a number.
 * @since 2022.0
 */
export declare function length<T extends Vector3 | Color>(operand: Expression<T>): Expression<number>;
/**
 * An expression that implements if-then-else logic.
 *
 * @param ifExpression The expression that should decide which of the other expressions to take. Should result in a boolean.
 * @param thenExpression The expression whose result will be returned if the ifExpression results in true.
 * @param elseExpression The expression whose result will be returned if the ifExpression results in false.
 *                                                                   Should result in the same type of value as the thenExpression.
 * @returns An expression that return the result of one of the other expressions, based on the ifExpression.
 */
export declare function ifThenElse<T extends number | Vector3 | Color>(ifExpression: Expression<boolean>, thenExpression: Expression<T>, elseExpression: Expression<T>): Expression<T>;
/**
 * Returns an expression that can be used to chain multiple when-then statements together.
 * On the returned case expression, you can add cases by calling when with an expression and subsequently call then with another expression.
 * This creates a chain of if-then-else statements.  If no cases match, the result of the default expression is used.
 * The expression given as argument to a when-call should result in boolean.
 *
 * ```javascript
 * var defaultExpression = ...;
 * var someTestExpression = ...;
 * var someResultExpression = ...;
 * var someOtherTestExpression = ...;
 * var someOtherResultExpression = ...;
 *
 * var caseExpression = ExpressionFactory.cases(defaultExpression);
 * caseExpression.when(someTestExpression).then(someResultExpression)
 *               .when(someOtherTestExpression).then(someOtherResultExpression);
 *
 * ```
 *
 * @param defaultExpression The expression evaluated if no when-then case is met.
 * @returns A case expression that can be used to add when-then cases.
 */
export declare function cases<T extends number | Vector3 | Color>(defaultExpression: Expression<T>): CaseExpression<T>;
/**
 * Returns an expression that represents an icon.
 * If you want to use headings or draping for parameterized point painting,
 * they should be configured using the {@link ParameterizedPointPainter}.
 *
 * @param parameterizedPointStyle The style describing the icon to use.
 * @returns An expression that can be used as the icon expression.
 */
export declare function icon(parameterizedPointStyle: ParameterizedPointStyle): Expression<ParameterizedPointStyle>;
/**
 * Returns an expression that maps an index onto an expression.
 * The expression first determines an index, then evaluates the expression corresponding to the index.
 *
 * For example:
 * ```javascript
 *   var _ = ExpressionFactory;
 *   _.map(_.number(2), [_.color(red), _.color(green), _.color(blue)], _.color(black)) //returns blue
 *   _.map(_.number(6), [_.color(red), _.color(green), _.color(blue)], _.color(black)) //returns black
 * ```
 *
 * Note that when planning to use a large number of icons in the values array,
 * the elements should be {@link icon} expressions.
 * Using more complex expressions in the array is possible but then the number of elements is limited.
 * The exact number depends on computer configuration but you can assume it is close to 20.
 *
 * @param indexExpression The expression that calculates the index to use.
 * @param values An array of value expressions.
 * @param defaultExpression The expression used as default when the computed index is not valid.
 * @return An expression that maps an index onto an expression.
 */
export declare function map<T extends number | Vector3 | Color>(indexExpression: Expression<number>, values: Expression<T>[], defaultExpression: Expression<T>): Expression<T>;
/**
 * Returns an expression that creates an interpolated value.
 * This expression is not limited to numbers, but can also be used to interpolate points or colors.
 * For example:
 * ```javascript
 *   var _ = ExpressionFactory;
 *   _.mixmap(_.number(0.75), [_.color(orange), _.color(yellow), _.color(red)])
 * ```
 * results in a color between yellow and red.
 *
 * @param aFraction The fraction, in range <code>[0,1]</code>.
 * @param values An array of value expressions.
 * @return An expression that creates an interpolated value.
 */
export declare function mixmap<T extends number | Vector3 | Color>(aFraction: Expression<number>, values: Expression<T>[]): Expression<T>;
/**
 * Returns an expression that resolves to a boolean based on whether the position is inside a given shape expression.
 * For example:
 * ```javascript
 *   var _ = ExpressionFactory;
 *   var shape = _.orientedBox(layer.orientedBox);
 *   _.isInside(shape);
 * ```
 * results in a contains expression for the bounding oriented box of the layer.
 *
 * This type of expression is only supported for styling expressions used by {@link TileSet3DLayer}.
 * Only {@link orientedBox} expressions are supported as shapes.
 *
 * @param shape The shape expression to use for the check.
 * @return An expression that represents a contains check on the given shape.
 * @since 2020.0
 */
export declare function isInside(shape: ParameterExpression<OrientedBox>): Expression<boolean>;
/**
 * Returns an expression that resolves to a vector pointing downwards (towards the center of the Earth) for everything inside the given shape.
 * It resolves to a zero vector for everything outside the given shape.
 * This expression is useful, for example, as a displacement expression on {@link MeshStyle} to displace (parts of) meshes.
 * For example:
 * ```javascript
 *   var _ = ExpressionFactory;
 *   var shape = _.orientedBox(layer.orientedBox);
 *   _.pushDown(shape);
 * ```
 * results in an expression that represents the vector to push down everything inside the bounding oriented box of the layer.
 *
 * This type of expression is only supported for styling expressions used by {@link TileSet3DLayer}.
 * Only {@link orientedBox} expressions are supported as shapes.
 *
 * @param shape The shape expression used to define the area and extent of the push down vector.
 * @return An expression that represents a displacement based on the given shape.
 * @since 2020.0
 */
export declare function pushDown(shape: ParameterExpression<OrientedBox>): Expression<Vector3>;
/**
 * Returns an expression representing the default color that is applied to a mesh.
 * The result depends on what is available in the data.
 * It can be the color of a texture, a color attribute, a constant color default, etc.
 *
 * This type of expression is only supported for mesh styling expressions used by {@link TileSet3DLayer}.
 */
export declare function defaultColor(): Expression<Color>;
/**
 * Determines whether a pixel is facing to or away from the camera.
 * </p>
 * Use in <code>colorExpression</code> to distinguish front-facing from back-facing pixels.
 * This type of expression is only supported for mesh styling expressions used by {@link TileSet3DLayer}.
 * </p>
 * The facing is determined based on triangle winding.
 * </p>
 * If you simply wish to hide back-faced triangles, use <code>layer.meshStyle = {facetCulling: FacetCullingType.BACKFACE_CULLING}</code>.
 *
 * @return A boolean expression.
 * @since 2022.0
 */
export declare function frontFacing(): Expression<boolean>;