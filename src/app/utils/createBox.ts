import { Box } from "../types/box.ts";
import { v4 as uuidv4 } from "uuid";

export const createBox = (): Box => ({
  id: uuidv4(),
  type: "box",
  width: 1,
  height: 1,
  depth: 1,
  wallThickness: 0.8,
  labels: [],
});