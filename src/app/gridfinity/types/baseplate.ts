import { BaseplateGeomProps } from "../../../gridfinity/baseplate/baseplate.ts";

export type Baseplate = Pick<
  BaseplateGeomProps,
  "width" | "depth" | "hasMagnetHoles" | "hasStackableConnectors"
> & {
  id: string;
  type: "baseplate";
};
