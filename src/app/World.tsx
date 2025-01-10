import { FC, useCallback } from "react";
import { useWorldStore } from "./worldStore.ts";
import { useAppStore } from "./appStore.ts";
import { RenderManifold } from "./RenderManifold.tsx";

export const World: FC = () => {
  const items = useWorldStore((state) => state.items);

  const handleSelectItem = useCallback(
    (id: string) => () => {
      useAppStore.setState((s) =>
        s.selectedItemId === id
          ? { selectedItemId: null }
          : { selectedItemId: id },
      );
    },
    [],
  );
  return (
    <>
      {items.map((item) => (
        <RenderManifold
          key={item.id}
          onClick={handleSelectItem(item.id)}
          {...item}
        />
      ))}
    </>
  );
};
