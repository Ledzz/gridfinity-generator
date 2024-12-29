import { Box } from "./box.ts";
import { Baseplate } from "./baseplate.ts";

export type Item = Box | Baseplate;

export type EditFormProps<T extends Item> = {
  value: T; // changed from just T to T | null
  onChange: (value: T | null) => void;
};
