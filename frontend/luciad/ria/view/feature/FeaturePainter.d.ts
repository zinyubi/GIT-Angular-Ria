import { Feature, FeatureId } from "../../model/feature/Feature.js";
import { Shape } from "../../shape/Shape.js";
import { ColorMap } from "../../util/ColorMap.js";
import { Evented, Handle } from "../../util/Evented.js";
import { Layer } from "../Layer.js";
import { Map } from "../Map.js";
import { BorderGeoCanvas } from "../style/BorderGeoCanvas.js";
import { BorderLabelCanvas } from "../style/BorderLabelCanvas.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { LabelCanvas } from "../style/LabelCanvas.js";
import { FeatureLayer } from "./FeatureLayer.js";
/**
 * The type that represents Feature Painter events.
 * @since 2020.1
 */
export type FeaturePainterEvents = "Invalidate" | "InvalidateById" | "InvalidateAll";
/**
 * Density settings, for more information see {@link FeaturePainter.density}.
 *
 * @since 2022.0
 */
export interface DensitySettings {
  /**
   * Used to map density values to a color.
   */
  colorMap: ColorMap;
}
/**
 * An object that determines how features are visualized in a {@link FeatureLayer}.
 *
 * You will need to reassign the <code>paintBody</code> method since its default implementation only throws an error.
 * This object does not have a <code>paintLabel</code> method as it is optional.
 *
 * ```javascript
 * [[include:view/feature/FeaturePainterSnippets.ts_SIMPLE_FEATURE_PAINTER]]
 * ```
 * ```javascript
 * [[include:view/feature/FeaturePainterSnippets.ts_CLASS_FEATURE_PAINTER]]
 * ```
 *
 * To use a basic painter, see {@link BasicFeaturePainter}.
 */
