/**
 * <p>
 *  An animation that can be run using the {@link AnimationManager}.
 * </p>
 *
 * Subclasses need to implement {@link update}.
 * Subclasses may override {@link onStart} and {@link onStop} to perform initialization and cleanup.
 */
declare class Animation {
  /**
   * Creates a new Animation
   *
   * @param duration The duration of the animation in milliseconds. Must be a strictly positive Number.
   *                          When omitted, defaults to 1000. See {@link duration}
   */
  constructor(duration: number);
  /**
   * Returns the duration of this animation in milliseconds.
   * The duration of this animation should be a strictly positive finite value.
   *
   */
  get duration(): number;
  set duration(duration: number);
  /**
   * Called by {@link AnimationManager} when this animation is added
   * to the manager and needs to starts playing.
   *
   * Can be overridden by Animation implementations (no need to call parent implementation).
   *
   * You can use this to perform initialization.
   *
   */
  onStart(): void;
  /**
   * Called by {@link AnimationManager} when this animation is removed from
   * the manager and needs to stops playing.
   *
   * Can be overridden by Animation implementations (no need to call parent implementation).
   *
   * You can use this to perform cleanup.
   */
  onStop(): void;
  /**
   * Updates the animation to a new time.
   * Must be overridden by Animation implementations (no need to call parent implementation).
   *
   * @param fraction the current fraction of the animation. A fraction of 0 indicates the start of the animation,
   * while a fraction of 1 indicates the end of the animation.
   */
  update(fraction: number): void;
}
export { Animation };