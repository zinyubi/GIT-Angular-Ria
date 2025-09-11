/**
 * An enumeration of shape types.
 * Shapes can have more than one shape type, so always check the shape type using
 * {@link ShapeType.contains}
 */
declare enum ShapeType {
  /**
   * A point.
   */
  POINT = 1,
  /**
   * A polyline.
   */
  POLYLINE = 2,
  /**
   * A polygon.
   */
  POLYGON = 4,
  /**
   * A complex polygon.
   * @deprecated use COMPLEX_POLYGON instead
   */
  COMPLEXPOLYGON = 8,
  //not geojson
  /**
   * A complex polygon.
   */
  COMPLEX_POLYGON = 8,
  /**
   * A shape list.
   * @deprecated use SHAPE_LIST instead
   */
  SHAPELIST = 16,
  /**
   * A shape list.
   */
  SHAPE_LIST = 16,
  /**
   * A circle by center point
   */
  CIRCLE = 64,
  /**
   * A circle defined by a center point and radius
   */
  CIRCLE_BY_CENTER_POINT = 128,
  /**
   * A circle by 3 points
   */
  CIRCLE_BY_3_POINTS = 256,
  /**
   * A bounds.
   */
  BOUNDS = 512,
  //not geojson,
  /**
   * A circular arc
   */
  CIRCULAR_ARC = 4096,
  //not geojson
  /**
   * A circular arc defined by a center point and radius
   */
  CIRCULAR_ARC_BY_CENTER_POINT = 8192,
  /**
   * A circular arc defined by 3 points
   */
  CIRCULAR_ARC_BY_3_POINTS = 16384,
  /**
   * A circular arc defined by 2 points and a bulge
   */
  CIRCULAR_ARC_BY_BULGE = 32768,
  //not geojson
  /**
   * An {@link Ellipse}
   */
  ELLIPSE = 131072,
  /**
   * A buffer around a shape
   */
  GEO_BUFFER = 262144,
  /**
   * An elliptical arc defined by a center point, semi-major axis and semi-minor axis
   */
  ARC = 524288,
  /**
   * A circular arc band defined by a center point, a min radius, a max radius, a start azimuth and a sweep angle
   */
  ARC_BAND = 1048576,
  /**
   * An extrusion of a shape
   */
  EXTRUDED_SHAPE = 2097152,
  /**
   * A sector of a circle, defined by a center point, a radius, a start azimuth and a sweep angle
   */
  SECTOR = 4194304,
  /**
   * An oriented box, defined by its 8 corner points.
   */
  ORIENTED_BOX = 8388608,
  /**
   * A Bézier curve
   * @since 2024.1
   */
  BEZIER_CURVE = 16777216,
  /**
   * A quadratic Bézier curve
   * @since 2024.1
   */
  BEZIER_CURVE_QUADRATIC = 33554432,
  /**
   * A cubic Bézier curve
   * @since 2024.1
   */
  BEZIER_CURVE_CUBIC = 67108864,
}
declare namespace ShapeType {
  /**
   * Checks if the given shape type matches the expected type.
   *
   * @param shapeType the type of the shape
   * @param expectedType the expected type
   * @return {Boolean} true if the given shape type is of the expected shape type, false otherwise
   *
   * ```javascript
   * var polygon = new ...
   * ShapeType.contains(polygon.type, ShapeType.POLYGON); //true
   * ```
   */
  function contains(shapeType: ShapeType, expectedType: ShapeType): boolean;
}
export { ShapeType };