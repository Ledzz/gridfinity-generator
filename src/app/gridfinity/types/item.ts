import { Box } from "./box.ts";
import { Baseplate } from "./baseplate.ts";

export type Item = Box | Baseplate;

export type EditFormProps<T extends Item> = {
  value: T;
  onChange: (value: T | null) => void;
};
