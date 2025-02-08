import { Wall } from "../gridfinity/types/wall.ts";
import { Box } from "../gridfinity/types/box.ts";
import { LIP_HEIGHT, SIZE } from "../../manifold/constants.ts";
import { getId } from "./getId.ts";

export const createWall = (box: Box): Wall => {
  return {
    id: getId(),
    type: "wall",
    width: box.width * SIZE,
    height: box.height * 7 - LIP_HEIGHT - 0.3,
    thickness: 0.8,
    rotation: 0,
    position: [0, 0],
  };
};
