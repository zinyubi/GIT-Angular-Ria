import { Point } from "../../../../shape/Point.js";
import { PanoramaContext } from "../../../../model/tileset/PanoramaContext.js";
export interface PanoramaDrawItemMetadata {
  location: Point;
  context: PanoramaContext;
  panoId: number;
}