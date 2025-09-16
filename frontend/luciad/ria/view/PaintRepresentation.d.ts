/**
 * An enumeration describing PaintRepresentations. PaintRepresentations indicate the different visual representations of a model object.
 */
export declare enum PaintRepresentation {
  /**
   * "BODY" PaintRepresentation. This is the default representation of a model object.
   */
  BODY = "BODY",
  /**
   * "LABEL" PaintRepresentation. This is the label representation of a model object.
   */
  LABEL = "LABEL",
  /**
   * "BOTTOM_BORDER_BODY" PaintRepresentation. This is the default representation of a model object
   * in the bottom border of the vertical map.
   */
  BOTTOM_BORDER_BODY = "BOTTOM_BORDER_BODY",
  /**
   * "BOTTOM_BORDER_LABEL" PaintRepresentation. This is the label representation of a model object
   * in the bottom border of the vertical map.
   */
  BOTTOM_BORDER_LABEL = "BOTTOM_BORDER_LABEL",
  /**
   * "LEFT_BORDER_BODY" PaintRepresentation. This is the default representation of a model object
   * in the left border of the vertical map.
   * Newly created layers {@link Layer} have this paint representation disabled by default.
   */
  LEFT_BORDER_BODY = "LEFT_BORDER_BODY",
  /**
   * "LEFT_BORDER_LABEL" PaintRepresentation. This is the label representation of a model object
   * in the left border of the vertical map.
   * Newly created layers {@link Layer} have this paint representation disabled by default.
   */
  LEFT_BORDER_LABEL = "LEFT_BORDER_LABEL",
  /**
   * "BORDER_BODY" PaintRepresentation.
   * @deprecated Use {@link BOTTOM_BORDER_BODY} instead.
   */
  BORDER_BODY = "BORDER_BODY",
  /**
   * "BORDER_LABEL" PaintRepresentation.
   * @deprecated Use {@link BOTTOM_BORDER_LABEL} instead.
   */
  BORDER_LABEL = "BORDER_LABEL",
}