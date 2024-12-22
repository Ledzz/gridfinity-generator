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
import { baseHeight } from "./constants.ts";
import { positionedLabel } from "./label.ts";

import { Label } from "../app/types/label.ts";

export type BoxGeomProps = {
  width?: number;
  depth?: number;
  height?: number;
  size?: number;
  wallThickness?: number;
  labels?: Label[];
  profileFillet?: number;
};

export function box({
  width = 1,
  depth = 1,
  height = 1,
  size = 42,
  wallThickness = 1,
  labels = [],
  profileFillet = 7.5 / 2,
}: BoxGeomProps = {}) {
  const innerFillet =
    profileFillet > wallThickness ? profileFillet - wallThickness : 0;
  const items: RecursiveArray<Geom3> = [];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      items.push(
        translate(
          [(i + 0.5 - width / 2) * size, 0, (j + 0.5 - depth / 2) * size],
          floor({ size }),
        ),
      );
    }
  }

  const processedLabels = labels
    .map((l) => positionedLabel(l, { width, depth, height, size }))
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
            size: [width * size, depth * size],
            roundRadius: profileFillet,
          }),
        ),
        // TODO: Floor fillet should not be equal wall fillet
        roundedCuboid({
          size: [
            width * size - wallThickness * 2,
            depth * size - wallThickness * 2,
            height * 7 - wallThickness + innerFillet * 2,
          ],
          center: [0, 0, (height * 7) / 2 + innerFillet + wallThickness],
          roundRadius: innerFillet,
        }),
      ),
    ),
  );
}
