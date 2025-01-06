import { BoxGeomProps } from "./box.ts";
import { baseHeight, TOLERANCE } from "../constants.ts";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";

export const boxInnerContent = (
  box: Pick<BoxGeomProps, "width" | "height" | "depth">,
) =>
  extrudeLinear(
    { height: box.height * 7 + baseHeight },
    roundedRectangle({
      size: [box.width * 42 - TOLERANCE, box.depth * 42 - TOLERANCE],
      roundRadius: 3.75,
      segments: 8,
    }),
  );
