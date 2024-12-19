import { union } from "@jscad/modeling/src/operations/booleans";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { polygon } from "@jscad/modeling/src/primitives";
import { sweepRounded } from "../sweepRounded.ts";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import { baseHeight, basePoly, baseWidth } from "./constants.ts";

export function baseplate({ size = 42, fillet = 0.8, tolerance = 0.5 } = {}) {
  const baseSize = size - baseWidth * 2 - tolerance;

  return union(
    translate(
      [0, baseHeight, 0],
      rotate(
        [Math.PI / 2, 0, 0],
        extrudeLinear(
          { height: baseHeight },
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
