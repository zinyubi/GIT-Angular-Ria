/**
 * An object implements <code>Snappable</code> if it can be snapped to during edit operations. <code>Snappable</code>
 * is commonly implemented by layers. For the case of layers, <code>Snappable</code> determines whether any object
 * within the layer should be snappable.
 *
 * @since 2014.0
 */
export interface Snappable {
  /**
   * The <code>isSnapTarget</code> is a boolean value that determines whether or not the object should be considered
   * as a snap target.
   **/
  isSnapTarget: boolean;
}