import * as Comlink from "comlink";
import { box } from "./bin/box.ts";
import { baseplate } from "./baseplate/baseplate.ts";

// import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
// import { box } from "./bin/box.ts";
// import { baseplate } from "./baseplate/baseplate.ts";
// export const GEOMETRY_CREATORS: Record<Item["type"], () => Geom3 | null> = {
//     box,
//     baseplate,
// };
const gridfinityGenApi = {
  box,
  baseplate,
};

Comlink.expose(gridfinityGenApi);
