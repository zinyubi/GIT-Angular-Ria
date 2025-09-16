import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Bounds } from "../../shape/Bounds.js";
/**
 * Describes a WMS layer style. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMSCapabilitiesLayerStyle {
  /**
   * Name that uniquely identifies the WMS layer style.
   */
  name: string;
  /**
   * Human-readable title of the WMS layer style.
   */
  title: string;
  /**
   * Description of the WMS layer style.
   */
  abstract: string;
  /**
   * Legend graphic of the WMS layer style.
   */
  legend: WMSCapabilitiesImageUrl[];
}
/**
 * Describes an image URL defined in the WMS capabilities. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMSCapabilitiesImageUrl {
  /**
   * Width of the referred image.
   */
  width: number;
  /**
   * Height of the referred image.
   */
  height: number;
  /**
   * Data format of the referred image.
   */
  format: string;
  /**
   * URL of the referred image.
   */
  url: string;
}
/**
 * Describes attribution information for the data in this WMS layer; for example, the name of the data provider.
 * All defined properties are read-only.
 * @since 2019.1
 */
export interface WMSCapabilitiesLayerAttribution {
  /**
   * URL of the WMS layer's data provider.
   */
  url: string | null;
  /**
   * Human-readable title of the WMS layer's data provider.
   */
  title: string | null;
  /**
   * Logo of the WMS layer's data provider.
   */
  logo: WMSCapabilitiesImageUrl | null;
}
/**
 * Describes an online resource defined by a URL and the data format of the URL content. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMSCapabilitiesResourceUrl {
  /**
   * Data format of the online resource.
   */
  format: string;
  /**
   * URL of the online resource.
   */
  url: string;
}
/**
 * Represents a WMS layer dimension. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMSCapabilitiesLayerDimension {
  /**
   * Unique identifier of the WMS layer dimension.
   */
  name: string;
  /**
   * Unit in which the WMS layer dimension values are expressed.
   */
  units: string;
  /**
   * Text content indicating the available values of the WMS layer dimension. This is a comma-separated list
   * of individual values and/or intervals (e.g. 1999-01-01/2000-08-22/P1D).
   */
  extent: string;
  /**
   * Symbol of the unit in which the WMS layer dimension values are expressed.
   */
  unitSymbol: string;
  /**
   * Default value that is used for the WMS layer dimension if the request does not specify a value.
   */
  default: string;
  /**
   * Indicates whether multiple values of the WMS layer dimension may be requested in a single request.
   */
  multipleValues: boolean;
  /**
   * Indicates whether a nearest value is used if there is no exact match between the specified value in a request
   * and the possible values defined in the WMS layer dimension.
   */
  nearestValue: boolean;
  /**
   * Indicates whether temporal data are normally kept current and that the request parameter TIME may include
   * the keyword “current” instead of an ending value. This only applies to temporal dimensions.
   */
  current: boolean;
}
/**
 * Describes a layer offered by a WMS server. All defined properties are read-only.
 * @since 2019.1
 */
export declare class WMSCapabilitiesLayer {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  get parent(): WMSCapabilitiesLayer | null;
  /**
   * Minimum scale denominator for which it is appropriate to display this layer.
   */
  get minScaleDenominator(): number | string;
  /**
   * Maximum scale denominator for which it is appropriate to display this layer.
   */
  get maxScaleDenominator(): number | string;
  /**
   * Link to the list of the features represented in the WMS layer.
   */
  get featureListUrl(): WMSCapabilitiesResourceUrl;
  /**
   * Link to the underlying data represented by the WMS layer.
   */
  get dataUrl(): WMSCapabilitiesResourceUrl;
  /**
   * List of dimensions defined for the WMS layer.
   */
  get dimensions(): WMSCapabilitiesLayerDimension[];
  /**
   * List of supported geographical references of the WMS layer.
   */
  get supportedReferences(): string[];
  /**
   * Indicates whether the server supports the GetFeatureInfo operation on the layer.
   */
  get queryable(): boolean;
  /**
   * Indicates how many times the layer has been "cascaded" - obtained from an originating server and then included in the
   * service metadata of a different server.
   */
  get cascaded(): number;
  /**
   * Indicates whether the WMS layer represents opaque data.
   */
  get opaque(): boolean;
  /**
   * Indicates whether the WMS server can only return maps for the entire bounding box of the WMS layer.
   */
  get noSubsets(): boolean;
  /**
   * If the value is 0, the WMS server can produce maps of arbitrary width.
   * Otherwise, the value indicates a fixed map width that is used by the WMS server.
   */
  get fixedWidth(): number;
  /**
   * If the value is 0, the WMS can produce map of arbitrary height.
   * Otherwise, the value indicates a fixed map height that is used by the WMS server.
   */
  get fixedHeight(): number;
  /**
   * Description of the WMS layer.
   */
  get abstract(): string;
  /**
   * List of keywords that describe the WMS layer.
   */
  get keywords(): string[];
  /**
   * Attribution information for the WMS layer.
   */
  get attribution(): WMSCapabilitiesLayerAttribution | null;
  /**
   * Metadata of the WMS layer.
   */
  get metadata(): WMSCapabilitiesResourceUrl[];
  /**
   * List of the child layers of the WMS layer.
   */
  get children(): WMSCapabilitiesLayer[];
  /**
   * Human-readable title of the WMS layer.
   */
  get title(): string;
  /**
   * Name that uniquely defines the WMS layer.
   */
  get name(): string;
  /**
   * List of the available WMS layer styles.
   */
  get styles(): WMSCapabilitiesLayerStyle[];
  /**
   * Returns the bounding box of this layer defined in the given reference. If the bounding box defined in this reference is not explicitly listed in the capabilities,
   * the first encountered bounding box defined in a supported reference (i.e., supported in {@link ReferenceProvider}
   * is used and transformed to the given reference. If no bounding box information in a supported reference can be found, null is returned.
   * @param  reference the geographic reference in which the returned bounds needs to be defined
   * @return the bounds
   */
  getBounds(reference: CoordinateReference): Bounds | null;
}