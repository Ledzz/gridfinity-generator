import { Vec2 } from "manifold-3d";
import { BoxGeomProps } from "./box.ts";
import { boxInnerContent } from "./boxInnerContent.ts";
import { baseHeight } from "../constants.ts";
import { manifold } from "../manifoldModule.ts";

export type WallGeomProps = {
  id: number;
  width: number;
  height: number;
  thickness: number;
  rotation: number;
  position: Vec2;
  type: "wall";
};

export const wall = (
  w: WallGeomProps,
  box: Pick<BoxGeomProps, "width" | "depth" | "height" | "quality">,
) =>
  manifold.Manifold.compose([
    manifold.Manifold.cube([w.width, w.thickness, w.height])
      .translate([
        w.position[0] - w.width / 2,
        w.position[1] - w.thickness / 2,
        baseHeight,
      ])
      .rotate([0, 0, w.rotation])
      .intersect(boxInnerContent(box)),
  ]).setProperties(1, (newProp) => {
    newProp[0] = w.id;
  });
