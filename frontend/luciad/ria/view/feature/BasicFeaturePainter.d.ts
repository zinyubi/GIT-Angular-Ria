import { Feature } from "../../model/feature/Feature.js";
import { Shape } from "../../shape/Shape.js";
import { ShapeType } from "../../shape/ShapeType.js";
import { Layer } from "../Layer.js";
import { Map } from "../Map.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { IconStyle } from "../style/IconStyle.js";
import { ShapeStyle } from "../style/ShapeStyle.js";
import { FeaturePainter, PaintState } from "./FeaturePainter.js";
/**
 * Describes current view/user interactions related to a specific shape.
 * @since 2021.0
 */
export interface ShapeInteractionState {
  /**
   * Flags whether the shape is currently selected.
   */
  selected?: boolean;
  /**
   * Flags whether the shape is currently in the hovered state (i.e. a cursor is hovering over it).
   */
  hovered?: boolean;
}
/**
 * A feature painter implementation that allows you to match {@link ShapeType} to styles.
 */
declare class BasicFeaturePainter extends FeaturePainter {
  /**
   * Creates a new basic feature painter.
   * <p/>
   * By default:
   * <ul>
   *   <li>{@link IconStyle Icons} are painted with round blue dots</li>
   *   <li>{@link FillStyle Fills} are light blue, slightly transparent</li>
   *   <li>{@link LineStyle Lines} are white (including area outlines)</li>
   *   <li>Extruded shape have a lighter fill color, so they can be identified on a 2D map</li>
   * </ul>
   */
  constructor();
  /**
   * Sets the style for the given shape type and state.
   * @param shapeType a shape type
   * @param state the state for which the style must apply
   * @param style the style to use.
   */
  setStyle(shapeType: ShapeType, state: ShapeInteractionState, style: ShapeStyle | IconStyle): void;
  /**
   * Gets the style for a given shape type and state.
   * @param shapeType a shape type
   * @param state the state for which you want to retrieve the style
   * @return {luciad.view.style.ShapeStyle} the rendering style
   */
  getStyle(shapeType: ShapeType, state: ShapeInteractionState): ShapeStyle | IconStyle | null;
  paintBody(aGeoCanvas: GeoCanvas, aObject: Feature, aShape: Shape, aLayer: Layer, aMap: Map, aPaintState: PaintState): void;
}
export { BasicFeaturePainter };