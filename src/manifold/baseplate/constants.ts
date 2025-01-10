import { Vec2 } from "manifold-3d";

export const profilePoints = [
  [0, 0], // Innermost bottom point
  [0.7, 0.7], // Up and out at a 45 degree angle
  [0.7, 2.5], // Straight up
  [2.6, 4.4], // Up and out at a 45 degree angle
  [2.85, 4.4], // Top shelf
  [2.85, 0], // Straight down
  [0, 0], // Straight down
].toReversed() as Vec2[];

export const profileBaseWidth = Math.max(
  ...profilePoints.map((point) => point[0]),
);

export const profileBaseHeight = Math.max(
  ...profilePoints.map((point) => point[1]),
);
