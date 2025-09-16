import { Bounds } from "./Bounds.js";
/**
 * An object implements <code>Bounded</code> if its geometry is spatially bounded. The
 *        bounds can then be requested as a <code>Bounds</code> object.
 */
export interface Bounded {
  /**
   * The <code>Bounds</code> by which the geometry of this <code>Bounded</code> object is bounded or null if the
   * bounds is not defined.
   **/
  bounds: Bounds | null;
}