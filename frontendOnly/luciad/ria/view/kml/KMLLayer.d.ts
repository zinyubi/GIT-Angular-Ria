import { FeatureModel } from "../../model/feature/FeatureModel.js";
import { FeatureLayer, FeatureLayerConstructorOptions } from "../feature/FeatureLayer.js";
import { DrapeTarget } from "../style/DrapeTarget.js";
import { FeaturePainter } from "../feature/FeaturePainter.js";
/**
 * Constructor options for {@link KMLLayer}`
 * @since 2022.1
 */
export interface KMLLayerConstructorOptions extends FeatureLayerConstructorOptions {
  /**
   * The drape target determines the surface onto which the KML placemarks will be rendered.
   * @default DrapeTarget.TERRAIN
   */
  drapeTarget?: DrapeTarget;
  /**
   * The painter to draw the shape of {@link KMLPlacemarkFeature KML placemark features}.
   * Set this painter to provide a custom implementation of rendering KML placemark features.
   * @default KMLPainter
   */
  painter?: FeaturePainter;
}
/**
 * A KML Layer that can visualize KML Models in a LuciadRIA {@link Map}.
 *
 * <p>A KML Layer is a layer that is capable of visualizing OGC KML 2.3 Models.</p>
 *
 * <p>Only {@link KMLPlacemarkFeature placemark features} are visualized, that contain any of the following geometry:
 *   <ul>
 *     <li>Points</li>
 *     <li>LineString</li>
 *     <li>LinearRing</li>
 *     <li>Polygon</li>
 *     <li>MultiGeometry</li>
 *     <li>Models are converted to Points</li>
 *   </ul>
 * </p>
 *
 * <p>The layer's default painter draws placemark features taking into account KML styles
 * that are encoded into {@link KMLPlacemarkFeature placemark features}.
 * You can use a custom painter that extends from {@link KMLPainter} to implement
 * a custom rendering logic of placemark features</p></p>
 *
 * <p>If selection is enabled on the layer, you can select a feature to have it generate a balloon. Note that balloons
 * are only generated if the feature contains a description. The balloon can have static HTML content.</p>
 *
 * <p>In order for a feature to be visible, the <code>visibility</code> element in KML data must be set to 1.
 * You can control visibility of loaded KML features by changing the {@link KMLFeatureProperties.visibility} property.
 *
 * <p>Limitations:
 *   <ul>
 *     <li>Level-of-Detail elements (i.e. Region), and other view-based attributes, are not used for painting.</li>
 *   </ul>
 * </p>
 */
export declare class KMLLayer extends FeatureLayer {
  /**
   * Creates a new KML Layer that can visualize KML Models in a LuciadRIA {@link Map}.
   *
   * @param kmlModel A model containing KML data.
   * @param options The options for this layer. If no painter is set in these options, the KML
   *                  will use a custom built-in painter to paint KML features, adhering to the
   *                  style information in the KML file.
   */
  constructor(kmlModel: FeatureModel, options?: KMLLayerConstructorOptions);
  get model(): FeatureModel;
  /**
   * Specifies the surface onto which KML placemarks will be rendered (the drape target).
   * Here are some rules to be aware of when a KML placemark uses a drape target on 3D maps:
   *
   * <ul>
   * <li>Shapes will be draped onto the surface specified by `KMLLayer.drapeTarget`
   *     if the geometry's `altitudeMode` in the KML file is either:
   *    <ul>
   *    <li>`clampToGround`</li>
   *    <li>`relativeToGround`, with all z-coordinates of the shape set to zero.</li>
   *    </ul>
   * </li>
   * <li>Otherwise, shapes are not draped.</li>
   * </ul>
   *
   * The style of a placemark with a drape target can be customized using the style objects
   * returned by `KMLPainter.getPlacemarkShapeStyle` or `KMLPainter.getPlacemarkIconStyle`.
   *
   * <p>Note: Draping does not apply to extruded shapes.
   *
   * By default, this is {@link DrapeTarget.TERRAIN}.
   * @since 2022.1
   */
  get drapeTarget(): DrapeTarget;
  set drapeTarget(target: DrapeTarget);
  /**
   * <p>Determines whether the KML layer is hoverable.</p>
   * If the <code>hoverable</code> state is not set explicitly by the user then
   * the state is deduced from the underlying KML data, making the layer hoverable
   * only when the KML data defines a different style for the normal and highlight states.
   */
  get hoverable(): boolean;
  set hoverable(enabled: boolean);
}