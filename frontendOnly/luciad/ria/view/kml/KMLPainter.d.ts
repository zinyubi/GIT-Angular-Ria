import { Feature } from "../../model/feature/Feature.js";
import { Shape } from "../../shape/Shape.js";
import { FeaturePainter, PaintState } from "../feature/FeaturePainter.js";
import { Layer } from "../Layer.js";
import { Map } from "../Map.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { IconStyle } from "../style/IconStyle.js";
import { LabelCanvas } from "../style/LabelCanvas.js";
import { ShapeStyle } from "../style/ShapeStyle.js";
/**
 * An object that determines how {@link KMLPlacemarkFeature} objects are visualized in a {@link KMLLayer}.
 * The KML painter can be extended to provide a custom implementation of drawing KML placemark features.
 *
 * Example on how to extend KMLPainter to placemarks with the bloom style on hover.
 *
 * ```javascript
 * [[include:view/kml/KMLPainterSnippets.ts_KML_CUSTOM_PAINTER]]
 * ```
 * @since 2023.1
 */
export declare class KMLPainter extends FeaturePainter {
  constructor();
  paintBody(geoCanvas: GeoCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState): void;
  paintLabel(labelCanvas: LabelCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState): void;
  /**
   * Returns {@link ShapeStyle} that corresponds to KML style associated with {@link KMLPlacemarkFeature},
   * or <code>null</code> if the feature is not an instance of {@link KMLPlacemarkFeature}.
   * This method is used by paintBody() to get a style for a non-point shape.
   *
   * @param feature KML placemark feature
   * @param paintState an object describing the current paint state.
   *                   If {@link PaintState.selected} or {@link PaintState.hovered} is true,
   *                   then the shape style is returned based on the KML 'highlight' style,
   *                   otherwise the KML regular style is used.
   * @returns LuciadRIA {@link ShapeStyle} or null, if the feature is not an instance of {@link KMLPlacemarkFeature}.
   */
  getPlacemarkShapeStyle(feature: Feature, paintState: PaintState): ShapeStyle | null;
  /**
   * Returns {@link IconStyle} for this style that corresponds to KML style associated with {@link KMLPlacemarkFeature}.
   * This method is used by paintBody() to get a style for a point shape.
   *
   * @param feature KML placemark feature
   * @param paintState an object describing the current paint state.
   *                   If {@link PaintState.selected} or {@link PaintState.hovered} is true,
   *                   then the icon style is returned based on the KML 'highlight' style,
   *                   otherwise the KML regular style is used.
   * @returns icon style, or null if the feature is not an instance of {@link KMLPlacemarkFeature} or if the KML icon style is not defined.
   */
  getPlacemarkIconStyle(feature: Feature, paintState: PaintState): IconStyle | null;
}