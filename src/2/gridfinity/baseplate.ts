import Vec2 from "@jscad/modeling/src/maths/vec2/type";
import { colorize } from "@jscad/modeling/src/colors";
import { union } from "@jscad/modeling/src/operations/booleans";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cuboid, polygon } from "@jscad/modeling/src/primitives";
import { sweepRounded } from "../sweepRounded.ts";

export function baseplate() {
  const basePoly = [
    [0, 0], // Innermost bottom point
    [0.8, 0.8], // Up and out at a 45 degree angle
    [0.8, 0.8 + 1.8], // Straight up
    [0.8 + 2.15, 0.8 + 1.8 + 2.15], // Up and out at a 45 degree angle
    [0, 0.8 + 1.8 + 2.15],
  ] satisfies Vec2[];
  const height = Math.max(...basePoly.map((point) => point[1]));

  return colorize(
    [0.8, 0.8, 0.8],
    union(
      translate([0, height / 2, 0], cuboid({ size: [42, height, 42] })),
      sweepRounded(
        polygon({
          points: basePoly,
        }),
        42,
        0.8,
      ),
    ),
  );
}
