import { create } from "zustand/index";
import { persist } from "zustand/middleware";

export const BED_SIZES: Record<string, [number, number]> = {
  a1mini: [180, 180],
  p1: [256, 256],
  a1: [256, 256],
};

export const FONTS = [
  { name: "Arial", path: "fonts/arial.ttf" },
  { name: "Montserrat", path: "fonts/Montserrat-Medium.ttf" },
  { name: "Inter Medium", path: "fonts/Inter_18pt-Medium.ttf" },
  { name: "Inter Black", path: "fonts/Inter_18pt-Black.ttf" },
];

interface AppStore {
  selectedItemId: number | null;
  selectedSubItemId: number | null;
  isWireframe: boolean;
  bedSize: [number, number] | null;
  font: string;
}

export const useAppStore = create<AppStore>()(
  persist(
    () =>
      ({
        selectedSubItemId: null,
        selectedItemId: null,
        isWireframe: false,
        bedSize: [256, 256],
        font: "fonts/Inter_18pt-Medium.ttf",
      }) as AppStore,
    { name: "app" },
  ),
);
