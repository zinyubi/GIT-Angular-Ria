import { OWSCapabilitiesOperationRequest } from "./OWSCapabilitiesOperationRequest.js";
/**
 * Describes a request operation supported by the WFS server. All defined properties are read-only.
 * @since 2019.1
 */
export interface WFSCapabilitiesOperation {
  /**
   * The name of the request operation.
   */
  readonly name: string;
  /**
   * The available output formats for the request operation.
   */
  readonly supportedFormats: string[];
  /**
   * The available HTTP requests for the request operation.
   * @since 2024.0.02
   */
  readonly supportedRequests: OWSCapabilitiesOperationRequest[];
}