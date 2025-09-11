import { Evented, Handle } from "./Evented.js";
/**
 * A utility class for objects that emit events and allow listeners to be registered on them.
 *
 * <p>
 *   <code>EventedSupport</code> can be used in a prototype chain of a class to wire in the event notification system.
 *   For example, you can create a custom implementation of {@link Store} interface
 *   in order to be able to emit store specific events.
 * </p>
 */
export declare class EventedSupport implements Evented {
  /**
   * Constructs the utility that allows to emit events and register event handlers.
   *
   * @param supportedEvents event names that the are expected to be emitted
   * @param strictMode if 'true' any attempt to register a handler that is not on the <code>supportedEvents</code> list
   *        will throw an error.
   */
  constructor(supportedEvents?: string[], strictMode?: boolean);
  on(event: string, callback: (...args: any[]) => void, context?: any): Handle;
  /**
   * Emits an event. Calling this method will cause all registered callbacks for the given event
   * type to be invoked. Any additional parameters that are passed to this function will be passed
   * as arguments to the callback functions.
   *
   * @param event the event type to emit
   * @param args additional parameters that describe the emitted event
   */
  emit(event: string, ...args: any[]): void;
  /**
   * Registers a callback function on the specified target object for a given event type.
   *
   * @param target the target object
   * @param event the event type to register on
   * @param callback the callback function to register
   * @param context the context in which the callback function should be invoked
   * implementation dependent.
   * @return a handle to the registered callback with a single function 'remove'. This function can be used to
   *          unregister the callback function.
   */
  static on(target: Evented, event: string, callback: () => void, context?: any): Handle;
  /**
   * Registers a callback function on the specified target object for a given event type. This function behaves
   * identical to 'on' with the exception that the registered callback function will be automatically removed when it
   * has been triggered one time.
   *
   * @param target the target object
   * @param event the event type to register on
   * @param callback the callback function to register
   * @param context the context in which the callback function should be invoked
   * implementation dependent.
   * @return a handle to the registered callback with a single function 'remove'. This function can be used to
   *          unregister the callback function.
   */
  static once(target: Evented, event: string, callback: () => void, context?: any): Handle;
}