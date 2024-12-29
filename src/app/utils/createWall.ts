import { v4 as uuidv4 } from "uuid";
import { Wall } from "../gridfinity/types/wall.ts";

export const createWall = (): Wall => ({
  id: uuidv4(),
  type: "wall",
  width: 1,
  height: 1,
  depth: 1,
  rotation: 0,
});
