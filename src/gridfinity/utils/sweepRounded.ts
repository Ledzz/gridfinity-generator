import { union } from "@jscad/modeling/src/operations/booleans";
import {
  extrudeLinear,
  extrudeRotate,
} from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import Geom2 from "@jscad/modeling/src/geometries/geom2/type";
import { range } from "./range.ts";
import { DEFAULT_QUALITY } from "../constants.ts";

export const sweepRounded = (
  baseShape: Geom2,
  size: number | [number, number],
  fillet: number,
  quality: number = DEFAULT_QUALITY,
) => {
  const width = Array.isArray(size) ? size[0] : size;
  const depth = Array.isArray(size) ? size[1] : size;

  const walls = range(4).map((i) => {
    const x = i % 2 === 0 ? width / 2 : depth / 2;
    const z = i % 2 === 1 ? -width / 2 + fillet : -depth / 2 + fillet;
    const extrude = (i % 2 === 1 ? width : depth) - fillet * 2;
    return rotate(
      [Math.PI / 2, 0, (i * Math.PI) / 2],
      translate([x, 0, z], extrudeLinear({ height: extrude }, baseShape)),
    );
  });
  const rounded = range(4).map((i) => {
    const x = i % 2 === 0 ? width / 2 - fillet : depth / 2 - fillet;
    const z = i % 2 === 1 ? -width / 2 + fillet : -depth / 2 + fillet;
    return rotate(
      [Math.PI / 2, 0, (i * Math.PI) / 2],
      translate(
        [x, 0, z],
        rotate(
          [-Math.PI / 2, 0, 0],
          extrudeRotate(
            {
              startAngle: 0,
              angle: Math.PI / 2,
              segments: quality,
            },
            translate([fillet, 0, 0], baseShape),
          ),
        ),
      ),
    );
  });

  return union(...walls, ...rounded);
};
