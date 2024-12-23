import { Item } from "../app/types/item.ts";
import { ReactElement } from "react";
import { BoxEdit } from "../app/BoxEdit.tsx";
import { BaseplateEdit } from "../app/BaseplateEdit.tsx";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { box } from "./box.ts";
import { baseplate } from "./baseplate.ts";

export const baseHeight = 4.75;

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

export const QUALITY = 128; // high
