import { union } from "@jscad/modeling/src/operations/booleans";
import { translateZ } from "@jscad/modeling/src/operations/transforms";
import { label } from "./label.ts";

import { Label } from "../../app/gridfinity/types/label.ts";
import { sweepRounded } from "../utils/sweepRounded.ts";
import { polygon } from "@jscad/modeling/src/primitives";
import { DEFAULT_QUALITY } from "../constants.ts";
import { floor } from "./floor.ts";
import { Wall } from "../../app/gridfinity/types/wall.ts";
import { Ledge } from "../../app/gridfinity/types/ledge.ts";
import { Scoop } from "../../app/gridfinity/types/scoop.ts";
import { Vec2 } from "@jscad/modeling/src/maths/vec2";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";

export type BoxItem = Wall | Label | Ledge | Scoop;

export type BoxGeomProps = {
  width: number;
  depth: number;
  height: number;
  size: number;
  items: BoxItem[];
  profileFillet: number;
  quality: number;
  hasMagnetHoles: boolean;
};

export function box({
  width = 1,
  depth = 1,
  height = 1,
  items = [],
  quality = DEFAULT_QUALITY,
  hasMagnetHoles = false,
}: Partial<BoxGeomProps> = {}) {
  const processedLabels: Geom3[] = items
    .filter((i) => i.type === "label")
    .map((l) => label(l, { width, depth, height }))
    .filter(Boolean);

  const baseHeight = 6;
  const h = height * 7;

  const points = [
    [0, 0],
    [0, h - 1.6],
    [-1.9, h - 3.5],
    [-1.9, h - 5.3],
    [-2.6, h - 6],
    [-2.6, h - 6.25],
    [-0.45, h - 8.4],
    [-0.45, 0],
  ] as Vec2[];

  return union(
    floor({ width, depth, quality, hasMagnetHoles }),
    ...processedLabels,
    translateZ(
      baseHeight,
      sweepRounded(
        polygon({
          points,
        }),
        [width * 42 - 0.5, depth * 42 - 0.5],
        3.75,
        quality,
      ),
    ),
  );
}
