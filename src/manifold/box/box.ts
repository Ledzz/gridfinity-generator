import { Vec2 } from "manifold-3d";
import { sweepRounded } from "../sweepRounded.ts";
import { floor } from "./floor.ts";
import { label } from "./label.ts";
import { BoxItemGeomProps } from "./box-item.ts";
import { wall } from "./wall.ts";
import { DEFAULT_QUALITY, TOLERANCE, WALL_THICKNESS } from "../constants.ts";
import { manifold } from "../manifoldModule.ts";

export type BoxGeomProps = {
  width: number;
  depth: number;
  height: number;
  size: number;
  items: BoxItemGeomProps[];
  profileFillet: number;
  quality: number;
  hasMagnetHoles: boolean;
  font: string;
};

export const box = async ({
  width = 1,
  depth = 1,
  height = 1,
  items = [],
  quality = DEFAULT_QUALITY,
  hasMagnetHoles = false,
  font = "fonts/arial.ttf",
}: Partial<BoxGeomProps> = {}) => {
  const labels = (
    await Promise.all(
      items
        .filter((i) => i.type === "label")
        .map((l) => label(l, { width, depth, height, quality, font })),
    )
  ).filter(Boolean);

  const walls = (
    await Promise.all(
      items
        .filter((i) => i.type === "wall")
        .map((w) => wall(w, { width, depth, height, quality })),
    )
  ).filter(Boolean);

  // TODO: Walls
  const baseHeight = 6;
  const h = height * 7;

  const points = [
    [0, 0],
    [0, h - 1.6],
    [-1.9, h - 3.5],
    [-1.9, h - 5.3],
    [-2.6, h - 6],
    [-2.6, h - 6.25],
    [-WALL_THICKNESS, h - 8.4],
    [-WALL_THICKNESS, 0],
  ] as Vec2[];

  return [
    ...labels,
    ...walls,
    manifold.Manifold.compose([
      floor({ width, depth, quality, hasMagnetHoles }),
      sweepRounded(
        points,
        [width * 42 - TOLERANCE, depth * 42 - TOLERANCE],
        3.75,
        quality,
      ).translate([0, 0, baseHeight]),
    ]),
  ];
};
