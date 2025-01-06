import { BoxGeomProps } from "./box.ts";
import { baseHeight, TOLERANCE, WALL_THICKNESS } from "../constants.ts";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";

export const boxInnerContent = (
  box: Pick<BoxGeomProps, "width" | "height" | "depth">,
) =>
  extrudeLinear(
    { height: box.height * 7 + baseHeight },
    roundedRectangle({
      size: [
        box.width * 42 - TOLERANCE - WALL_THICKNESS,
        box.depth * 42 - TOLERANCE - WALL_THICKNESS,
      ],
      roundRadius: 3.75 + 0.45,
      segments: 256,
    }),
  );
