import { CoordinateReference } from "../reference/CoordinateReference.js";
import { Affine3DTransformation } from "../transformation/Affine3DTransformation.js";
import { Vector3 } from "../util/Vector3.js";
import { Arc } from "./Arc.js";
import { ArcBand } from "./ArcBand.js";
import { Bounds } from "./Bounds.js";
import { CircleBy3Points } from "./CircleBy3Points.js";
import { CircleByCenterPoint } from "./CircleByCenterPoint.js";
import { CircularArcBy3Points } from "./CircularArcBy3Points.js";
import { CircularArcByBulge } from "./CircularArcByBulge.js";
import { CircularArcByCenterPoint } from "./CircularArcByCenterPoint.js";
import { ComplexPolygon } from "./ComplexPolygon.js";
import { Ellipse } from "./Ellipse.js";
import { ExtrudedShape } from "./ExtrudedShape.js";
import { GeoBuffer } from "./GeoBuffer.js";
import { OrientedBox } from "./OrientedBox.js";
import { Point } from "./Point.js";
import { PointCoordinates } from "./PointCoordinate.js";
import { Polygon } from "./Polygon.js";
import { Polyline } from "./Polyline.js";
import { Sector } from "./Sector.js";
import { Shape } from "./Shape.js";
import { ShapeList } from "./ShapeList.js";
import { ShapeType } from "./ShapeType.js";
import { BezierCurve } from "./BezierCurve.js";
/**
 * Creates a shape of the given type and reference.
 * The coordinate type of the returned shape will match that of the specified reference.
 * @param shapeType The shape type of the returned shape
 * @param reference The reference of the returned shape
 */
declare function createShape(shapeType: ShapeType, reference: CoordinateReference): Shape;
/**
 * Creates a point with the specified coordinates
 *
 * @param reference the reference in which the point is defined
 * @param coordinates the coordinate of the point, expressed as an array. (e.g. "[52,5]")
 * @return the point
 */
declare function createPoint(reference: CoordinateReference | null, coordinates: number[]): Point;
/**
 * Creates a polyline with the specified points ({@link Point}).
 *
 * @param reference the reference in which the polyline is defined
 * @param points an array of {@link Point} instances
 * @return The polyline with the specified points
 */
declare function createPolyline(reference: CoordinateReference | null, points?: Point[]): Polyline;
/**
 * Creates a polyline with the specified {@link PointCoordinates point coordinates}.
 * The x, y, z elements of point coordinates must be expressed in the given <code>reference</code>.
 * @param reference the reference in which the polyline and point coordinates are defined
 * @param pointCoordinates an array of {@link PointCoordinates}
 * @return The polyline with the specified point coordinates
 *
 * ```javascript
 * const reference = getReference("CRS:84");
 * const polyline = createPolyline(reference, [[0,1],[10,1],[5,5]);
 * ```
 * @since 2021.0
 */
declare function createPolyline(reference: CoordinateReference | null, pointCoordinates?: PointCoordinates[]): Polyline;
/**
 * Creates a polygon with the specified points ({@link Point}).
 * @param reference the reference in which the polygon is defined
 * @param points an array of {@link Point} instances
 * @return The polygon with the specified points
 */
declare function createPolygon(reference: CoordinateReference, points?: Point[]): Polygon;
/**
 * Creates a polygon with the specified {@link PointCoordinates point coordinates}.
 * The x, y, z elements of point coordinates must be expressed in the given <code>reference</code>.
 * @param reference the reference in which the polygon and point coordinates are defined
 * @param pointCoordinates an array of {@link PointCoordinates}
 * @return The polygon with the specified point coordinates
 *
 * ```javascript
 * const reference = getReference("EPSG:4979");
 * const polygon = createPolygon(reference, [[1,1,0],[3,1,0],[3,1,1000],[1,1,1000]);
 * ```
 * @since 2021.0
 */
declare function createPolygon(reference: CoordinateReference, pointCoordinates?: PointCoordinates[]): Polygon;
/**
 * Creates a {@link CircleByCenterPoint circle} defined by a center-point and radius.
 *
 * @param reference the reference in which the circle is defined
 * @param center The center of the circle
 * @param radius The radius of the circle, in meters
 * @return The circle with the specified center and radius
 */
