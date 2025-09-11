/**
 * Describe LTS service metadata. All defined properties are read-only.
 * @since 2019.1
 **/
export interface LTSCapabilitiesService {
  /**
   * Unique identifier of the LuciadFusion LTS server.
   **/
  id: string;
  /**
   * Human-readable name of the LuciadFusion LTS server.
   **/
  name: string;
  /**
   * Description of the LuciadFusion LTS server.
   **/
  abstract: string;
  /**
   * List of keywords that describe the LuciadFusion LTS server.
   **/
  keywords: string[];
}