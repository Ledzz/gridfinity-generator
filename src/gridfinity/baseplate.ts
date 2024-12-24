import {
  circle,
  cuboid,
  polygon,
  rectangle,
} from "@jscad/modeling/src/primitives";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { SIZE } from "./constants.ts";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import { extrudeWithChamfer } from "./utils/extrudeWithChamfer.ts";
import { sweepRounded } from "./utils/sweepRounded.ts";
import { range } from "./utils/range.ts";

interface BaseplateGeomProps {
  style: "refined-lite";
  fillet: number;
  size: number;
  height: number;
  hasMagnetHoles: boolean;
  width: number;
  depth: number;
}

const baseplatePoly = [
  [3, 0],
  [3, 3],
  [7, 6],
  [7, 9],
  [-7, 9],
  [-7, 6],
  [-3, 3],
  [-3, 0],
];

export const baseplate = ({
  style = "refined-lite",
  height = 3,
  hasMagnetHoles = false,
  width = 1,
  depth = 1,
}: Partial<BaseplateGeomProps> = {}) => {
  /**
   * TODO:
   * - [ ] Magnet holes
   * - [ ] Screw hole
   */

  console.log(width, depth);

  switch (style) {
    case "refined-lite": {
      const bottomFillet = 0.6;
      const squareSize = 17.4;

      const lips = [0, 1, 2, 3].map((i) =>
        rotate(
          [0, 0, (i * Math.PI) / 2],
          translate(
            [SIZE / 2, 0, 0],
            rotate(
              [0, 0, Math.PI / 2],
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
      const points = [
        [0, 0], // Innermost bottom point
        [0.7, 0.7], // Up and out at a 45 degree angle
        [0.7, 2.5], // Straight up
        [2.6, 4.4], // Up and out at a 45 degree angle
        [2.85, 4.4], // Top shelf
        [2.85, 0], // Straight down
      ];

      points.reverse();

      const baseWidth = Math.max(...points.map((point) => point[0]));
      const baseHeight = Math.max(...points.map((point) => point[1]));

      const itemSubtract = [
        // hollow inside
        translate(
          [0, 0, height],
          extrudeLinear(
            { height: baseHeight },
            roundedRectangle({
              size: [SIZE, SIZE],
              roundRadius: 1.15 + baseWidth,
            }),
          ),
        ),
        // center hole
        cuboid({
          center: [0, 0, height / 2],
          size: [squareSize, squareSize, height],
        }),
        // lips for stacking
        ...lips,
        // magnet holes
        ...(hasMagnetHoles
          ? [0, 1, 2, 3].map((i) =>
              rotate(
                [0, 0, (i * Math.PI) / 2],
                translate(
                  [SIZE / 2 - baseWidth - 5.05, SIZE / 2 - baseWidth - 5.05, 0],
                  extrudeWithChamfer(
                    { height: 2.4, chamfer: 0.6 },
                    union(
                      circle({ radius: 6.1 / 2 }),
                      // TODO: angle should be 80 degrees, not 90
                      rectangle({
                        size: [6.1 / 2, 6.1 / 2],
                        center: [6.1 / 4, 6.1 / 4],
                      }),
                    ),
                  ),
                ),
              ),
            )
          : []),
      ];

      const toSubtract = range(width)
        .map((i) => {
          return range(depth).map((j) => {
            console.log(i, SIZE * (i - width));
            return translate(
              [SIZE * (i - width), SIZE * j, 0],
              ...itemSubtract,
            );
          });
        })
        .flat();

      return union(
        subtract(
          // Base shape
          extrudeWithChamfer(
            { height: height + baseHeight, chamfer: -0.6 },
            rectangle({ size: [SIZE * width, SIZE * depth] }),
          ),
          ...toSubtract,
        ),
        // profile
        translate(
          [0, 0, height],
          sweepRounded(
            polygon({
              points,
            }),
            SIZE - baseWidth * 2,
            1.15,
          ),
        ),
      );
    }
  }

  console.warn("Unknown baseplate style:", style);
  return null;
};
