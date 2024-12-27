import { circle, polygon, rectangle } from "@jscad/modeling/src/primitives";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { QUALITY, SIZE } from "../constants.ts";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import { extrudeWithChamfer } from "../utils/extrudeWithChamfer.ts";
import { mapReduce2D } from "../utils/range.ts";
import { sweepRounded } from "../utils/sweepRounded.ts";
import { connectorHoles } from "./connectorHole.ts";
import { centerHole } from "./centerHole.ts";

interface BaseplateGeomProps {
  style: "refined-lite";
  fillet: number;
  size: number;
  height: number;
  hasMagnetHoles: boolean;
  width: number;
  depth: number;
}

export const baseplate = ({
  style = "refined-lite",
  height = 3,
  hasMagnetHoles = false,
  width = 1,
  depth = 1,
}: Partial<BaseplateGeomProps> = {}) => {
  switch (style) {
    case "refined-lite": {
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

      const toSubtract = mapReduce2D(width, depth, (x, y) =>
        translate(
          [
            SIZE * (x - (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
            SIZE * (y - (depth % 2 === 0 ? depth / 2 - 0.5 : depth / 2 - 0.5)),
            0,
          ],
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
          centerHole({ width, depth, height, x, y }),
          connectorHoles({ width, depth, height, x, y }),
          // magnet holes
          ...(hasMagnetHoles
            ? [0, 1, 2, 3].map((i) =>
                rotate(
                  [0, 0, (i * Math.PI) / 2],
                  translate(
                    [
                      SIZE / 2 - baseWidth - 5.05,
                      SIZE / 2 - baseWidth - 5.05,
                      0,
                    ],
                    extrudeWithChamfer(
                      { height: 2.4, chamfer: 0.6 },
                      union(
                        circle({ radius: 6.1 / 2, segments: QUALITY }),
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
        ),
      );

      const toAdd = mapReduce2D(width, depth, (x, y) =>
        translate(
          [
            SIZE * (x - (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
            SIZE * (y - (depth % 2 === 0 ? depth / 2 - 0.5 : depth / 2 - 0.5)),
            0,
          ],
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
        ),
      );

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
        ...toAdd,
      );
    }
  }

  console.warn("Unknown baseplate style:", style);
  return null;
};
