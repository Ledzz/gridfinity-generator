import { ManifoldToplevel, Vec2 } from "manifold-3d";
import { sweepRounded } from "../sweepRounded.ts";
import { DEFAULT_QUALITY, SIZE } from "../../gridfinity/constants.ts";

const points = [
  [0, 0], // Innermost bottom point
  [0.7, 0.7], // Up and out at a 45 degree angle
  [0.7, 2.5], // Straight up
  [2.6, 4.4], // Up and out at a 45 degree angle
  [2.85, 4.4], // Top shelf
  [2.85, 0], // Straight down
  [0, 0], // Straight down
] as Vec2[];

points.reverse();
const baseWidth = Math.max(...points.map((point) => point[0]));

export const profile = (
  wasm: ManifoldToplevel,
  { quality = DEFAULT_QUALITY }: { quality: number },
) => {
  const { CrossSection, Manifold } = wasm;
  return sweepRounded(wasm, points, SIZE - baseWidth * 2, 1.15, quality);
};