declare function createCircleByCenterPoint(reference: CoordinateReference, center: Point, radius: number): CircleByCenterPoint;
/**
 * Creates a {@link CircleBy3Points circle} defined by three points on its circumference
 *
 * @param reference the reference in which the circle is defined
 * @param point1 A point on the circumference
 * @param point2 A point on the circumference
 * @param point3 A point on the circumference
 * @return The new circle
 */
declare function createCircleBy3Points(reference: CoordinateReference, point1: Point, point2: Point, point3: Point): CircleBy3Points;
/**
 * Creates an {@link Ellipse} with the specified parameters
 *
 * @param reference the reference in which the circle is defined
 * @param center The center of the circle
 * @param a The length of the semi-major axis, in meters
 * @param b The length of the semi-minor axis, in meters
 * @param rotationAzimuth The rotation azimuth of the semi-major axis, in degrees from 12 o'clock (north), positive clockwise
 * @return The ellipse with the specified parameters
 */
declare function createEllipse(reference: CoordinateReference | null, center: Point, a: number, b: number, rotationAzimuth: number): Ellipse;
/**
 * Creates a complex polygon with the specified polygons.
 *
 * @param reference the reference in which the ComplexPolygon is defined
 * @param polygons an array of {@link Polygon} instances.
 * The first polygon in this array is the outer ring. All other polygons in this array must be contained inside this first polygon.
 * @return The complex polygon with the specified polygons
 *
 */
declare function createComplexPolygon(reference: CoordinateReference | null, polygons?: Polygon[]): ComplexPolygon;
/**
 * Creates a {@link Bounds} with the specified coordinates.
 *
 * @param reference the reference in which the coordinates are defined
 * @param coordinates the coordinate of the bounds, expressed as an array. (e.g. "[x,width,y,height]" or "[x,width,y,height,z,depth]")
 * @return The bounds with the specified coordinates
 *
 */
declare function createBounds(reference: CoordinateReference | null, coordinates?: number[]): Bounds;
/**
 * Creates a {@link ShapeList} containing the specified shapes.
 *
 * @param reference the reference in which all the shapes are defined
 * @param shapes Array of shapes. All shapes must have the same reference, which should be
 * equal to the first parameter (<code>reference</code>)
 * @return A ShapeList containing the specified shapes.
 *
 */
declare function createShapeList(reference: CoordinateReference | null, shapes?: Shape[]): ShapeList;
/**
 * Creates a {@link CircularArcByCenterPoint circular arc} defined by a center point, radius,
 * a start angle and a sweep angle.
 *
 * @param reference           the reference in which the circular arc is defined
 * @param center              the center point.
 * @param radius              the radius of the circle defining the arc.
 * @param startAzimuth        the start azimuth (in degrees, clockwise from 12 o'clock (north)).
 * @param sweepAngle          the sweep angle (in degrees, clockwise from the start angle).
 * @return the circular-arc-by-center-point
 * @see {@link CircularArcByCenterPoint}
 */
declare function createCircularArcByCenterPoint(reference: CoordinateReference, center: Point, radius: number, startAzimuth: number, sweepAngle: number): CircularArcByCenterPoint;
/**
 * Creates a {@link CircularArcBy3Points circular arc} defined by a start point, an end point
 * and an intermediate point on the arc.
 *
 * @param reference the reference in which the circular arc is defined
 * @param startPoint The start point of the arc
 * @param intermediatePoint An intermediate point on the arc
 * @param endPoint The end point of the arc
 * @return The circular-arc-by-3-points with the specified 3 points
 * @see {@link CircularArcBy3Points}
 */
declare function createCircularArcBy3Points(reference: CoordinateReference, startPoint: Point, intermediatePoint: Point, endPoint: Point): CircularArcBy3Points;
/**
 * Creates a {@link CircularArcByBulge circular arc} defined by two points and bulge factor
 *
 * @param reference the reference in which the circular arc is defined
 * @param startPoint the start point of the circular arc
 * @param endPoint the end point of the circular arc
 * @param bulge the bulge of the arc (a value of 1 defines a half-circle, less makes the arc flatter)
 * @return The circular-arc-by-bulge with the specified points and bulge
 * @see {@link CircularArcByBulge}
 *
 */
