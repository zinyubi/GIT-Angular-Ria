/**
 * This describes the general interface for a Label style object.
 * <p/>
 * A Label style is a simple javascript object literal containing labeling properties. All properties are optional.
 * <p/>
 * A label style defines where a label should be placed on the map.
 * See the Labeling Sample for a demonstration of how to use this API.
 * <p/>
 * By default, all labels will be painted in a non-overlapping way.
 * This is called decluttered labeling. Decluttered labeling prevents
 * labels from being painted on top of each other and making the
 * text unreadable. To define how and where a label should be placed on the map,
 * three properties are important: priority, group and position.
 * <p/>
 * The priority describes how important it is that this label is drawn. Labels
 * with a high priority have a higher chance of being painted on the map. When
 * drawing hundreds of cities on a map for example, you could use the population
 * for every city as the label priority. This will ensure that only the names of
 * big cities are shown when all cities are in view.
 * <p/>
 * The group name can be used to create a distinction between labels that have a
 * different semantic meaning. Labels that are painted within the same group will
 * be decluttered while labels across different groups will not. This allows you to have
 * different groups of decluttered labels. The only exception to this is when using the
 * "NON_DECLUTTERED" constant as the group name.
 * When using this group name, all labels inside this group will be painted on top of each
 * other and labels inside this group will not be decluttered.
 * <p/>
 * The position property describes the different positions where a label can be placed.
 * If label cannot be placed at a certain position, a different position will be tried. When painting a
 * label around a point for example, you can choose to position the label on the north or south
 * side of the point. Every position is expressed as a constant value (integer). To allow multiple
 * positions, simply combine these values using a bitwise OR.
 * <p/>
 * Different actions are required when painting a label around a point, on a line or inside a polygon.
 * <p/>
 * To draw a label around a point, use a {@link LabelCanvas}.
 * <p/>
 * To draw a label on a line, use a {@link LabelCanvas}
 * <p/>
 * To draw a label inside a polygon, create a new {@link LabelCanvas} method to paint the label inside the polygon.
 * <p/>
 * Example:
 *
 * ```javascript
 * [[include:view/style/LabelStyleSnippets.ts_PATH_LABEL_STYLE]]
 * ```
 */
export interface LabelStyle {
  /**
   * The group name for this label style. This can be a
   * custom name or the predefined constant: "NON_DECLUTTERED".
   *
   * Labels that are painted with the same group name will automatically
   * be decluttered, labels across different groups will not. The only
   * exception to this is "NON_DECLUTTERED". When using this group, all labels inside
   * this group will be painted without label decluttering.  This parameter is optional.
   * The default value is "DEFAULT". In practice, this
   * means that - if no group is specified - all labels will be decluttered in the same group.
   */
  group?: number | string;
  /**
   * The amount of padding that should be added around the label. This value
   * describes the amount in pixels by which the labels extent should grow for the decluttering purpose.
   * A negative number will be ignored. This parameter is optional. The default is no padding.
   */
  padding?: number;
  /**
   * Priority for this label style. A lower number means that the label will have a higher probability of
   * being painted. If you do not explicitly assign a priority, the default priority of 0 is applied. The priority can
   * be a negative number if you want to indicate that a label has a higher priority than the default.
   */
  priority?: number;
}