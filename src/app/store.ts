import { create } from "zustand";
import { persist } from "zustand/middleware";

import { v4 as uuidv4 } from "uuid";

export function createNewBox(): Box {
  return {
    id: uuidv4(),
    type: "box",
    width: 1,
    height: 1,
    depth: 1,
    wallThickness: 0.8,
    labels: [],
  };
}

export function createNewBaseplate(): Baseplate {
  return {
    id: uuidv4(),
    type: "baseplate",
    width: 1,
    depth: 1,
  };
}

export type Label = {
  text: string;
  fontSize?: number;
};

export type Box = {
  id: string;
  type: "box";
  width: number;
  height: number;
  depth: number;
  wallThickness: number;
  labels?: Label[];
};

export type Baseplate = {
  id: string;
  type: "baseplate";
  width: number;
  depth: number;
};

type Item = Box | Baseplate;

type Structure = {
  width: number;
  depth: number;
  items: Item[];
  tolerance: number;
  fillet: number;
};

export const useStore = create<Structure>()(
  persist(
    () =>
      ({
        width: 1,
        depth: 1,
        items: [],
        tolerance: 0.5,
        fillet: 0.8,
      }) satisfies Structure,
    { name: "structure" },
  ),
);
