import { BoxGeomProps } from "./box.ts";
import { roundedRectangle } from "../roundedRectangle.ts";
import { baseHeight, TOLERANCE, WALL_THICKNESS } from "../constants.ts";

export const boxInnerContent = (
  box: Pick<BoxGeomProps, "width" | "height" | "depth" | "quality">,
) =>
  roundedRectangle({
    size: [
      box.width * 42 - TOLERANCE - WALL_THICKNESS,
      box.depth * 42 - TOLERANCE - WALL_THICKNESS,
    ],
    radius: 3.75 + 0.45,
    quality: box.quality,
  }).extrude(box.height * 7 + baseHeight);
