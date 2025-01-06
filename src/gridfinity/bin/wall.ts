import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { baseHeight, TOLERANCE } from "../constants.ts";
import { cuboid } from "@jscad/modeling/src/primitives";
import { Vec2 } from "@jscad/modeling/src/maths/vec2";
import { intersect } from "@jscad/modeling/src/operations/booleans";
import { BoxGeomProps } from "./box.ts";

export type WallGeomProps = {
  width: number;
  height: number;
  thickness: number;
  rotation: number;
  position: Vec2;
  type: "wall";
};

export const wall = (
  w: WallGeomProps,
  box: Pick<BoxGeomProps, "width" | "depth" | "height">,
) =>
  intersect(
    cuboid({
      size: [
        box.width * 42 - TOLERANCE,
        box.depth * 42 - TOLERANCE,
        box.height * 7,
      ],
      center: [0, 0, (box.height * 7) / 2],
    }),
    translate(
      [w.position[0], w.position[1], baseHeight],
      rotate(
        [0, 0, w.rotation * (Math.PI / 180)],
        cuboid({
          size: [w.width, w.thickness, w.height],
          center: [0, 0, w.height / 2],
        }),
      ),
    ),
  );
