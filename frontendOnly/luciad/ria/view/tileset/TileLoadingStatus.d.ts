/**
 * A type representing the current status of tile loading.
 *
 * @since 2023.0
 */
export interface TileLoadingStatus {
  /**
   * Number of tiles that are currently loaded in this layer. This does not necessarily mean that those tiles are also
   * (completely) visible in the current view, because they may be located just outside the visible bounds, for example.
   *
   * While navigating the map, the number of tiles that are rendered can go up and down. It goes up as new tiles are
   * getting loaded and visualized, but goes down when the painter decides to drop old tiles that are no longer visible
   * or useful.
   */
  tilesLoaded: number;
  /**
   * Number of tiles that are currently being loaded. That includes any tiles which have been requested, are queued to
   * be requested or have been downloaded but are not yet rendered. For example, because their data is still being
   * uploaded to the GPU.
   *
   * When this number reaches zero, it means that all desired tiles have been loaded for the current camera position.
   * Note that, depending on the camera position and the tile structure of the source data, a tile may simply add more
   * tiles onto the pending queue once it is loaded. In other words, the number of pending tiles can also increase while
   * tile loading is in progress, even if the camera position does not change.
   */
  tilesPending: number;
}