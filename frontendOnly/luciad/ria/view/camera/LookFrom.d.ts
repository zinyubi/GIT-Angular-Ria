import { Vector3 } from "../../util/Vector3.js";
/**
 * A LookFrom represents the position of a camera.
 *
 * This allows you to reason about the camera in terms of a point that the camera is looking from
 * (ie. the position of the camera itself), together with a yaw (angle from north direction),
 * pitch (angle wrt. horizon) and roll.
 *
 * These properties also have meaning in a 3D cartesian reference, even though such a reference is not georeferenced:
 * The xy-plane takes on the role of the (local) Earth ground plane and the z axis points up.
 *
 * A LookFrom is defined by the following properties:
 * <ul>
 *   <li><b>eye</b>: The point that the camera is looking from, in the camera's worldReference.</li>
 *   <li><b>yaw</b>: The angle wrt. the north direction (aka. "heading"). A value of 0 points the camera towards the North pole.
 *                   The angle increases in clockwise direction.
 *                   For 3D cartesian references, the y-direction serves as the north direction.</li>
 *   <li><b>pitch</b>: The angle wrt. the horizon (aka. "tilt"). A value of 0 points the camera towards the horizon (i.e. horizontally).
 *                     -90 points the camera straight down towards the ground and +90 points the camera straight up, towards the sky.
 *                     For 3D cartesian references, -90 points the camera in the negative z direction and +90 points it in the positive z direction.</li>
 *   <li><b>roll</b>: A rotation around the camera's forward direction (aka "bank"). Negative angles bank the view left; positive angles bank the view right.</li>
 * </ul>
 *
 *
 * ```javascript
 *  // look from high above western Europe, facing the north, with the camera slightly pitched towards the ground
 *  map.camera = map.camera.LookFrom({
 *    eye: {x: 3957174, y: 138187, z: 5034323},
 *    yaw: 0,
 *    pitch: -35,
 *    roll: 0
 *  });
 * ```
 */
export interface LookFrom {
  /**
   * The point that the camera is looking from (the camera's position).
   * The coordinates are defined in the camera's {@link Camera.worldReference worldReference}.
   */
  eye: Vector3;
  /**
   * The angle with respect to the north direction (aka. "heading").
   * A value of 0 points the camera towards the North pole. The angle increases in clockwise direction (90 points east).
   */
  yaw: number;
  /**
   * The angle with respect to the horizon (aka. "tilt").
   * A value of 0 points the camera towards the horizon (i.e. horizontally).
   * -90 points the camera straight down towards the ground and +90 points the camera straight up, towards the sky.
   */
  pitch: number;
  /**
   * A rotation around the camera's forward direction (aka "bank").
   * Negative angles bank the view left; positive angles bank the view right.
   */
  roll: number;
}