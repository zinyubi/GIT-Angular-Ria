import { Feature, FeatureId } from "./Feature.js";
/**
 * The type describing a function that provides an ID for the given feature.
 * A custom implementation of this function is used in {@link GeoJsonCodec}.
 * When this function returns null then the codec will use the default ID generator for the given feature.
 *
 * @since 2021.0
 */
export type FeatureIDProvider = (feature: Feature) => FeatureId;