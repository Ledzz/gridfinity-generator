import { union } from "@jscad/modeling/src/operations/booleans";
import { polygon } from "@jscad/modeling/src/primitives";
import { sweepRounded } from "../utils/sweepRounded.ts";
import { FILLET, QUALITY, SIZE, TOLERANCE } from "../constants.ts";
import RecursiveArray from "@jscad/modeling/src/utils/recursiveArray";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import {
  translate,
  translateZ,
} from "@jscad/modeling/src/operations/transforms";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";

export function floor({ width, depth }) {
  const points = [
    [0, 0], // Innermost bottom point
    [0.8, 0.8], // Up and out at a 45 degree angle
    [0.8, 2.6], // Straight up
    [2.95, 4.75], // Up and out at a 45 degree angle
    [2.95, 5], // Up and out at a 45 degree angle
    [0, 5],
  ];
  const baseWidth = Math.max(...points.map((point) => point[0]));
  const baseHeight = Math.max(...points.map((point) => point[1]));
  const baseSize = SIZE - baseWidth * 2 - TOLERANCE;
  const items: RecursiveArray<Geom3> = [];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      items.push(
        translate(
          [(i + 0.5 - width / 2) * SIZE, (j + 0.5 - depth / 2) * SIZE, 0],
          extrudeLinear(
            { height: baseHeight },
            roundedRectangle({
              size: [baseSize, baseSize],
              roundRadius: FILLET,
              segments: QUALITY,
            }),
          ),
          sweepRounded(
            polygon({
              points,
            }),
            35.6,
            FILLET,
          ),
        ),
      );
    }
  }

  return union(
    ...items,
    translateZ(
      baseHeight,
      extrudeLinear(
        { height: 1 },
        roundedRectangle({
          size: [width * SIZE - TOLERANCE, depth * SIZE - TOLERANCE],
          roundRadius: FILLET + baseWidth,
          segments: QUALITY,
        }),
      ),
    ),
  );
}
