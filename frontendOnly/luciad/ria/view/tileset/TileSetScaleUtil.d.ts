import { RasterTileSetModel } from "../../model/tileset/RasterTileSetModel.js";
import { Map } from "../Map.js";
import { Layer } from "../Layer.js";
/**
 * Calculates the map scale corresponding to a given level of a
 * {@link RasterTileSetModel}.
 * This method is useful when you want to zoom to a given level of
 * a tileset.
 * @param tilesetModel the model for which to compute the scale
 * @param map the target map
 * @param level the tileset level
 * @return the corresponding map scale value
 * @throws {@link ProgrammingError} if the scale levels cannot be computed.
 */
export declare function calculateScaleForTilesetLevel(tilesetModel: RasterTileSetModel, map: Map, level: number): number;
/**
 * <p>
 * Calculate the level of the layer's model that corresponds to the current map scale.
 * </p>
 *
 * <p>
 * Note that when the return value is not an integer between the minimum and maximum level range
 * of the layer's model, it is undefined what level will actually be used for visualization.
 * The framework will make a best effort to select the most appropriate level.
 * </p>
 *
 *
 * @param layer The raster tileset layer.
 * It must be added to the map.
 * @param map the map
 * @returns The level of the layer's tileset model
 * which is currently being displayed on the map.
 * If the value is smaller than 0, the map is zoomed out beyond
 * the first (lowest) level of the layer's model.
 * If the value is larger than the last (highest resolution) level, then
 * the map is zoomed beyond the highest available resolution of the model.
 * If the value is exactly an integer, than this means the map scale corresponds
 * to that level of the model. If the value is in between two integers,
 * then the map scale is "in between" those two levels of the model.
 *
 * @since 2014.0
 */
export declare function calculateTilesetLevelForMapScale(layer: Layer, map: Map): number;