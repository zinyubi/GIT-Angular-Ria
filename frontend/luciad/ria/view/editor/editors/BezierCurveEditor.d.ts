import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
import { BezierCurveCreateHandle } from "../handles/BezierCurveCreateHandle.js";
import { BezierCurveHelperHandle } from "../handles/helper/BezierCurveHelperHandle.js";
import { CompositeEditHandle } from "../handles/CompositeEditHandle.js";
import { BezierCurveEditHandle } from "../handles/BezierCurveEditHandle.js";
/**
 * An editor that allows editing and creation of features with a Bézier curve ({@link BezierCurve}) shape.
 *
 * <h4>Handles</h4>
 * The Bézier curve editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/quadratic_bezier_curve_handles.png"
 *         alt="BezierCurveEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>BezierCurveEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createBezierCurveEditHandle}</b>:
 *          The handle that allows the user edit the control points of the Bézier curve.
 *   </li>
 *   <li><b>{@link createHelperHandle}</b>:
 *          A non-interactive handle, it paints a helper line between control points.
 *   </li>
 *   <li><b>{@link createTranslateHandle}</b>:
 *          This translates (moves) the entire {@link BezierCurve} shape.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 * The Bézier curve editor defines the following creation handles:
 *
 * <ul>
 *   <li><b>{@link createBezierCurveCreateHandle}</b>:
 *          The handle that allows the user create the control points of the Bézier curve.
 *   </li>
 *   <li><b>{@link createHelperHandle}</b>:
 *          A non-interactive handle, it paints a helper line between control points.
 *   </li>
 * </ul>
 *
 * The {@link BezierCurveEditor} uses the {@link BezierCurveCreateHandle} for creation,
 * and {@link BezierCurveEditHandle} for editing of a Bézier curve.
 *
 * Once creation starts, the user clicks (or taps) on the map to add control points to the Bézier curve.
 *
 * @since 2024.1
 */
export declare class BezierCurveEditor extends Editor {
  /**
   * Creates a new {@link BezierCurveEditor}.
   */
  constructor();
  /**
   * Returns `true` if the shape in the `context` is a Bézier curve ({@link BezierCurve}).
   * @param context The edit context.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing an {@link BezierCurve}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createBezierCurveEditHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   * @param context The edit context.
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that paints helper lines for the Bézier curve.
   * @param context The edit context.
   */
  createHelperHandle(context: EditContext): BezierCurveHelperHandle | null;
  /**
   * Returns a handle for creation of the Bézier curve.
   * @param context The edit context.
   */
  createBezierCurveCreateHandle(context: EditContext): BezierCurveCreateHandle | null;
  /**
   * Returns an edit handle for control points of the Bézier curve.
   * @param context The edit context.
   */
  createBezierCurveEditHandle(context: EditContext): BezierCurveEditHandle | null;
  /**
   * Returns a set of handles for creation a {@link BezierCurve}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createBezierCurveCreateHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   * </ul>
   * @param context The edit context.
   */
  getCreateHandle(context: EditContext): CompositeEditHandle | null;
}