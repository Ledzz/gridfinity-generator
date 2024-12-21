import { create } from "zustand/index";
import { persist } from "zustand/middleware";

interface AppStore {
  selectedItemId: string | null;
}

export const useAppStore = create<AppStore>()(
  persist(
    () =>
      ({
        selectedItemId: null,
      }) as AppStore,
    { name: "app" },
  ),
);
