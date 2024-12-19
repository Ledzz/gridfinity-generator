import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { baseplate } from "./baseplate.ts";
import {
  rotateX,
  translate,
  translateY,
} from "@jscad/modeling/src/operations/transforms";
import RecursiveArray from "@jscad/modeling/src/utils/recursiveArray";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import { baseHeight } from "./constants.ts";
import { roundedCuboid } from "@jscad/modeling/src/primitives";

export function box({ width = 1, depth = 1, height = 1, size = 42 } = {}) {
  const wallThickness = 1;
  const innerFillet = 3; // TODO: Calculate
  const outerFillet = 3.25; // TODO: Calculate
  const items: RecursiveArray<Geom3> = [];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      items.push(
        translate(
          [(i + 0.5 - width / 2) * size, 0, (j + 0.5 - depth / 2) * size],
          baseplate({ size }),
        ),
      );
    }
  }
  return union(
    ...items,
    subtract(
      translateY(
        baseHeight,
        rotateX(
          -Math.PI / 2,
          extrudeLinear(
            { height: height * 7 },
            roundedRectangle({
              size: [width * size, depth * size],
              roundRadius: outerFillet,
            }),
          ),
        ),
      ),
      roundedCuboid({
        size: [
          width * size - wallThickness * 2,
          height * 7 - wallThickness + innerFillet * 2,
          depth * size - wallThickness * 2,
        ],
        center: [0, height * 7 + wallThickness, 0],
        roundRadius: innerFillet,
      }),
    ),
  );
}
