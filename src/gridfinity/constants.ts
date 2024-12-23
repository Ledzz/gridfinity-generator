import Vec2 from "@jscad/modeling/src/maths/vec2/type";
import { Item } from "../app/types/item.ts";
import { ReactElement } from "react";
import { BoxEdit } from "../app/BoxEdit.tsx";
import { BaseplateEdit } from "../app/BaseplateEdit.tsx";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { box } from "./box.ts";
import { baseplate } from "./baseplate.ts";

export const basePolyProfile = [
  [0, 0], // Innermost bottom point
  [0.8, 0.8], // Up and out at a 45 degree angle
  [0.8, 0.8 + 1.8], // Straight up
  [0.8 + 2.15, 0.8 + 1.8 + 2.15], // Up and out at a 45 degree angle
] satisfies Vec2[];

export const basePoly = [
  ...basePolyProfile,
  [0, 0.8 + 1.8 + 2.15],
] satisfies Vec2[];

export const baseWidth = Math.max(...basePolyProfile.map((point) => point[0]));
export const baseHeight = Math.max(...basePolyProfile.map((point) => point[1]));

export const SIZE = 42;
export const WALL_THICKNESS = 0.8;

export const FILLET = 0.8;
export const PROFILE_FILLET = FILLET + 2.95;
export const TOLERANCE = 0.5;

export const EDIT_FORMS: Record<Item["type"], ReactElement> = {
  box: BoxEdit,
  baseplate: BaseplateEdit,
};

export const GEOMETRY_CREATORS: Record<Item["type"], () => Geom3 | null> = {
  box,
  baseplate,
};
