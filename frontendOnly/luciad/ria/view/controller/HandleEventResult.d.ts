/**
 * HandleEventResult constants are flags that may be combined using bit-wise Boolean operations.
 * For convenience, a number of helper methods are provided to manage these flags.
 */
declare enum HandleEventResult {
  /**
   * Indicates an event was ignored.  This corresponds to a HandleEventResult value with all flags cleared.
   */
  EVENT_IGNORED = 0,
  /**
   * Flag indicating that the object that returns this value handled the event.
   */
  EVENT_HANDLED = 1,
  /**
   * Flag indicating that the object that returned this value wishes to terminate the current user interaction.
   * This usually means that the controller that was configured on the map will be removed and normal
   * navigation controls will be active again.
   */
  REQUEST_FINISH = 2,
  /**
   * Flag indicating that the object that returned this value wishes to be deactivated.  This is different
   * from the <code>REQUEST_FINISH</code> flag because this flag does not necessarily mean the end of the current
   * user interaction.  For example, in a composite controller solution, a controller may request to be
   * deactivated so other controllers in the composite can be considered to handle subsequent events.
   */
  REQUEST_DEACTIVATION = 4,
}
export declare const EVENT_IGNORED = HandleEventResult.EVENT_IGNORED;
export declare const EVENT_HANDLED = HandleEventResult.EVENT_HANDLED;
export declare const REQUEST_FINISH = HandleEventResult.REQUEST_FINISH;
export declare const REQUEST_DEACTIVATION = HandleEventResult.REQUEST_DEACTIVATION;
/**
 * Sets the <code>REQUEST_DEACTIVATION</code> flag on the given <code>HandleEventResult</code>.
 * @param  aResult
 * @returns
 */
export declare function setRequestDeactivation(aResult: HandleEventResult): HandleEventResult;
/**
 * Verifies if the <code>REQUEST_DEACTIVATION</code> flag is set on the given <code>HandleEventResult</code>.
 * @param  aResult
 * @returns
 */
export declare function isRequestDeactivation(aResult: HandleEventResult): boolean;
/**
 * Clears the <code>REQUEST_DEACTIVATION</code> flag on the given <code>HandleEventResult</code>.
 * @param  aResult
 * @returns
 */
export declare function clearRequestDeactivation(aResult: HandleEventResult): HandleEventResult;
/**
 * Sets the <code>REQUEST_FINISH</code> flag on the given <code>HandleEventResult</code>.
 * @param aResult
 * @returns
 */
export declare function setRequestFinish(aResult: HandleEventResult): HandleEventResult;
/**
 * Verifies if the <code>REQUEST_FINISH</code> flag is set on the given <code>HandleEventResult</code>.
 * @param  aResult
 * @returns
 */
export declare function isRequestFinish(aResult: HandleEventResult): boolean;
/**
 * Clears the <code>REQUEST_FINISH</code> flag on the given <code>HandleEventResult</code>.
 * @param  aResult
 * @returns
 */
export declare function clearRequestFinish(aResult: HandleEventResult): HandleEventResult;
/**
 * Sets the <code>EVENT_HANDLED</code> flag on the given <code>HandleEventResult</code>.
 * @param  aResult
 * @returns
 */
export declare function setHandled(aResult: HandleEventResult): HandleEventResult;
/**
 * Verifies if the <code>EVENT_HANDLED</code> flag is set on the given <code>HandleEventResult</code>.
 * @param  aResult
 * @returns
 */
export declare function isHandled(aResult: HandleEventResult): boolean;
/**
 * Clears the <code>EVENT_HANDLED</code> flag on the given <code>HandleEventResult</code>.
 * @param  aResult
 * @returns
 */
export declare function clearHandled(aResult: HandleEventResult): HandleEventResult;
export { HandleEventResult };