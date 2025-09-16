/**
 * Describes the tileset structure of a panorama
 * @since 2020.1
 */
export interface PanoramaTileSetStructure {
  /**
   * The number of tile columns at the coarsest level. The default value is 1.
   */
  level0Columns: number;
  /**
   * The number of tile rows at the coarsest level, the default value is 1.
   */
  level0Rows: number;
  /**
   * The number of tile levels contained in this tileset
   */
  levelCount: number;
  /**
   * The width of each individual tile in pixels, at a given level.
   * Within a single level, all tiles have the same width and height.
   *
   * @return the width of tile rows on the specified level. Null if <code>level</code> falls outside of the valid range of levels ([0, levelCount[) for this tileset.
   */
  getTileWidth(level: number): number | null;
  /**
   * The height of each individual tile in pixels, at a given level.
   * Within a single level, all tiles have the same width and height.
   *
   * @param level The level for which to determine the tile height in pixels.
   * @return the number of tile rows on the specified level. Null if <code>level</code> falls outside of the valid range of levels ([0, levelCount[) for this tileset.
   */
  getTileHeight(level: number): number | null;
  /**
   * Returns the number of rows in the panorama tile grid at the given level.
   *
   * Each level should have twice the number of rows of the previous one.
   * @param level the level to be queried
   * @return the number of tile rows on the specified level. Null if <code>level</code> falls outside of the valid range of levels ([0, levelCount[) for this tileset.
   */
  getTileRowCount(level: number): number | null;
  /**
   * Returns the number of columns in the panorama tile grid at the given level.
   * Each level should have twice the number of rows of the previous one.
   * @param level the level to be queried
   * @return the number of tile columns on the specified level. Null if <code>level</code> falls outside of the valid range of levels ([0, levelCount[) for this tileset.
   */
  getTileColumnCount(level: number): number | null;
  /**
   * A number indicating what fraction of a level contains image data in the x direction.
   * Some data sets contain levels and tiles where the image data does not span the entire range.
   * The default value is 1, meaning all pixels contain image data and no tiles are left out.
   */
  imageDataFractionX: number;
  /**
   * A number indicating what fraction of a level contains image data in the y direction.
   * Some data sets contain levels and tiles where the image data does not span the entire range.
   * The default value is 1, meaning all pixels contain image data and no tiles are left out.
   */
  imageDataFractionY: number;
}
/**
 * Options to create a power-of-two tileset structure.
 *
 * You must at the very least specify tileWidth and tileHeight.
 *
 * @since 2020.1
 */
export interface PowerOfTwoTileSetStructureOptions {
  /**
   * The number of tile columns at the coarsest level. The default value is 1.
   */
  level0Columns?: number;
  /**
   * The number of tile rows at the coarsest level, the default value is 1.
   */
  level0Rows?: number;
  /**
   * The number of tile levels contained in this tileset
   */
  levelCount?: number;
  /**
   * The width of each individual tile in pixels.
   */
  tileWidth: number;
  /**
   * The height of each individual tile in pixels.
   */
  tileHeight: number;
  /**
   * A number indicating what fraction of a level contains image data in the x direction.
   * Some data sets contain levels and tiles where the image data does not span the entire range.
   * The default value is 1, meaning all pixels contain image data and no tiles are left out.
   */
  imageDataFractionX?: number;
  /**
   * A number indicating what fraction of a level contains image data in the y direction.
   * Some data sets contain levels and tiles where the image data does not span the entire range.
   * The default value is 1, meaning all pixels contain image data and no tiles are left out.
   */
  imageDataFractionY?: number;
}
/**
 * Creates a power-of-two tileset structure.
 * Every level has twice the amount of rows and columns of the previous level.
 * All levels have the same tile width and tile height.
 *
 * @since 2020.1
 */
export declare const createPowerOfTwoStructure: (options: PowerOfTwoTileSetStructureOptions) => PanoramaTileSetStructure;