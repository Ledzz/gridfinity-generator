import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import {
  rotate,
  translate,
  translateZ,
} from "@jscad/modeling/src/operations/transforms";
import { positionedLabel } from "./label.ts";

import { Label } from "../../app/gridfinity/types/label.ts";
import { sweepRounded } from "../utils/sweepRounded.ts";
import { circle, polygon, rectangle } from "@jscad/modeling/src/primitives";
import { DEFAULT_QUALITY } from "../constants.ts";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { floor } from "./floor.ts";
import { range } from "../utils/range.ts";
import { Wall } from "../../app/gridfinity/types/wall.ts";
import { Ledge } from "../../app/gridfinity/types/ledge.ts";
import { Scoop } from "../../app/gridfinity/types/scoop.ts";
import { Vec2 } from "@jscad/modeling/src/maths/vec2";

export type BoxGeomProps = {
  width: number;
  depth: number;
  height: number;
  size: number;
  items: (Wall | Label | Ledge | Scoop)[];
  profileFillet: number;
  quality: number;
  hasMagnetHoles: boolean;
};

export function box({
  width = 1,
  depth = 1,
  height = 1,
  items = [],
  quality = DEFAULT_QUALITY,
  hasMagnetHoles = false,
}: Partial<BoxGeomProps> = {}) {
  const processedLabels = items
    .filter((i) => i.type === "label")
    .map((l) => positionedLabel(l, { width, depth, height }))
    .filter(Boolean);

  const baseHeight = 6;
  const h = height * 7;

  const points = [
    [0, 0],
    [0, h - 1.6],
    [-1.9, h - 3.5],
    [-1.9, h - 5.3],
    [-2.6, h - 6],
    [-2.6, h - 6.25],
    [-0.45, h - 8.4],
    [-0.45, 0],
  ] as Vec2[];

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

  return union(
    subtract(floor({ width, depth, quality }), ...magnetHoles),
    ...processedLabels,
    translateZ(
      baseHeight,
      sweepRounded(
        polygon({
          points,
        }),
        [width * 42 - 0.5, depth * 42 - 0.5],
        3.75,
        quality,
      ),
    ),
  );
}
