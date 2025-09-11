/**
 * A Vector3 is any object that has <code>x</code>, <code>y</code> and <code>z</code> properties.
 * These can be {@link Point} instances, plain object literals or 3D vector classes from other third-party
 * math libraries.
 */
export interface Vector3 {
  /**
   * The x coordinate of the 3D vector
   **/
  x: number;
  /**
   * The y coordinate of the 3D vector
   **/
  y: number;
  /**
   * The z coordinate of the 3D vector
   **/
  z: number;
}