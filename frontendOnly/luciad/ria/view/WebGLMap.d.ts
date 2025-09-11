import { Bounds } from "../shape/Bounds.js";
import { Handle } from "../util/Evented.js";
import { Controller } from "./controller/Controller.js";
import { HoverChangeEvent, Map, MapBoundsOptions, MapConstructorOptions, SelectionChangeEvent } from "./Map.js";
import { CoordinateReference } from "../reference/CoordinateReference.js";
/**
 * A hint about the memory consumption allowed by this application.
 * See {@link WebGLMap.maxMemoryUsageHint} for more information.
 */
export interface WebGLMapMemoryUsageHint {
  /**
   * A hint for the maximum CPU memory usage, defined in MB.
   */
  cpuMB: number;
  /**
   * A hint for the maximum GPU memory usage, defined in MB.
   */
  gpuMB: number;
}
/**
 * Defines the map options to be used when creating a new {@link WebGLMap}.
 */
export interface WebGLMapConstructorOptions extends MapConstructorOptions {
  /**
   * A hint about the memory consumption allowed by this application.
   * See {@link maxMemoryUsageHint} for more information.
   */
  maxMemoryUsageHint?: WebGLMapMemoryUsageHint;
  /**
   * Whether the near and far planes of the map's camera should automatically adjust when the camera or terrain gets
   * updated.
   * See {@link adjustDepthRange} for more information.
   *
   * @since 2022.0
   */
  adjustDepthRange?: boolean;
}
/**
 * <p>
 * A WebGLMap is identical to {@link ria/view/Map!Map Map}, except it uses the browser's WebGL capabilities for hardware-accelerated rendering.
 * </p>
 * <p>
 * To create a hardware-accelerated 2D map, do:
 *
 * ```javascript
 * map = new WebGLMap("map");
 * ```
 * <p>
 * To create a hardware-accelerated 3D map, use reference EPSG:4978:
 * </p>
 *
 * ```javascript
 * map = new WebGLMap("map", { reference: ReferenceProvider.getReference("EPSG:4978") });
 * ```
 *
 * <p>
 * Please refer to the documentation of {@link Map} for all the details.
 * </p>
 * <p>
 * In addition to the constructor options on {@link Map}, you can pass:
 * <ul>
 *   <li><i>maxMemoryUsageHint</i>, a literal with <i>cpuMB</i> and/or <i>gpuMB</i> properties.  See {@link maxMemoryUsageHint} for details.</li>
 * </ul>
 * </p>
 * <p>
 * For more details on WebGL and hardware-accelerated maps, see
 * <a href="articles://tutorial/technology/features_and_benefits.html">LuciadRIA benefits</a>.
 * See <a href="articles://guide/systemrequirements.html#_webgl_system_requirements_and_limitations">WebGL system requirements and limitations</a>
 * for details on supported devices and browsers, considerations, limitations, and so on.
 * </i>
 * </p>
 * @since 2016.0
 */
