import { LineMarkerType } from "./LineMarkerType.js";
/**
 * A line marker placed at the beginning or ending of a line. LineMarker is not an actual type in the LuciadRIA
 * API. It only documents the expected structure of an object in order to be considered a LineMarker.
 */
interface LineMarker {
  /**
   * The size of the marker. The unit of measure for the size is identified by
   * {@link LineStyle.uom}
   * property.</p>
   */
  size?: number;
  /**
   * The type of the marker.
   */
  type?: LineMarkerType;
}
export { LineMarker };