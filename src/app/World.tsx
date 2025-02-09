import { FC } from "react";
import { useWorldStore } from "./worldStore.ts";
import { RenderManifolds } from "./RenderManifolds.tsx";
import { RENDER } from "./gridfinity/items.ts";

export const World: FC = () => {
  const items = useWorldStore((state) => state.items);

  return (
    <>
      {items.map((item) => (
        <RenderManifolds key={item.id} render={RENDER[item.type]} {...item} />
      ))}
    </>
  );
};
