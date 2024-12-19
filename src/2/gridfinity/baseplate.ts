import Vec2 from "@jscad/modeling/src/maths/vec2/type";
import { union } from "@jscad/modeling/src/operations/booleans";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cuboid, polygon } from "@jscad/modeling/src/primitives";
import { sweepRounded } from "../sweepRounded.ts";

export function baseplate({ size = 42, fillet = 0.8 } = {}) {
  const basePoly = [
    [0, 0], // Innermost bottom point
    [0.8, 0.8], // Up and out at a 45 degree angle
    [0.8, 0.8 + 1.8], // Straight up
    [0.8 + 2.15, 0.8 + 1.8 + 2.15], // Up and out at a 45 degree angle
    [0, 0.8 + 1.8 + 2.15],
  ] satisfies Vec2[];
  const height = Math.max(...basePoly.map((point) => point[1]));

  return union(
    translate([0, height / 2, 0], cuboid({ size: [size, height, size] })),
    sweepRounded(
      polygon({
        points: basePoly,
      }),
      size,
      fillet,
    ),
  );
}
