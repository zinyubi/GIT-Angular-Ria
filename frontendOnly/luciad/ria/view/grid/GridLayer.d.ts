import { Layer } from "../Layer.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
import { LayerConstructorOptions } from "../LayerTreeNode.js";
import { Grid } from "./Grid.js";
/**
 * A grid layer. This layer is used for adding a grid to a map.
 *
 * For example:
 *
 * ```javascript
 *  var grid = new LonLatGrid([{deltaLat: 10, deltaLon: 10, scale: 0}],
 *                             {originLon: 10, originLat: 0});
 *
 *  var gridLayer = new GridLayer(grid);
 *  map.layerTree.addChild(gridLayer);
 * ```
 *
 * @since 2013.0
 */
export declare class GridLayer extends Layer {
  /**
   * Constructs a new grid layer.
   *
   * Note that software maps do not support MGRSGrids.
   *
   * @param grid the grid that needs to be visualized.
   * @param options layer parameters.
   */
  constructor(grid: Grid, options?: LayerConstructorOptions);
  /**
   * Indicates whether the specified paint representation is supported for this layer.
   * For a GridLayer, both the <code>BODY</body> and <code>LABEL</code> paint representations are supported.
   * @param paintRepresentation the paint representation
   * @returns <code>true</code> when <code>paintRepresentation</code> is supported.
   */
  isPaintRepresentationSupported(paintRepresentation: PaintRepresentation): boolean;
  /**
   * Sets the visibility of the paint representation.
   * Typically, you would use this to turn labeling of the grid on or off.
   *
   * @param paintRepresentation The paint representation of the layer.
   * @param visible the new visible state of the paint representation
   */
  setPaintRepresentationVisible(paintRepresentation: PaintRepresentation.BODY | PaintRepresentation.LABEL, visible: boolean): void;
  /**
   * A GridLayer doesn't have a model, use {@link GridLayer.grid} instead.
   */
  get model(): null;
  /**
   * The grid that this layer visualizes.
   * @since 2022.0
   */
  get grid(): Grid;
}