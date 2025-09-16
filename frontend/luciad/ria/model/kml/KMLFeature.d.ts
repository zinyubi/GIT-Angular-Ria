import { Shape } from "../../shape/Shape.js";
import { Feature, FeatureProperties } from "../feature/Feature.js";
/**
 * KML Features are abstract elements that are used as the base for concrete KML types, but should not be created directly.
 * @typeParam TProperties Represents the type of feature's properties. Default type {@link KMLFeatureProperties}
 *
 * 
 * @since 2020.1
 */
export declare abstract class KMLFeature<TProperties extends KMLFeatureProperties = KMLFeatureProperties> extends Feature<Shape | null, TProperties> {
  /**
   * This abstract class should not be extended by users of LuciadRIA.
   */
  constructor();
  /**
   * The properties that were passed to the constructor.
   */
  get properties(): TProperties;
  abstract copy(): KMLFeature<TProperties>;
}
/**
 * Provides type-hinting to consumers of the KML Feature.
 * @since 2020.1
 */
export interface KMLFeatureProperties extends FeatureProperties {
  /**
   * User-defined label for the entity.
   */
  name: string | null;
  /**
   * Whether the element should be visible on the Map. This is often represented in a list using a checkbox.
   * If `visibility` is set to `false`, the {@link KMLPainter} will not draw the KML feature on the map.
   */
  visibility: boolean;
  /**
   * A plain-text address that corresponds to the feature.
   */
  address: string | null;
  /**
   * A phone number that corresponds to the feature.
   */
  phoneNumber: string | null;
  /**
   * The snippet that is often displayed in a tree or other UI panel.
   */
  snippet: KMLSnippet | null;
  /**
   * The long-form description that should appear in a balloon or information panel.
   */
  description: string | null;
  /**
   * Specifies whether the feature should be expanded or collapsed in the UI panel.
   */
  open: boolean;
  /**
   * A moment in time corresponding to the feature. The value may be formatted as any of the following XML types:
   * `dateTime`, `date`, `gYearMonth`, `gYear`.
   * See [ISO 8601 formats](https://www.w3.org/TR/xmlschema-2/#isoformats) for details.
   * @since 2021.0
   */
  timeStamp: string | null;
  /**
   * A span of time corresponding to the feature.
   * @since 2021.0
   */
  timeSpan: KMLTimeSpan | null;
  /**
   * Any error messages generated while parsing the feature.
   * @since 2021.0
   */
  errorMessages: string[] | null;
}
/**
 * The snippet that is often displayed in a tree or other UI panel.
 * @since 2020.1
 */
export interface KMLSnippet {
  /**
   * The maximum number of lines that the snippet should occupy, vertically, in a UI panel.
   */
  maxLines: number;
  /**
   * The text that should be displayed in the UI panel.
   */
  text: string | null;
}
/**
 * A period of time bounded by a beginning and/or end time.
 * @since 2021.0
 */
export interface KMLTimeSpan {
  /**
   * The starting bound of the time span. If null the span is unbounded in the past. The value may be formatted as any
   * of the following XML types: dateTime, date, gYearMonth, gYear. See https://www.w3.org/TR/xmlschema-2/#isoformats
   * for details.
   */
  begin: string | null;
  /**
   * The ending bound of the time span. If null the span is unbounded in the future. The value may be formatted as any
   * of the following XML types: dateTime, date, gYearMonth, gYear. See https://www.w3.org/TR/xmlschema-2/#isoformats
   * for details.
   */
  end: string | null;
}