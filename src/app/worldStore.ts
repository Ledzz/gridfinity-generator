import { create } from "zustand";
import { persist } from "zustand/middleware";
import { World } from "./types/world.ts";
import { Item } from "./gridfinity/types/item.ts";

export const useWorldStore = create<World>()(
  persist(
    () => ({
      items: [] as Item[],
    }),
    { name: "structure" },
  ),
);
