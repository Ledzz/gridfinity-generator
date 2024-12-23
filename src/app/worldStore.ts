import { create } from "zustand";
import { persist } from "zustand/middleware";
import { World } from "./types/world.ts";

export const useWorldStore = create<World>()(
  persist(
    () =>
      ({
        items: [],
      }) satisfies World,
    { name: "structure" },
  ),
);
