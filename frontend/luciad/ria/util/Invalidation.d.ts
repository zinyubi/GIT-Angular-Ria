import { Evented, Handle } from "./Evented.js";
declare abstract class Invalidation implements Evented {
  /**
   * Signals that the underlying data has changed.
   */
  invalidate(): void;
  /**
   * An event indicating that this Controller is invalidated.
   * This event fires when {@link invalidate} is called.
   */
  on(event: "Invalidated", callback: (...args: any[]) => void, context?: any): Handle;
}
export { Invalidation };