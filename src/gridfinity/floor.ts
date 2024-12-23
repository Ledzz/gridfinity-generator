import { union } from "@jscad/modeling/src/operations/booleans";
import { polygon } from "@jscad/modeling/src/primitives";
import { sweepRounded } from "./utils/sweepRounded.ts";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import {
  baseHeight,
  basePoly,
  baseWidth,
  FILLET,
  SIZE,
  TOLERANCE,
} from "./constants.ts";

export function floor() {
  const baseSize = SIZE - baseWidth * 2 - TOLERANCE;

  return union(
    extrudeLinear(
      { height: baseHeight },
      roundedRectangle({ size: [baseSize, baseSize], roundRadius: FILLET }),
    ),
    sweepRounded(
      polygon({
        points: basePoly,
      }),
      baseSize,
      FILLET,
    ),
  );
}
