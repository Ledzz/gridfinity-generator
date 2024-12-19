import { union } from "@jscad/modeling/src/operations/booleans";
import {
  extrudeLinear,
  extrudeRotate,
} from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import Geom2 from "@jscad/modeling/src/geometries/geom2/type";

export const sweepRounded = (
  baseShape: Geom2,
  size: number,
  fillet: number,
) => {
  const hs = size / 2;
  const ins = size - fillet * 2;
  const inhs = ins / 2;

  const walls = [0, 1, 2, 3].map((i) =>
    rotate(
      [0, (i * Math.PI) / 2, 0],
      translate([hs, 0, -inhs], extrudeLinear({ height: ins }, baseShape)),
    ),
  );

  const rounded = [0, 1, 2, 3].map((i) =>
    rotate(
      [0, (i * Math.PI) / 2, 0],
      translate(
        [hs - fillet, 0, -hs + fillet],
        rotate(
          [-Math.PI / 2, 0, 0],
          extrudeRotate(
            {
              startAngle: 0,
              angle: Math.PI / 2,
              segments: 32,
            },
            translate([fillet, 0, 0], baseShape),
          ),
        ),
      ),
    ),
  );

  return union(...walls, ...rounded);
};