declare function createCircularArcByBulge(reference: CoordinateReference, startPoint: Point, endPoint: Point, bulge: number): CircularArcByBulge;
/**
 * Creates a {@link Arc elliptical arc} defined by a center point,
 * semi-major axis, semi-minor axis, a start angle and a sweep angle.
 *
 * @param reference             the reference in which the elliptical arc is defined.
 * @param center                the center point.
 * @param a                     the semi-major axis of the ellipse defining the arc, in meters.
 * @param b                     the semi-minor axis of the ellipse defining the arc, in meters.
 * @param rotationAzimuth       the rotation azimuth of the ellipse defining the arc, in degrees, positive clockwise from 12 o'clock (north).
 * @param startAzimuth          the start azimuth, in degrees, positive clockwise from 12 o'clock (north).
 * @param sweepAngle            the angle over which the arc extends, in degrees, positive clockwise.
 * @return the arc
 * @see {@link Arc}
 */
declare function createArc(reference: CoordinateReference | null, center: Point, a: number, b: number, rotationAzimuth: number, startAzimuth: number, sweepAngle: number): Arc;
/**
 * Creates a {@link ArcBand circular arc band} defined by a center point,
 * a minimum radius, a maximum radius, a start angle and a sweep angle.
 *
 * @param reference           the reference in which the shape is defined.
 * @param center              center the center point.
 * @param minRadius           the minimum radius of the circle defining the arc band, in meters.
 * @param maxRadius           the maximum radius of the circle defining the arc band, in meters.
 * @param startAzimuth        the start azimuth, in degrees, positive clockwise from 12 o'clock (north).
 * @param sweepAngle          the angle over which the arc band extends, in degrees, positive clockwise.
 * @return the arc band
 * @see {@link ArcBand}
 */
declare function createArcBand(reference: CoordinateReference | null, center: Point, minRadius: number, maxRadius: number, startAzimuth: number, sweepAngle: number): ArcBand;
/**
 * Creates a {@link Sector circular sector} defined by a center point,
 * a radius, a start angle and a sweep angle.
 *
 * @param reference           the reference in which the shape is defined.
 * @param center              the center point.
 * @param radius              the radius of the circle defining the sector, in meters.
 * @param startAzimuth        the start azimuth, in degrees, positive clockwise from 12 o'clock (north).
 * @param sweepAngle          the angle over which the sector extends, in degrees, positive clockwise.
 * @return the sector
 * @see {@link Sector}
 */
declare function createSector(reference: CoordinateReference | null, center: Point, radius: number, startAzimuth: number, sweepAngle: number): Sector;
/**
 * Creates a {@link GeoBuffer geo-buffer} around the specified base shape.
 * Currently, GeoBuffer supports {@link Polyline}, and {@link Polygon} as base shapes.
 * See {@link GeoBuffer.isSupportedBaseShape GeoBuffer.isSupportedBaseShape} to check if a base shape is supported.
 *
 * @param reference the coordinate reference in which the geo-buffer and base shape are defined.
 * @param baseShape The base shape
 * @param width The width of the geo-buffer, specified in model reference distance units.
 * @throws {@link ProgrammingError} if the base shape is not supported, or if the width is not a positive value.
 * @see {@link GeoBuffer}
 */
declare function createGeoBuffer(reference: CoordinateReference | null, baseShape: Shape, width: number): GeoBuffer;
/**
 * Creates a {@link ExtrudedShape} for a base shape.
 * <p/>
 * Currently ExtrudedShape supports 2D lines and areas as base shape.
 * See {@link ExtrudedShape.isSupportedBaseShape ExtrudedShape.isSupportedBaseShape} to check if a base shape is supported.
 *
 * ```javascript
 * [[include:shape/ShapeFactorySnippets.ts_CREATE_EXTRUDED_SHAPE]]
 * ```
 *
 * @param reference the reference in which both the extruded shape and base shape are defined.  They must be the same.
 * @param baseShape The base shape
 * @param minimumHeight The numeric value in meters defining the lower or bottom boundary of the 3D volume.
 * @param maximumHeight The numeric value defining the upper or top boundary of the 3D volume.
 * @return The new extruded shape instance.
 *
 * @throws {@link ProgrammingError} if the `baseShape` is not supported or when the `minimumHeight` exceeds the `maximumHeight`.
 *
 * @typeParam TShape - Represents the {@link Shape} type of the base shape that is extruded.
 */
