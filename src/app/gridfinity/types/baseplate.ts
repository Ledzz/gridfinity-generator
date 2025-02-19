import { BaseplateGeomProps } from "../../../manifold/baseplate/baseplate.ts";

export type Baseplate = Pick<
  BaseplateGeomProps,
  "width" | "depth" | "hasMagnetHoles" | "hasStackableConnectors"
> & {
  id: number;
  type: "baseplate";
};
