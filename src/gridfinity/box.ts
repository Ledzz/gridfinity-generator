import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { floor } from "./floor.ts";
import {
  translate,
  translateZ,
} from "@jscad/modeling/src/operations/transforms";
import RecursiveArray from "@jscad/modeling/src/utils/recursiveArray";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import { roundedCuboid } from "@jscad/modeling/src/primitives";
import {
  baseHeight,
  PROFILE_FILLET,
  SIZE,
  WALL_THICKNESS,
} from "./constants.ts";
import { positionedLabel } from "./label.ts";

import { Label } from "../app/types/label.ts";

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
  const innerFillet =
    PROFILE_FILLET > WALL_THICKNESS ? PROFILE_FILLET - WALL_THICKNESS : 0;
  const items: RecursiveArray<Geom3> = [];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      items.push(
        translate(
          [(i + 0.5 - width / 2) * SIZE, (j + 0.5 - depth / 2) * SIZE, 0],
          floor(),
        ),
      );
    }
  }

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

  return union(
    ...items,
    ...processedLabels,
    translateZ(
      baseHeight,
      subtract(
        extrudeLinear(
          { height: height * 7 },
          roundedRectangle({
            size: [width * SIZE, depth * SIZE],
            roundRadius: PROFILE_FILLET,
          }),
        ),
        // TODO: Floor fillet should not be equal wall fillet
        roundedCuboid({
          size: [
            width * SIZE - WALL_THICKNESS * 2,
            depth * SIZE - WALL_THICKNESS * 2,
            height * 7 - WALL_THICKNESS + innerFillet * 2,
          ],
          center: [0, 0, (height * 7) / 2 + innerFillet + WALL_THICKNESS],
          roundRadius: innerFillet,
        }),
      ),
    ),
  );
}
