import { cuboid, polygon } from "@jscad/modeling/src/primitives";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { sweepRounded } from "./sweepRounded.ts";
import { basePoly } from "./constants.ts";

interface BaseplateGeomProps {
  style: "refined-lite";
  fillet: number;
}

const baseplatePoly = [
  [3, 0],
  [3, 3],
  [7, 8],
  [7, 11],
  [-7, 11],
  [-7, 8],
  [-3, 3],
  [-3, 0],
];

export const baseplate = ({
  style = "refined-lite",
  fillet = 0.8,
}: Partial<BaseplateGeomProps> = {}) => {
  const width = 42;
  const depth = 42;
  const height = 3;

  switch (style) {
    case "refined-lite":
      const lips = [0, 1, 2, 3].map((i) =>
        rotate(
          [0, (i * Math.PI) / 2, 0],
          translate(
            [0, 0, width / 2],
            rotate(
              [-Math.PI / 2, 0, 0],
              extrudeLinear(
                { height },
                polygon({
                  points: baseplatePoly,
                }),
              ),
            ),
          ),
        ),
      );

      return union(
        sweepRounded(
          polygon({
            points: basePoly,
          }),
          width,
          fillet,
        ),
        subtract(
          cuboid({
            center: [0, height / 2, 0],
            size: [width, height, depth],
          }),
          ...lips,
        ),
      );
  }

  console.warn("Unknown baseplate style:", style);
  return null;
};
