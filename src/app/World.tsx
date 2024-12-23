import { FC, useCallback } from "react";
import { RenderGeom } from "./adapters.tsx";
import { useWorldStore } from "./worldStore.ts";
import { useAppStore } from "./appStore.ts";

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
        <RenderGeom
          key={item.id}
          onClick={handleSelectItem(item.id)}
          {...item}
        />
      ))}
    </>
  );
};
