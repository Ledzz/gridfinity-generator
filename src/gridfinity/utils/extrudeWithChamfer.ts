import { extrudeFromSlices } from "@jscad/modeling/src/operations/extrusions";
import slice from "@jscad/modeling/src/operations/extrusions/slice";
import geom2 from "@jscad/modeling/src/geometries/geom2";
import { mat4 } from "@jscad/modeling/src/maths";
import { expand } from "@jscad/modeling/src/operations/expansions";

export const extrudeWithChamfer = ({ height, chamfer }, shape) => {
  return extrudeFromSlices(
    {
      numberOfSlices: 3,
      callback: (progress) => {
        const heights = [0, Math.abs(chamfer), height];
        let newSlice = slice.fromSides(
          geom2.toSides(expand({ delta: progress < 0.5 ? chamfer : 0 }, shape)),
        );
        newSlice = slice.transform(
          mat4.fromTranslation(mat4.create(), [0, 0, heights[progress * 2]]),
          newSlice,
        );

        return newSlice;
      },
    },
    shape,
  );
};
