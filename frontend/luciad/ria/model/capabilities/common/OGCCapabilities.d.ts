/**
 * Represents a contact address for an OGC server.
 * @since 2019.1
 **/
export interface OGCCapabilitiesContactAddress {
  /**
   * Address line for the location.
   **/
  address: string;
  /**
   * City of the location.
   **/
  city: string;
  /**
   * State or province of the location.
   **/
  stateOrProvince: string;
  /**
   * ZIP or other postal code.
   **/
  postCode: string;
  /**
   * Country of the location.
   **/
  country: string;
}
/**
 * Information about a contact person for the service.
 * @since 2019.1
 **/
export interface OGCCapabilitiesContactInformation {
  /**
   * Information about the primary contact person.
   **/
  primaryPerson: OGCCapabilitiesPrimaryPerson;
  /**
   * The position of the contact person.
   **/
  position: string;
  /**
   * The address of the contact person.
   **/
  address: OGCCapabilitiesContactAddress;
  /**
   * The telephone number of the contact person.
   **/
  telephone: string;
  /**
   * The fax number of the contact person.
   **/
  fax: string;
  /**
   * The email address of the contact person.
   **/
  email: string;
}
/**
 * Information about the primary contact person.
 * @since 2019.1
 **/
export interface OGCCapabilitiesPrimaryPerson {
  /**
   * The name of the primary contact person.
   **/
  person: string;
  /**
   * The organization of the primary contact person.
   **/
  organization: string;
}
/**
 * Contains a set of keywords for discovery of OGC-compliant catalogs.
 * @since 2019.1
 */
export interface OGCCapabilitiesKeywords {
  /**
   * The list of keywords.
   */
  keywords: string[];
  /**
   * The type of keywords.
   */
  type: string | null;
}