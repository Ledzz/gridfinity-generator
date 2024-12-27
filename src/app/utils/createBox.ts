import { Box } from "../gridfinity/types/box.ts";
import { v4 as uuidv4 } from "uuid";

export const createBox = (): Box => ({
  id: uuidv4(),
  type: "box",
  width: 1,
  height: 3,
  depth: 1,
  labels: [],
  hasMagnetHoles: false,
});
