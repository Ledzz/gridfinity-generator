import Vec2 from "@jscad/modeling/src/maths/vec2/type";
import { union } from "@jscad/modeling/src/operations/booleans";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { polygon } from "@jscad/modeling/src/primitives";
import { sweepRounded } from "../sweepRounded.ts";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";

export function baseplate({ size = 42, fillet = 0.8, tolerance = 0.5 } = {}) {
  const basePoly = [
    [0, 0], // Innermost bottom point
    [0.8, 0.8], // Up and out at a 45 degree angle
    [0.8, 0.8 + 1.8], // Straight up
    [0.8 + 2.15, 0.8 + 1.8 + 2.15], // Up and out at a 45 degree angle
    [0, 0.8 + 1.8 + 2.15],
  ] satisfies Vec2[];
  const width = Math.max(...basePoly.map((point) => point[0]));
  const height = Math.max(...basePoly.map((point) => point[1]));
  const baseSize = size - width * 2 - tolerance;

  return union(
    translate(
      [0, height, 0],
      rotate(
        [Math.PI / 2, 0, 0],
        extrudeLinear(
          { height },
          roundedRectangle({ size: [baseSize, baseSize], roundRadius: fillet }),
        ),
      ),
    ),
    sweepRounded(
      polygon({
        points: basePoly,
      }),
      baseSize,
      fillet,
    ),
  );
}
