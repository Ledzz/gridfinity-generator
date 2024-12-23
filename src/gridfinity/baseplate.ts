import { cuboid, polygon, rectangle } from "@jscad/modeling/src/primitives";
import {
  extrudeFromSlices,
  extrudeLinear,
} from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import {
  baseHeight,
  basePolyProfile,
  baseWidth,
  FILLET,
  SIZE,
} from "./constants.ts";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import slice from "@jscad/modeling/src/operations/extrusions/slice/index";
import geom2 from "@jscad/modeling/src/geometries/geom2";
import { mat4 } from "@jscad/modeling/src/maths/index";
import { sweepRounded } from "./sweepRounded.ts";

interface BaseplateGeomProps {
  style: "refined-lite";
  fillet: number;
  size: number;
  height: number;
}

const baseplatePoly = [
  [3, 0],
  [3, 3],
  [8, 7],
  [8, 10],
  [-8, 10],
  [-8, 7],
  [-3, 3],
  [-3, 0],
];

export const baseplate = ({
  style = "refined-lite",
  height = 3,
}: Partial<BaseplateGeomProps> = {}) => {
  /**
   * TODO:
   * - [ ] Magnet holes
   * - [ ] Screw hole
   */

  switch (style) {
    case "refined-lite": {
      const bottomFilletHeight = 0.6;
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
        ...basePolyProfile,
        [baseWidth, baseHeight],
        [baseWidth, 0],
      ];

      points.reverse();

      return union(
        subtract(
          extrudeFromSlices(
            {
              numberOfSlices: 3,
              callback: (progress) => {
                const heights = [0, bottomFilletHeight, height + baseHeight];
                let newSlice = slice.fromSides(
                  geom2.toSides(
                    rectangle({
                      size:
                        progress < 0.5
                          ? [
                              SIZE - bottomFilletHeight,
                              SIZE - bottomFilletHeight,
                            ]
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
                roundRadius: FILLET + baseWidth,
              }),
            ),
          ),
          cuboid({
            center: [0, 0, height / 2],
            size: [squareSize, squareSize, height],
          }),
          ...lips,
        ),
        translate(
          [0, 0, height],
          sweepRounded(
            polygon({
              points,
            }),
            SIZE - baseWidth * 2,
            FILLET,
          ),
        ),
      );
    }
  }

  console.warn("Unknown baseplate style:", style);
  return null;
};
