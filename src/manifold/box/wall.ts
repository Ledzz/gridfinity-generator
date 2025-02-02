import { ManifoldToplevel, Vec2 } from "manifold-3d";
import { BoxGeomProps } from "./box.ts";
import { boxInnerContent } from "./boxInnerContent.ts";
import { baseHeight } from "../constants.ts";

export type WallGeomProps = {
  width: number;
  height: number;
  thickness: number;
  rotation: number;
  position: Vec2;
  type: "wall";
};

export const wall = (
  wasm: ManifoldToplevel,
  w: WallGeomProps,
  box: Pick<BoxGeomProps, "width" | "depth" | "height" | "quality">,
) =>
  wasm.Manifold.cube([w.width, w.thickness, w.height])
    .translate([
      w.position[0] - w.width / 2,
      w.position[1] - w.thickness / 2,
      baseHeight,
    ])
    .rotate([0, 0, w.rotation])
    .intersect(boxInnerContent(wasm, box));
