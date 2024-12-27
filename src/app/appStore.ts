import { create } from "zustand/index";
import { persist } from "zustand/middleware";

interface AppStore {
  selectedItemId: string | null;
  isWireframe: boolean;
}

export const useAppStore = create<AppStore>()(
  persist(
    () =>
      ({
        selectedItemId: null,
        isWireframe: false,
      }) as AppStore,
    { name: "app" },
  ),
);
