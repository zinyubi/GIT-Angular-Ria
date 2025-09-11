/**
 * Enumeration representing the possible request encoding values supported by a WMTS server.
 *
 * @since 2024.1
 */
export declare enum WMTSRequestEncoding {
  /**
   * This is the most common encoding used for WMTS requests.
   * The WMTS requests in this encoding are made through URLs.
   * The parameters are passed as key-value pairs in the query string of the URL.
   * These parameters explicitly define the requested tile matrix, layer, format, and so on.
   * You may select <code>KVP</code> over <code>REST</code> if your goal is:
   * <ul>
   *   <li><b>Simplicity</b>: KVP encoding is straightforward,
   *   making it a good choice for simple applications or for users who are new to WMTS.</li>
   *   <li><b>Compatibility</b>: KVP is widely supported by many servers, ensuring broad compatibility.</li>
   * </ul>
   *
   */
  KVP = "KVP",
  /**
   * This encoding is more concise than <code>KVP</code>.
   * The WMTS requests in this type of encoding rely on a simpler,
   * hierarchical URL structure. Parameters like the tile matrix, layer, and
   * format are encoded directly into the URL path instead of using key-value pairs.
   * You may select <code>REST</code> over <code>KVP</code> if your goal is:
   * <ul>
   *   <li><b>Readability</b>: RESTful URLs are often more readable and can be more intuitive, representing the resource hierarchy clearly.</li>
   * </ul>
   *
   */
  REST = "REST",
}