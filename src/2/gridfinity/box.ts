import { union } from "@jscad/modeling/src/operations/booleans";
import { baseplate } from "./baseplate.ts";
import { translate } from "@jscad/modeling/src/operations/transforms";
import RecursiveArray from "@jscad/modeling/src/utils/recursiveArray";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { cuboid } from "@jscad/modeling/src/primitives";

export function box({ width = 1, depth = 1, height = 1, size = 42 } = {}) {
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
    cuboid({
      center: [0, 10, 0],
      size: [width * size, height * 7, depth * size],
    }),
  );
}
