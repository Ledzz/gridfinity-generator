import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { circle, polygon, rectangle } from "@jscad/modeling/src/primitives";
import { sweepRounded } from "../utils/sweepRounded.ts";
import { FILLET, SIZE, TOLERANCE } from "../constants.ts";
import {
  rotate,
  translate,
  translateZ,
} from "@jscad/modeling/src/operations/transforms";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import { Vec2 } from "@jscad/modeling/src/maths/vec2";
import { BoxGeomProps } from "./box.ts";
import { mapReduce2D, range } from "../utils/range.ts";

const points = [
  [0, 0], // Innermost bottom point
  [0.8, 0.8], // Up and out at a 45 degree angle
  [0.8, 2.6], // Straight up
  [2.95, 4.75], // Up and out at a 45 degree angle
  [2.95, 5], // Up and out at a 45 degree angle
  [0, 5],
] as Vec2[];

export function floor({
  width,
  depth,
  quality,
  hasMagnetHoles,
}: Pick<BoxGeomProps, "quality" | "width" | "depth" | "hasMagnetHoles">) {
  const baseWidth = Math.max(...points.map((point) => point[0]));
  const baseHeight = Math.max(...points.map((point) => point[1]));
  const baseSize = SIZE - baseWidth * 2 - TOLERANCE;

  const r = 5.86 / 2;

  const magnetHoles = hasMagnetHoles
    ? range(4).map((i) =>
        rotate(
          [0, 0, (i * Math.PI) / 2],
          translate(
            [6.07, 13, 0],
            extrudeLinear(
              { height: 2.25 },
              union(
                circle({ radius: 1.25 }),
                rectangle({ center: [4.28 / 2, 0], size: [4.28, 2.5] }),
              ),
            ),
          ),
          translate(
            [13, 13, 0.35],
            extrudeLinear(
              { height: 1.9 },
              union(
                circle({ radius: r }),
                polygon({
                  points: [
                    [5.6, r],
                    [0, r],
                    [0, -r],
                    [3.5, -r],
                    [3.5 + 2.1, -r - 1.47],
                  ],
                }),
              ),
            ),
          ),
        ),
      )
    : [];

  const items = mapReduce2D(width, depth, (i, j) =>
    translate(
      [(i + 0.5 - width / 2) * SIZE, (j + 0.5 - depth / 2) * SIZE, 0],
      subtract(
        union(
          extrudeLinear(
            { height: baseHeight },
            roundedRectangle({
              size: [baseSize, baseSize],
              roundRadius: FILLET,
              segments: quality,
            }),
          ),
          sweepRounded(
            polygon({
              points,
            }),
            35.6,
            FILLET,
            quality,
          ),
        ),
        magnetHoles,
      ),
    ),
  );

  return union(
    ...items,
    translateZ(
      baseHeight,
      extrudeLinear(
        { height: 1 },
        roundedRectangle({
          size: [width * SIZE - TOLERANCE, depth * SIZE - TOLERANCE],
          roundRadius: FILLET + baseWidth,
          segments: quality,
        }),
      ),
    ),
  );
}
