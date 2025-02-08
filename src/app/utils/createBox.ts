import { Box } from "../gridfinity/types/box.ts";
import { getId } from "./getId.ts";

export const createBox = (): Box => ({
  id: getId(),
  type: "box",
  width: 1,
  height: 3,
  depth: 1,
  items: [],
  hasMagnetHoles: false,
});
