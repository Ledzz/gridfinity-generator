import { cuboid, polygon, rectangle } from "@jscad/modeling/src/primitives";
import {
  extrudeFromSlices,
  extrudeLinear,
} from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { sweepRounded } from "./sweepRounded.ts";
import { baseHeight, basePolyProfile, baseWidth } from "./constants.ts";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import slice from "@jscad/modeling/src/operations/extrusions/slice/index";
import { mat4 } from "@jscad/modeling/src/maths/index";
import geom2 from "@jscad/modeling/src/geometries/geom2";

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
  fillet = 0.8,
  size = 42,
  height = 3,
}: Partial<BaseplateGeomProps> = {}) => {
  /**
   * TODO:
   * - [ ] Fillet on bottom
   * - [ ] Magnet holes
   * - [ ] Screw hole
   */

  switch (style) {
    case "refined-lite":
      const bottomFilletHeight = 0.6;
      const numberOfSlices = height / bottomFilletHeight;

      const lips = [0, 1, 2, 3].map((i) =>
        rotate(
          [0, (i * Math.PI) / 2, 0],
          translate(
            [0, 0, size / 2],
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
      const points = [
        ...basePolyProfile,
        [baseWidth, 0.8 + 1.8 + 2.15],
        [baseWidth, 0],
      ];
      points.reverse();

      return union(
        subtract(
          cuboid({
            center: [0, baseHeight / 2 + height, 0],
            size: [size, baseHeight, size],
          }),
          translate(
            [0, height, 0],
            rotate(
              [-Math.PI / 2, 0, 0],
              extrudeLinear(
                { height: baseHeight },
                roundedRectangle({
                  size: [size, size],
                  roundRadius: fillet + baseWidth,
                }),
              ),
            ),
          ),
        ),
        translate(
          [0, height, 0],
          sweepRounded(
            polygon({
              points,
            }),
            size - baseWidth * 2,
            fillet,
          ),
        ),
        // subtract(
        // Base square
        // cuboid({
        //   center: [0, height / 2, 0],
        //   size: [size, height, size],
        // }),
        extrudeFromSlices(
          {
            numberOfSlices,
            callback: (progress) => {
              let newSlice = slice.fromSides(
                geom2.toSides(
                  rectangle({
                    size:
                      progress * height < bottomFilletHeight
                        ? [size - bottomFilletHeight, size - bottomFilletHeight]
                        : [size, size],
                  }),
                ),
              );

              newSlice = slice.transform(
                mat4.fromTranslation(mat4.create(), [0, 0, progress * height]),
                newSlice,
              );

              return newSlice;
            },
          },
          rectangle({
            size: [size, size],
          }),
        ),
        //   ...lips,
        //   cuboid({
        //     center: [0, height / 2, 0],
        //     size: [17.4, height, 17.4],
        //   }),
        // ),
      );
  }

  console.warn("Unknown baseplate style:", style);
  return null;
};
