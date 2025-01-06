import { v4 as uuidv4 } from "uuid";
import { Wall } from "../gridfinity/types/wall.ts";
import { Box } from "../gridfinity/types/box.ts";
import { LIP_HEIGHT, SIZE } from "../../gridfinity/constants.ts";

export const createWall = (box: Box): Wall => {
  return {
    id: uuidv4(),
    type: "wall",
    width: box.width * SIZE,
    height: box.height * 7 - LIP_HEIGHT - 0.3,
    thickness: 0.8,
    rotation: 0,
    position: [0, 0],
  };
};
