import { union } from "@jscad/modeling/src/operations/booleans";
import { floor } from "./floor.ts";
import { translateZ } from "@jscad/modeling/src/operations/transforms";
import { positionedLabel } from "./label.ts";

import { Label } from "../../app/types/label.ts";
import { sweepRounded } from "../utils/sweepRounded.ts";
import { polygon } from "@jscad/modeling/src/primitives";

export type BoxGeomProps = {
  width?: number;
  depth?: number;
  height?: number;
  size?: number;
  labels?: Label[];
  profileFillet?: number;
};

export function box({
  width = 1,
  depth = 1,
  height = 1,
  labels = [],
}: BoxGeomProps = {}) {
  /**
   * TODO:
   * - [ ] Magnet holes
   * - [ ] Screw hole
   * - [ ] Fix floor fillet size
   * - [ ] Lip
   */

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

  return union(
    floor({ width, depth }),
    ...processedLabels,
    translateZ(
      baseHeight,
      sweepRounded(
        polygon({
          points,
        }),
        [width * 42 - 0.5, depth * 42 - 0.5],
        3.75,
      ),
    ),
  );
}
