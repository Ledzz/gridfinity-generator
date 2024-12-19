import { union } from "@jscad/modeling/src/operations/booleans";
import { baseplate } from "./baseplate.ts";
import { translate } from "@jscad/modeling/src/operations/transforms";
import RecursiveArray from "@jscad/modeling/src/utils/recursiveArray";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";

export function box({ width = 1, height = 1, size = 42 } = {}) {
  const items: RecursiveArray<Geom3> = [];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      items.push(
        translate(
          [(i - width / 2) * size, 0, (j - height / 2) * size],
          baseplate({ size }),
        ),
      );
    }
  }
  return union(...items);
}
