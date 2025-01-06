import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { baseHeight } from "../constants.ts";
import { cuboid } from "@jscad/modeling/src/primitives";
import { Vec2 } from "@jscad/modeling/src/maths/vec2";

export type WallGeomProps = {
  width: number;
  height: number;
  thickness: number;
  rotation: number;
  position: Vec2;
  type: "wall";
};

export function wall(wall: WallGeomProps) {
  return translate(
    [wall.position[0], wall.position[1], baseHeight],
    rotate(
      [0, 0, wall.rotation * (Math.PI / 180)],
      cuboid({
        size: [wall.width, wall.thickness, wall.height],
        center: [0, 0, wall.height / 2],
      }),
    ),
  );
}
