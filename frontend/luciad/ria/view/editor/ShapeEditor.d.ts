import { CompositeEditor } from "./editors/CompositeEditor.js";
/**
 * The default editor used by the {@link CreateController}.
 *
 * It is nothing more than a `CompositeEditor` that combines all the shape editors in LuciadRIA:
 *
 *  ```javascript
 * [[include:view/editor/ShapeEditorSnippets.ts_SHAPE_EDITOR]]
 * ```
 * This code snippet can be used to create a custom list of default shape editors.
 *
 * @since 2022.1
 */
export declare class ShapeEditor extends CompositeEditor {
  constructor();
}