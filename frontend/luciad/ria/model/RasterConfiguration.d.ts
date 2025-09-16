import { RasterDataType } from "./tileset/RasterDataType.js";
import { RasterSamplingMode } from "./tileset/RasterSamplingMode.js";
/**
 * Configuration settings for a raster model. These can be used to indicate what the raster data represents (imagery
 * or elevation) and how the data should be interpreted (point vs area sampled).
 *
 * @since 2024.0
 */
export interface RasterConfiguration {
  /**
   * <p>Configures the model's {@link RasterDataType}.</p>
   *
   * <p>The {@link RasterDataType.ELEVATION ELEVATION} raster
   * data type will only have an effect in a 3D map, and acts as a way of representing
   * 3D terrain visually. The ELEVATION dataType will not be visualized as a colorized
   * heightmap as it only affects the 3D height values of the surface of the earth.
   * </p>
   *
   * <p>The default is {@link RasterDataType.IMAGE IMAGE}.</p>
   * @since 2024.0
   */
  dataType?: RasterDataType;
  /**
   * <p>
   *   Configures the model's {@link RasterSamplingMode}, corresponding to the setting representation of
   *   the underlying raster data.
   * </p>
   *
   * <p>
   *   For {@link RasterSamplingMode.AREA AREA}.
   *   For {@link RasterSamplingMode.POINT POINT}.
   * </p>
   *
   * <p>
   *   For elevation, samplingMode {@link RasterSamplingMode.POINT POINT} is recommended for performance and accuracy.
   * </p>
   * @since 2024.0
   */
  samplingMode?: RasterSamplingMode;
}