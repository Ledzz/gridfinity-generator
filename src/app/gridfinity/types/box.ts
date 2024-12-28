import { BoxGeomProps } from "../../../gridfinity/bin/box.ts";

export type Box = Pick<
  BoxGeomProps,
  "width" | "height" | "depth" | "items" | "hasMagnetHoles"
> & {
  id: string;
  type: "box";
};
