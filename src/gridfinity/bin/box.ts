import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { floor } from "./floor.ts";
import {
  translate,
  translateZ,
} from "@jscad/modeling/src/operations/transforms";
import { positionedLabel } from "./label.ts";

import { Label } from "../../app/gridfinity/types/label.ts";
import { sweepRounded } from "../utils/sweepRounded.ts";
import { circle, polygon } from "@jscad/modeling/src/primitives";
import { DEFAULT_QUALITY } from "../constants.ts";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";

export type BoxGeomProps = {
  width?: number;
  depth?: number;
  height?: number;
  size?: number;
  labels?: Label[];
  profileFillet?: number;
  quality?: number;
};

export function box({
  width = 1,
  depth = 1,
  height = 1,
  labels = [],
  quality = DEFAULT_QUALITY,
}: BoxGeomProps = {}) {
  const processedLabels = labels
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
  ];

  const r = 5.86 / 2;

  return union(
    subtract(
      floor({ width, depth, quality }),
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
