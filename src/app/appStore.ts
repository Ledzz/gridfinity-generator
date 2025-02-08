import { create } from "zustand/index";
import { persist } from "zustand/middleware";

export const BED_SIZES: Record<string, [number, number]> = {
  a1mini: [180, 180],
  p1: [256, 256],
  a1: [256, 256],
};

interface AppStore {
  selectedItemId: number | null;
  selectedSubItemId: number | null;
  isWireframe: boolean;
  bedSize: [number, number] | null;
}

export const useAppStore = create<AppStore>()(
  persist(
    () =>
      ({
        selectedSubItemId: null,
        selectedItemId: null,
        isWireframe: false,
        bedSize: [256, 256],
      }) as AppStore,
    { name: "app" },
  ),
);