export declare class WebGLMap extends Map {
  /**
   * Creates a new WebGL map.
   * @param node either the DOM node in the web-page which will hold the map or that node's id.
   * The container for a map is typically a DIV-element.
   * @param options the map configuration
   */
  constructor(node: string | HTMLElement, options?: WebGLMapConstructorOptions);
  /**
   * The current world reference of the map.
   *
   * When switching the map's reference, parts of the map are destroyed and recreated, which has the following effects:
   * <ul>
   *   <li> The visible layers can unload and quickly reload. </li>
   *   <li> After switching reference, {@link controller map.controller} is set to null and
   *   {@link defaultController map.defaultController} is set to a new {@link DefaultController}. </li>
   *   <li> Map creation options that are not supported in the new reference, will be lost. For example, when switching
   *   from a map that has <code>wrapAroundWorld: true</code> to a 3D reference and then back to a 2D reference, <code>wrapAroundWorld</code>
   *   will be false. </li>
   * </ul>
   *
   * The camera state is also {@link saveState saved} before switching and {@link restoreState restored} after
   * switching if possible.
   *
   * You can not switch from or to a non-geospatial projection, even between LUCIAD:XY and LUCIAD:XYZ.
   */
  set reference(reference: CoordinateReference);
  get reference(): CoordinateReference;
  /**
   * A hint about the memory consumption allowed by this application.
   * <p/>
   * These hints only apply to internal data managed by the WebGLMap, not to any user data present in the application.
   * <p/>
   * This can help preventing the browser tab from crashing. If you experience such behavior, try reducing both CPU and GPU memory from the default values.
   * Alternatively, if memory is not a problem and browser is stable enough, pushing those values higher can improve caching efficiency.
   * <p/>
   * Notes:
   * <ul>
   *   <li>The values are expressed in megabytes.</li>
   *   <li>The memory will be distributed over the layers in your map.</li>
   *   <li>The distribution happens automatically and continuously.</li>
   *   <li>The distribution can be un-even, so you can have large layers and small layers.</li>
   *   <li>Each layer implementation will attempt to restrict its memory usage to its allocation portion.</li>
   *   <li>Typically they will scrap cached data to reach the limit.</li>
   *   <li>Some layers will reduce quality or amount of data loaded.  If so, they will log this clearly.</li>
   *   <li>If a layer still needs more memory than allocated, it will log warnings, but otherwise keep using the memory.</li>
   *   <li>Your browser's process memory usage may be much larger than these limits.  Next to the data in the layers, your application needs memory also.  Additionally, the browser typically keeps copies of GPU data, and needs other data structures to drive its Javascript engine and DOM.</li>
   * </ul>
   * <p/>
   * By default, the limits are 500 MB for CPU and 1000 MB for GPU.
   *
   * ```javascript
   *    map.maxMemoryUsageHint = {
   *      cpuMB: 500,
   *      gpuMB: 1200
   *    }
   * ```
   */
  get maxMemoryUsageHint(): WebGLMapMemoryUsageHint;
  set maxMemoryUsageHint(hint: WebGLMapMemoryUsageHint);
  /**
   * A boolean indicating whether the near and far planes of this map's camera should automatically adjust when the
   * camera or terrain gets updated.
   * By default, this is true to avoid rendering artifacts while keeping objects on the earth's surface visible.
   * Setting this to false removes this safeguard but allows you to have more fine-grained control of the near and far
   * planes, for example when you want to be able to navigate close to objects that are far away from the earth.
   * On maps with a 3D cartesian world reference, with likely application-specific near and far settings, the default is false.
   *
   *  @since 2022.0
   */
  set adjustDepthRange(value: boolean);
  get adjustDepthRange(): boolean;
  /**
   * The WebGL context of the map.
   *
   * Note that you should avoid modifying this GL context.
   * LuciadRIA assumes the GL state of the context remains unchanged.
   * If you want to render additional content in this context, do so in a {@link on "PostRender"} hook.
   *
   * You can access this context to listen for WebGL context loss events, or read pixels from the webGL context.
   * For example, to listen for WebGL context loss events, you can use the following code:
   *
   * ```typescript
   * [[include:view/WebGLMapSnippets.ts_WEBGL_CONTEXT_LOSS]]
   * ```
   *
   * The WebGL context can be lost for several reasons, like driver crashes, switching displays
   * or too many resources being used on the GPU.
   * When the context is lost, it means that the GPU has stopped rendering and the map is no longer visible.
   * While the context is lost, you can still use the map and its associated objects
   * (like the {@link layerTree}, the {@link controller} or the {@link mapNavigator}), but you won't see anything on screen.
   *
   * When the WebGL context is lost, LuciadRIA interrupts all ongoing animations.
   * There might be some errors reported on the console,
   * for example when LuciadRIA does WebGL calls before the 'webglcontextlost' event is fired by the browser.
   * You can ignore these errors for a lost WebGL context, {@link reboot rebooting} the map will re-initialize all rendering state.
   *
   * You can respond to WebGL context losses by listening to the {@link on WebGLContextChanged} event and
   * calling {@link reboot} to let LuciadRIA create a new WebGL context. For example, when the WebGL context is lost,
   * you can show an overlay on the map that informs the user that the context was lost. The user can try to
   * {@link reboot} the map with a button in the overlay.
   *
   * Note that calling {@link reboot} changes this {@link webGLContext}. If you're listening to <code>webglcontextlost</code>
   * events, you need to make sure that you attach your listeners to the new context.
   *
   * For more information on dealing with WebGL context losses in LuciadRIA, check out the
   * <a href="articles://howto/view/webgl_context_loss.html">Dealing with WebGL context losses</a> article.
   *
   * @since 2023.0
   */
  get webGLContext(): WebGL2RenderingContext | null;
  getMapBounds(options?: MapBoundsOptions): Bounds[];
  /**
   * This method reboots the WebGL context of the map.
   * This can be useful when the context has been lost and the map has to re-create GPU resources.
   *
   * Typically, you call this some time after a <code>"webglcontextlost"</code> event. For example,
   * when the WebGL context is lost, you can show an overlay on the map that informs the user that the context was lost.
   * The user can try to {@link reboot} the map with a button in the overlay.
   *
   * If you call this while the existing {@link webGLContext} is lost, the map creates a new WebGL context for rendering.
   * This changes the value of {@link webGLContext}.
   * If the context was not lost, calling this function has no effect.
   *
   * Because LuciadRIA interrupts any animations when the {@link webGLContext} is lost,
   * you might have to restart an {@link Animation animation} after rebooting.
   *
   * For more information on dealing with WebGL context losses in LuciadRIA, check out the
   * <a href="articles://howto/view/webgl_context_loss.html">Dealing with WebGL context losses</a> article.
   *
   * @since 2023.0
   */
  reboot(): void;
  /**
   * An event that is emitted whenever {@link webGLContext} changes.
   *
   * {@link webGLContext} typically changes when the map is initialized (from <code>null</code> to a context), or
   * when the map {@link reboot reboots} (from one context to another).
   *
   * @since 2023.0
   * @event
   */
  on(event: "WebGLContextChanged", callback: () => void, context?: any): Handle;
  /**
   * Called when the {@link reference} of this map was changed.
   *
   * @since 2024.1
   * @event
   */
  on(event: "ReferenceChanged", callback: (reference: CoordinateReference) => void, context?: any): Handle;
  /**
   * <p>Event hook that is called every frame after the map's layers have been rendered, but before the frame is
   * displayed. This allows you to paint additional content directly on the GL context in a post-render step.</p>
   *
   * <p>The GL context has a depth buffer available for depth testing. This enables the external content to be immersed
   * in the environment, meaning it will not be painted when it is behind opaque obstacles originating from LuciadRIA
   * layers. Make sure to enable depth testing when you want this though.</p>
   *
   * <p>Drawing directly on the GL context, or even delegating that to an external renderer, requires some WebGL
   * knowledge and is likely much more complex than rendering through regular LuciadRIA layers. Additionally, this
   * rendering approach comes with some limitations that are documented below, which may not make the content behave
   * the way that you want it to. For those reasons, we recommend to only use this callback when your use case cannot
   * be achieved by conventional means. For example, when you want to display non-animated 3D content, this can be done
   * with LuciadRIA's {@link Icon3DStyle 3D icons API} instead.</p>
   *
   * <p>Since this callback is only a post-render step, it is not fully integrated in LuciadRIA's rendering cycle and
   * comes with some limitations:
   * <ul>
   *   <li><p>Painting always happens after all layers have been painted. In other words, the external content cannot be
   *   painted before or in-between LuciadRIA layers. Note that, even though the painting order is fixed, depth testing
   *   can still be used to place your content behind objects in LuciadRIA layers.</p></li>
   *   <li><p>LuciadRIA controllers cannot interact with the external content. Because the content is painted directly
   *   on the GL context, LuciadRIA is essentially not aware of its existence. This makes it impossible to select the
   *   content, for example, or use it as an anchor for panning and zooming.</p></li>
   *   <li><p>Transparent objects from LuciadRIA layers will always appear below the content you paint yourself.</p>
   *   <p>While depth testing enables you to hide content behind opaque obstacles, the depth buffer does not contain
   *   data on transparent obstacles. This means that your content will be painted as though the transparent obstacles
   *   are not even there.</p>
   *   <p>When this situation occurs within or between regular layers, LuciadRIA will blend the colors of the involved
   *   objects. This results in a much more natural-looking rendering, as it gives the impression that you're only
   *   seeing the object through the transparent obstacle. For content rendered in this post-render step, that color
   *   blending is not possible.</p></li>
   *   <li><p>LuciadRIA effects such as lighting and shadows will not be applied to the external content.<p></li>
   * </ul></p>
   *
   * <p><b>Note:</b> It is the caller's responsibility to restore the GL context to its initial state after using it.
   * Not meeting this requirement can result in undefined behavior.</p>
   *
   * @param event The "PostRender" event type
   * @param callback callback to be invoked every frame, after the layers have been rendered. The callback gets a
   *                 WebGL 2 context as parameter, allowing it to paint additional content.
   * @param context value to use as this when executing callback
   * @see {@link webGLContext}
   * @since 2021.1
   * @event
   */
  on(event: "PostRender", callback: (glContext: WebGL2RenderingContext) => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "idle", callback: () => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "SelectionChanged", callback: (selectionChangeEvents: SelectionChangeEvent) => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "HoverChanged", callback: (hoverChangeEvents: HoverChangeEvent) => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "MapChange", callback: () => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "ShowBalloon", callback: () => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "HideBalloon", callback: () => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "ControllerChanged", callback: (newController: Controller | null, previousController: Controller | null) => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "DefaultControllerChanged", callback: (newController: Controller | null, previousController: Controller | null) => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "DisplayScaleChanged", callback: () => void, context?: any): Handle;
  /**
   * @see {@link Map.on}
   * @event
   */
  on(event: "AutoAdjustDisplayScaleChanged", callback: () => void, context?: any): Handle;
}