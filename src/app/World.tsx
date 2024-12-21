import { FC } from "react";
import { Baseplate, Box } from "./adapters.tsx";
import { useStore } from "./store.ts";

export const World: FC = () => {
  const items = useStore((state) => state.items);
  return (
    <>
      {items.map((item) => {
        switch (item.type) {
          case "box":
            return <Box {...item} />;
          case "baseplate":
            return <Baseplate {...item} />;
        }
      })}
    </>
  );
};