declare function createExtrudedShape<TShape extends Shape = Shape>(reference: CoordinateReference | null, baseShape: TShape, minimumHeight: number, maximumHeight: number): ExtrudedShape<TShape>;
/**
 * Creates an axis-aligned {@link OrientedBox} with given location and dimensions.
 *
 * @param reference the reference in which the oriented box is defined. Due to the cartesian nature of this shape,
 * it is not available for geodetic references
 * @param location the location of the corner of the box with minimal x, y and z values
 * @param dimensions the size of the oriented box
 *
 * @since 2021.1
 */
declare function createOrientedBox(reference: CoordinateReference | null, location: Vector3, dimensions: Vector3): OrientedBox;
/**
 * Creates an {@link OrientedBox} resulting from a base box with given location and dimensions,
 * transformed by the given transformation.
 *
 * ```javascript
 * [[include:shape/ShapeFactorySnippets.ts_CREATE_ORIENTED_BOX]]
 * ```
 *
 * @param transformation the transformation applied to the base box to get the resulting box
 * @param location the location of the corner of the base box with minimal x, y and z values
 * @param dimensions the size of the base box
 *
 * @since 2021.1
 */
declare function createOrientedBox(transformation: Affine3DTransformation, location: Vector3, dimensions: Vector3): OrientedBox;
/**
 * Creates a quadratic Bézier curve that transitions smoothly between first and the last control point.
 *
 * <br>A quadratic Bézier curve is defined by this equation:
 * <br> F(t) = controlPoint0 * (1-t)^2 + 2(1-t) * t * controlPoint1 + controlPoint2 * t^2
 * <p><img src="media://feature/quadraticBezierCurve.png" alt="Cubic Bézier curve" width="400px"/></p>
 *
 * <br>At t=0 the function evaluates to controlPoint0
 * <br>At t=1 the function evaluates to controlPoint2
 *
 * <br>For other values between 0 and 1, the function will evaluate to a quadratic curve tending to controlPoint1.
 *
 * @param reference The coordinate reference in which the Bézier curve is defined
 * @param controlPoint0 The first control point that is the start of the Bézier curve
 * @param controlPoint1 The second control point
 * @param controlPoint2 The third control point that is the end of the Bézier curve
 * @since 2024.1
 */
export declare function createQuadraticBezierCurve(reference: CoordinateReference, controlPoint0: Point, controlPoint1: Point, controlPoint2: Point): BezierCurve;
/**
 * Creates a cubic Bézier curve that transitions smoothly between first and the last control point.
 *
 * <br>A cubic Bézier curve is defined by this equation:
 * <br>  F(t) = (1-t)^3 * controlPoint0 + 3(1-t)^2 * t * controlPoint1 + 3(1-t) * t^2 * controlPoint2 + t^3 * controlPoint3
 * <p><img src="media://feature/cubicBezierCurve.png" alt="Cubic Bézier curve" width="400px"/></p>
 *
 * <br>At t=0 the function evaluates to controlPoint0
 * <br>At t=1 the function evaluates to controlPoint3
 *
 * <br>For other values between 0 and 1, the function will evaluate to a cubic curve tending to the two intermediate control points.
 *
 * @param reference The coordinate reference in which the Bézier curve is defined
 * @param controlPoint0 The first control point that is the start of the Bézier curve
 * @param controlPoint1 The second control point
 * @param controlPoint2 The third control point
 * @param controlPoint3 The fourth control point that is the end of the Bézier curve
 * @since 2024.1
 */
export declare function createCubicBezierCurve(reference: CoordinateReference, controlPoint0: Point, controlPoint1: Point, controlPoint2: Point, controlPoint3: Point): BezierCurve;
/**
 * A factory to create shape instances.
 */
export { createShape, createPoint, createPolyline, createPolygon, createCircleByCenterPoint, createCircleBy3Points, createEllipse, createComplexPolygon, createBounds, createShapeList, createCircularArcByCenterPoint, createCircularArcBy3Points, createCircularArcByBulge, createArc, createArcBand, createSector, createGeoBuffer, createExtrudedShape, createOrientedBox };