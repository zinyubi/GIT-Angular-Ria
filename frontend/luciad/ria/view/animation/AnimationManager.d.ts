import { Animation } from "./Animation.js";
/**
 * <p>
 * A global manager for animation playback.
 * </p>
 *
 * <p>
 * Multiple Animation instances can be played back simultaneously.
 * However, each animation must be associated with a particular key.
 * Only one animation can be bound to a single key at the same time,
 * so as to prevent conflicts between animations that try to assign different values to the same parameters of
 * an animated object (e.g. multiple animations that want to modify the camera of the map, cfr. {@link Map.cameraAnimationKey}).
 * </p>
 *
 * <p>
 * This class is a singleton.
 * </p>
 *
 * <p>
 * An animation is started ({@link Animation.onStart Animation.onStart}) when being added to
 * the animation manager ({@link putAnimation}) and
 * stopped ({@link Animation.onStop}) when it has reached the end of its duration,
 * or when it is explicitly removed using {@link removeAnimation}.
 * For looping animations the calls on the animation are repeated, thus {@link Animation.onStart Animation.onStart}
 * will be called each time a new iteration of the animation starts and {@link Animation.onStart Animation.onStop}
 * after the end of the duration of the animation. This will repeat until the animation is explicitly removed
 * using {@link removeAnimation}.
 * </p>
 *
 * <p>
 * Call order for an animation:
 * <ol>
 *   <li> AnimationManager.putAnimation(key, anim)
 *   <li> anim.onStart() (once)
 *   <li> anim.update(time) (multiple times while running)
 *   <li> anim.onStop() (once)
 * </ol>
 * </p>
 */
export declare class AnimationManager {
  private constructor();
  /**
   * Starts the specified animation for the given key. Only one animation can be active for a key at
   * any given time. Therefore, if another animation is already present for the specified key (and
   * it is still running), that animation is first stopped and removed.
   * The Promise returned by `putAnimation` will be rejected with an AbortError (for the animation that was aborted).
   * You should attach a `catch()` handler to the `putAnimation` Promise to avoid "uncaught promise rejection" errors.
   *
   * @param key the object with which to associate the animation
   * @param animation the animation to be played back
   * @param loop if true, the animation will run in a loop, thus it will only end when explicitly removed or replaced.
   * @param abortSignal An AbortSignal that can be used to abort hthe scheduled animation. When aborted, the `putAnimation` promise will be rejected with an AbortError. Make sure to attach a `catch()` handler to the `putAnimation` Promise to avoid "uncaught promise rejection" errors.
   */
  static putAnimation(key: any, animation: Animation, loop: boolean, abortSignal?: AbortSignal): Promise<void>;
  /**
   * Returns the current animation for the passed keys, or undefined if there isn't one. Use this for
   * instance to check if the current animation is yours before removing it.
   *
   * @param key the objects with which to associate the animation
   * @return the current animation for the passed object or undefined.
   */
  static getAnimation(key: any): Animation | undefined;
  /**
   * Stops and removes the animation associated with the specified key, if any.
   *
   * @param key the object from which to remove any currently running animation
   */
  static removeAnimation(key: any): void;
}