export declare class FeaturePainter implements Evented {
  /**
   * Creates a new painter instance.
   */
  constructor();
  /**
   * Renders a model object on the map.<br/>
   *
   * This method is called by the map for each `(feature, paintState)` combination.
   * The result of the rendering is cached by the system, so this method is
   * called only once per combination unless it is explicitly invalidated. <br/>
   *
   * To invalidate a cached result, call one of the `invalidate` methods on the painter instance. <br/>
   *
   * Rendering can vary depending on the `paintState`, which includes:
   * <ul>
   *   <li>selected: a boolean value indicating whether the feature is currently selected.</li>
   *   <li>hovered: a boolean value indicating whether the feature is currently hovered over</li>
   *   <li>level: the current level of detail, where `0` is the least detailed</li>
   * </ul>
   *
   * <b>Note</b> For quick dataset visualization, you can use {@link BasicFeaturePainter}.
   * If you need more advanced or customized styling logic, implement this method yourself.
   * The default implementation will throw an error.
   *
   * @param geoCanvas The rendering target.
   * @param feature The feature to be rendered.
   * @param shape The shape of the feature. This shape may be provided by a `ShapeProvider` associated with the layer.
   * @param layer The layer that contains the given feature.
   * @param map The map on which the layer is displayed.
   * @param paintState The current state describing how the feature should be rendered.
   */
  paintBody(geoCanvas: GeoCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState): void;
  /**
   * Renders a label for a model object on the map. <br/>
   *
   * This method is invoked by the map for each `(feature, paintState)` combination.
   * The result is cached by the system, so the method is called only once per combination
   * unless explicitly invalidated.<br/>
   *
   * To invalidate a cached result, call one of the `invalidate` methods on the painter instance.<br/>
   *
   * Rendering can vary depending on the `paintState`, which includes
   * <ul>
   *   <li>selected: a boolean value indicating whether the feature is currently selected.</li>
   *   <li>hovered: a boolean value indicating whether the feature is currently hovered over</li>
   *   <li>level: the current level of detail, where `0` is the least detailed</li>
   * </ul>
   *
   * <b>Note</b>: This method is not implemented by default. If label rendering is required, you must provide a custom implementation.
   *
   * @param labelCanvas the render target
   * @param feature the feature that is being rendered
   * @param shape the shape to render
   * @param layer the layer containing the given feature
   * @param map the map containing the layer
   * @param paintState an object describing the current paint state
   */
  paintLabel?(labelCanvas: LabelCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState): void;
  /**
   * The method to describe how a model object has to be visualized in bottom and left border of the vertical view map.
   * The map must first be configured with axis.
   * <p>
   * Only the bottom border decorations are painted by default. The Left border decorations must be enabled explicitly
   * on the layer using LEFT_BORDER_BODY {@link PaintRepresentation paint representation}.
   * <p>
   * This is an optional method.
   *
   * @param borderGeoCanvas the render target
   * @param feature the feature that is being rendered
   * @param shape the shape to render
   * @param layer the layer containing the given feature
   * @param map the map containing the layer
   * @param paintState an object describing the current paint state
   */
  paintBorderBody?(borderGeoCanvas: BorderGeoCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: BorderPaintState): void;
  /**
   * The method to describe how a model object has to be labeled on the bottom and left border of the vertical view map.
   * <p>
   * Only the bottom border labels are painted by default. The Left border labels must be enabled explicitly
   * on the layer using LEFT_BORDER_LABEL {@link PaintRepresentation paint representation}.
   * <p>
   * This is an optional method.
   *
   * @param borderLabelCanvas the render target
   * @param feature the feature that is being rendered
   * @param shape the shape to render
   * @param layer the layer containing the given feature
   * @param map the map containing the layer
   * @param paintState an object describing the current paint state
   */
  paintBorderLabel?(borderLabelCanvas: BorderLabelCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: BorderPaintState): void;
  /**
   * Invalidates this painter for a specific feature.
   * Call this method when any state that affects the rendering of the given feature has changed.
   * This method refreshes the associated {@link FeatureLayer layer} and ensures that
   * {@link FeaturePainter.paintBody} and
   * {@link FeaturePainter.paintLabel}
   * will be called for the specified feature during the next map render.
   *
   * <p>Note: If the layer is currently invisible, the invalidation is deferred
   * and will be applied when the layer becomes visible again.</p>
   *
   * @param feature the model feature whose representation has changed
   */
  invalidate(feature: Feature): void;
  /**
   * Invalidates this painter for a specific feature identified by its id.
   * Call this method when any state that affects the rendering of the given feature has changed.
   * This method refreshes the associated {@link FeatureLayer layer} and ensures that
   * {@link FeaturePainter.paintBody} and
   * {@link FeaturePainter.paintLabel}
   * will be called for the specified feature during the next map render.
   *
   * <p>Note: If the layer is currently invisible, the invalidation is deferred
   * and will be applied when the layer becomes visible again.</p>
   *
   * @param featureId The id of the feature. It corresponds to {@link Feature.id}.
   */
  invalidateById(featureId: FeatureId): void;
  /**
   * Invalidates this painter for all features.
   * Call this method when any state that affects the rendering of features has changed.
   * This method refreshes the associated {@link FeatureLayer layer} and ensures that
   * {@link FeaturePainter.paintBody} and
   * {@link FeaturePainter.paintLabel} will be called for all features in
   * the layer during the next map render.
   *
   * <p>Note: If the layer is currently invisible, the invalidation is deferred
   * and will be applied when the layer becomes visible again.</p>
   *
   * Note that this is called automatically whenever {@link Map.displayScale} changes.
   */
  invalidateAll(): void;
  /**
   * Returns an array of map scales that define when to switch between levels of detail. <br/>
   *
   * This method allows the painter to support multiple visual representations (levels-of-detail, or LOD)
   * for the same feature depending on the map's current scale. The map determines the active level
   * and passes it to the painter via the `paintState.level` property during rendering.
   * If the level changes due to map navigation (such as zooming, panning, or fitting), the map will call the paintBody and paintLabel methods with the corresponding level.
   *
   * By default, this method returns `null`, indicating that level-of-detail is not used.
   * Override this method to enable scale-based LOD behavior.
   *
   * @param layer The feature layer for which level-of-detail scales are requested.
   * @param map The map instance for which the scales apply.
   *
   * @return An array of scales at which to switch to the next detail level, or `null` if LOD is not used.
   *
   * @see {@link paintBody FeaturePainter#paintBody}
   * @see {@link paintLabel FeaturePainter#paintLabel}
   *
   * ```javascript
   * [[include:view/feature/FeaturePainterSnippets.ts_FEATURE_PAINTER_LOD]]
   * ```
   */
  getDetailLevelScales(layer?: FeatureLayer, map?: Map): number[] | null;
  /**
   * Set or get the density painting settings on this painter.  Use <code>null</code> to disable density painting.
   * <p/>
   * The setting affects all features in the layer associated with this painter.
   * <p/>
   * The density settings object has one property: <code>colorMap</code>, the {@link ColorMap color map}
   * used to map density values to color.
   * <p/>
   * The density at a particular location is the sum of the value of alpha channel for all overlapping objects. So for
   * a single opaque object you would get a density value of 1.0, for 2 opaque objects 2.0, etc.
   * <br/>
   * Example:
   *
   * ```javascript
   *   var painter = new FeaturePainter();
   *   painter.paintBody = ... // customize painter as usual
   *   painter.density = {
   *     colorMap: ColorMap.createGradientColorMap([
   *       {level:  0, color: "rgba(  0,   0,   0, 0.0)"}, // no objects       -> Transparent
   *       {level:  1, color: "rgba(  0, 255,   0, 0.5)"}, // 1 opaque object  -> Transparent green
   *       {level: 10, color: "rgba(255, 255, 255, 1.0)"}  //10 opaque objects -> White
   *     ])
   *   };
   * ```
   *
   * <p/>
   * Notes when using density painting:
   * <ul>
   *   <li>Density painting works for all kinds of objects: points/icons, lines and areas.</li>
   *   <li>The color aspect of the styling provided in {@link paintBody} is ignored.  The alpha value of the color is used as a per-feature weight.</li>
   *   <li>If you paint icons, you can leave out the icon image.  You will automatically get a gradient icon.  You can still adapt the size with the {@link GenericIconStyle.width width} and {@link GenericIconStyle.height height} style properties.</li>
   * </ul>
   * <p/>
   * This property is only supported on a {@link WebGLMap}, and is ignored otherwise.
   */
  get density(): DensitySettings | null;
  set density(value: DensitySettings | null);
  /**
   * Registers a callback function for the "InvalidateAll" event, that notifies a listener that
   * the all features are invalidated.
   *
   * @param event    Always set to "InvalidateAll" for this event type.
   * @param callback The callback function to be executed when the event is emitted
   * @param context  The context in which the function should be invoked.
   *
   * @event "InvalidateAll"
   * @since 2020.1
   */
  on(event: "InvalidateAll", callback: () => void, context?: any): Handle;
  /**
   * Registers a callback function for the "Invalidate" event, that notifies a listener that
   * a given feature is invalidated.
   *
   * @param event    Always set to "Invalidate" for this event type.
   * @param callback The callback function to be executed when the event is emitted
   * @param context  The context in which the function should be invoked.
   *
   * @event "Invalidate"
   * @since 2020.1
   */
  on(event: "Invalidate", callback: (feature: Feature) => void, context?: any): Handle;
  /**
   * Registers a callback function for the "InvalidateById" event, that notifies a listener that
   * a feature with the given id is invalidated.
   *
   * @param event    Always set to "InvalidateById" for this event type.
   * @param callback The callback function to be executed when the event is emitted
   * @param context  The context in which the function should be invoked.
   *
   * @event "InvalidateById"
   * @since 2020.1
   */
  on(event: "InvalidateById", callback: (id: FeatureId) => void, context?: any): Handle;
}
/**
 * Describes the current paint state.
 */
export interface PaintState {
  /**
   * <code>true</code> if the feature is being rendered in selected mode; false otherwise.
   */
  selected: boolean;
  /**
   * <code>true</code> if the feature is being rendered in hovered mode; false otherwise.
   *
   * Note that {@link HoverController} needs
   * to be active on the map (this controller is part of the default LuciadRIA map behavior) for this to be <code>true</code>.
   *
   * @since 2021.0
   */
  hovered: boolean;
  /**
   * The current level of detail as a non-negative integer value. The least precise
   * detail level is <code>0</code>. The number of available detail levels is
   * determined by the array returned by {@link FeaturePainter.getDetailLevelScales}
   */
  level: number;
}
/**
 * Describes the current paint state.
 */
export interface BorderPaintState extends PaintState {
  /**
   * The border on which the feature will be visualized
   */
  border: Map.Border;
}