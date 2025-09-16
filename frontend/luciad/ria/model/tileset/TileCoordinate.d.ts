/**
 * Models a tile coordinate in a tile pyramid.
 */
export interface TileCoordinate {
  /**
   * The level in the tile pyramid on which this tile resides
   */
  level: number;
  /**
   * The X coordinate (column) of the tile
   */
  x: number;
  /**
   * The Y coordinate (row) of the tile
   */
  y: number;
}