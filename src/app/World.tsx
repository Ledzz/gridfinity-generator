import { FC } from "react";
import { Box } from "./adapters.tsx";
import { useStore } from "./store.ts";

export const World: FC = () => {
  const items = useStore((state) => state.items);
  return (
    <>
      {items.map((boxProps) => (
        <Box {...boxProps} />
      ))}
    </>
  );
};
