import { Label } from "./label.ts";
import { Wall } from "./wall.ts";
import { Ledge } from "./ledge.ts";
import { Scoop } from "./scoop.ts";

export type Box = {
  id: string;
  type: "box";
  width: number;
  height: number;
  depth: number;
  items?: (Wall | Label | Ledge | Scoop)[];
  hasMagnetHoles: boolean;
};
