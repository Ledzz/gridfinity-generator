import { WallGeomProps } from "../../../gridfinity/bin/box.ts";

export type Wall = WallGeomProps & {
  id: string;
  type: "wall";
};
