import { BoxGeomProps } from "../../../manifold/box/box.ts";

export type Box = Pick<
  BoxGeomProps,
  "width" | "height" | "depth" | "items" | "hasMagnetHoles"
> & {
  id: number;
  type: "box";
};
