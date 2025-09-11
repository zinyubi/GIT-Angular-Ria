/**
 * Specifies a time-based refresh mode. (Default: <code>ON_CHANGE</code>).
 *
 * @since 2020.1
 */
export declare enum KMLRefreshMode {
  /** Refresh when the file is loaded and whenever link parameters change. */
  ON_CHANGE = 0,
  /** Refresh every <em>n</em> seconds, as specified in <code>refreshInterval</code>. */
  ON_INTERVAL = 1,
  /** Refresh the file when the expiration time is reached. */
  ON_EXPIRE = 2,
}
/**
 * Specifies how the link is refreshed when the "camera" changes (Default: <code>NEVER</code>).
 *
 * @since 2020.1
 */
export declare enum KMLViewRefreshMode {
  /** Ignore changes in the view, as well as <code>viewFormat</code> parameters. */
  NEVER = 0,
  /**
   * Refresh the file <em>n</em> seconds after movement stops, where <em>n</em> is specified
   * in <code>viewRefreshTime</code>.
   */
  ON_STOP = 1,
  /** Refresh the resource when the user requests it. */
  ON_REQUEST = 2,
  /** Refresh the resource if a <code>Region</code> becomes active. */
  ON_REGION = 3,
}
/**
 * Specifies the location of KML files, image files, or model files that must be retrieved from the network.
 *
 * @since 2020.1
 */
export interface KMLLink {
  /** Specifies a URL to the resource location. */
  href: string | null;
  /** Specifies a time-based refresh mode (Default: {@link KMLRefreshMode}. */
  refreshMode: KMLRefreshMode;
  /**
   * When {@link KMLLink.refreshMode} is set to {@link KMLRefreshMode.ON_INTERVAL}, this indicates to the number of
   * seconds to wait between refreshes (Default: <code>4.0</code>).
   */
  refreshInterval: number;
  /**
   * Specifies how the link is refreshed when the geographic view changes (Default: {@link KMLViewRefreshMode.NEVER}).
   */
  viewRefreshMode: KMLViewRefreshMode;
  /**
   * When <code>viewRefreshMode</code> is set to {@link KMLViewRefreshMode.ON_STOP}, this value specifies the number
   * of seconds to wait after camera movement stops before the geographic view is refreshed (Default: <code>4.0</code>).
   */
  viewRefreshTime: number;
  /**
   * Scales bounding-box parameters, where a value greater than 1 specifies a larger geographic area than the current
   * view, a value less than 1 specifies a smaller geographic area, and 1 specifies the current geographic area
   * (Default: <code>1.0</code>).
   */
  viewBoundScale: number;
  /**
   * Specifies the format of a query string related to view parameters that is appended to the {@link KMLLink.href}
   * before the resource is fetched. The following query parameters may be used:
   *
   * <ul>
   *   <li><code>[lookatLon]</code> and <code>[lookatLat]</code> are replaced with the <code>LookAt</code>'s
   *   <code>longitude</code> and <code>latitude</code> values.</li>
   *   <li><code>[lookatRange]</code>, <code>[lookatTilt]</code>, and <code>[lookatHeading]</code> are replaced with
   *   the <code>LookAt</code>'s <code>range</code>, <code>tilt</code>, and <code>heading</code> values.</li>
   *   <li><code>[lookatTerrainLon]</code>, <code>[lookatTerrainLat]</code>, and <code>[lookatTerrainAlt]</code> are
   *   replaced with the point on the terrain (in decimal degrees/meters) that <code>LookAt</code> is viewing.</li>
   *   <li><code>[cameraLon]</code>, <code>[cameraLat]</code>, and <code>[cameraAlt]</code> are replaced with the
   *   decimal degrees/meters of the eyepoint for the camera.</li>
   *   <li><code>[horizFov]</code> and <code>[vertFov]</code> are replaced with the camera's horizontal and vertical
   *   fields of view.</li>
   *   <li><code>[horizPixels]</code> and <code>[vertPixels]</code> are replaced with the size (in pixels) of the
   *   geographic view.</li>
   *   <li><code>[terrainEnabled]</code> is replaced with a <code>1</code> or <code>0</code> (indicating
   *   <code>true</code> or <code>false</code>, respectively) to show whether the map is rendering terrain.</li>
   *   <li><code>[bboxWest]</code>, <code>[bboxSouth]</code>, <code>[bboxEast]</code>, and <code>[bboxNorth]</code> are
   *   replaced with bounding box limits matching the OGC Web Map Service (WMS) bounding box specification.<li>
   * </ul>
   */
  viewFormat: string | null;
  /**
   * Specifies any additional query parameters not related to the geographic view.
   *
   * <ul>
   *   <li><code>[clientVersion]</code> is replaced with the version of the client.</li>
   *   <li><code>[kmlVersion]</code> is replaced with the version of the requested KML.</li>
   *   <li><code>[clientName]</code> is replaced with the name of the client.</li>
   *   <li><code>[language]</code> is replaced with the language preference of the client.</li>
   * </ul>
   */
  httpQuery: string | null;
}