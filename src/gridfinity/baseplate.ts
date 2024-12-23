import {
  circle,
  cuboid,
  polygon,
  rectangle,
} from "@jscad/modeling/src/primitives";
import {
  extrudeFromSlices,
  extrudeLinear,
} from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { SIZE } from "./constants.ts";
import { sweepRounded } from "./sweepRounded.ts";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import slice from "@jscad/modeling/src/operations/extrusions/slice/index";
import { mat4 } from "@jscad/modeling/src/maths/index";
import geom2 from "@jscad/modeling/src/geometries/geom2/index";

interface BaseplateGeomProps {
  style: "refined-lite";
  fillet: number;
  size: number;
  height: number;
  hasMagnetHoles: boolean;
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
}: Partial<BaseplateGeomProps> = {}) => {
  /**
   * TODO:
   * - [ ] Magnet holes
   * - [ ] Screw hole
   */

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

      return union(
        subtract(
          extrudeFromSlices(
            {
              numberOfSlices: 3,
              callback: (progress) => {
                const heights = [0, bottomFillet, height + baseHeight];
                let newSlice = slice.fromSides(
                  geom2.toSides(
                    rectangle({
                      size:
                        progress < 0.5
                          ? [SIZE - bottomFillet * 2, SIZE - bottomFillet * 2]
                          : [SIZE, SIZE],
                    }),
                  ),
                );

                newSlice = slice.transform(
                  mat4.fromTranslation(mat4.create(), [
                    0,
                    0,
                    heights[progress * 2],
                  ]),
                  newSlice,
                );

                return newSlice;
              },
            },
            rectangle({
              size: [SIZE, SIZE],
            }),
          ),
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
          cuboid({
            center: [0, 0, height / 2],
            size: [squareSize, squareSize, height],
          }),
          ...lips,
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
                    extrudeLinear(
                      { height: 2.4 },
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
        ),
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
