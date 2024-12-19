import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Label = {
  text: string;
  fontSize?: number;
};

export type Box = {
  type: "box";
  width: number;
  height: number;
  depth: number;
  wallThickness: number;
  labels?: Label[];
};

type Item = Box;

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
