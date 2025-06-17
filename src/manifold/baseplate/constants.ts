import { Vec2 } from "manifold-3d";

export const profilePoints = [
  [0, 0], // Up and out at a 45 degree angle
  [0, 1.8], // Straight up
  [1.9, 3.7], // Up and out at a 45 degree angle
  [2.15, 3.7], // Top shelf
  [2.15, 0], // Straight down
].toReversed() as Vec2[];

export const profileBaseWidth = Math.max(
  ...profilePoints.map((point) => point[0]),
);

export const profileBaseHeight = Math.max(
  ...profilePoints.map((point) => point[1]),
);
