/**
 * Handle that is returned when registering a callback with {@link Evented.on}.
 * The {@link remove} function can be used to unregister the callback function.
 */
export interface Handle {
  remove: () => void;
}
/**
 * An interface allows to register listeners for objects that emit events.
 * If you have a custom class that emits events, you may want to consider using <code>Evented</code> with {@link EventedSupport}.
 *
 */
export interface Evented {
  /**
   * Registers a callback function for a given event type.
   *
   * @param event the event type to register on
   * @param callback the callback function to register
   * @param context the context in which the callback function should be invoked
   * implementation dependent.
   * @return a handle to the registered callback with a single function 'remove'. This function can be used to
   *          unregister the callback function.
   */
  on(event: string, callback: (...args: any[]) => void, context?: any): Handle;
}