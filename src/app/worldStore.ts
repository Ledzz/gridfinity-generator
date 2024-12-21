import { create } from "zustand";
import { persist } from "zustand/middleware";
import { World } from "./types/world.ts";

export const useWorldStore = create<World>()(
  persist(
    () =>
      ({
        items: [],
        tolerance: 0.5,
        profileFillet: 7.5 / 2,
      }) satisfies World,
    { name: "structure" },
  ),
);
