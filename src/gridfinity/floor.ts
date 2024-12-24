import { union } from "@jscad/modeling/src/operations/booleans";
import { polygon } from "@jscad/modeling/src/primitives";
import { sweepRounded } from "./utils/sweepRounded.ts";
import { FILLET, SIZE, TOLERANCE } from "./constants.ts";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";

export function floor() {
  const points = [
    [0, 0], // Innermost bottom point
    [0.8, 0.8], // Up and out at a 45 degree angle
    [0.8, 2.6], // Straight up
    [2.95, 4.75], // Up and out at a 45 degree angle
    [2.95, 5], // Up and out at a 45 degree angle
    [2.95, 6], // Up and out at a 45 degree angle
    [0, 6],
  ];
  const baseWidth = Math.max(...points.map((point) => point[0]));
  const baseHeight = Math.max(...points.map((point) => point[1]));
  const baseSize = SIZE - baseWidth * 2 - TOLERANCE;
  return union(
    extrudeLinear(
      { height: baseHeight },
      roundedRectangle({ size: [baseSize, baseSize], roundRadius: FILLET }),
    ),
    sweepRounded(
      polygon({
        points,
      }),
      35.6,
      FILLET,
    ),
  );
}
