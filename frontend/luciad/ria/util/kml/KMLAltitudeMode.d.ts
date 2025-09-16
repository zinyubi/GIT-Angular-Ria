/**
 * Specifies how a KML altitude is interpreted.
 * @since 2021.0
 */
export declare enum KMLAltitudeMode {
  /** Altitudes are relative to Mean Sea Level (MSL), regardless of the terrain elevation. */
  ABSOLUTE = 1,
  /** Altitudes should be ignored and the element should rest on the terrain. */
  CLAMP_TO_GROUND = 2,
  /** Altitudes are "Above Ground Level" (AGL). */
  RELATIVE_TO_GROUND = 4,
}