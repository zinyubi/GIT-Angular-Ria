import { KMLFeature, KMLFeatureProperties } from "./KMLFeature.js";
import { KMLLink } from "./KMLLink.js";
/**
 * Contains all of the information about a KML NetworkLink element. This information can then be used to create a
 * new network-linked {@link KMLLayer}
 *
 * @since 2020.1
 */
export declare class KMLNetworkLinkFeature extends KMLFeature<KMLNetworkLinkProperties> {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  get shape(): null;
  copy(): KMLNetworkLinkFeature;
}
/**
 * @since 2020.1
 */
export interface KMLNetworkLinkProperties extends KMLFeatureProperties {
  /**
   * Specifies whether to recenter the viewport on the network link when it refreshes (Default: <code>false</code>).
   *
   * <p>If <code>true</code>, then the view should recenter to the <code>LookAt</code> or <code>Camera</code> entities
   * in the <code>NetworkLinkControl</code> element (if it exists). If these elements do not exist within the
   * <code>NetworkLink</code> element, then they should be pulled from the KML file the NetworkLink references.</p>
   */
  flyToView: boolean;
  /**
   * Specifies whether the visibility of features within the network link should be exposed to the client
   * (Default: <code>false</code>).
   *
   * <p>If <code>true</code>, then the visibility of each feature should be reset whenever the network link is
   * refreshed. If <code>false</code>, then the client application should remember the visibility of the child
   * features between refreshes.</p>
   */
  refreshVisibility: boolean;
  /**
   * Specifies the location of the resource fetched by this network link.
   */
  link: KMLLink;
}