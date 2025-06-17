import { Box } from "./box.ts";
import { Baseplate } from "./baseplate.ts";
import { BaseplateExtend } from "./baseplate-extend.ts";

export type Item = Box | Baseplate | BaseplateExtend;

export type EditFormProps<T extends Item> = {
  value: T;
  onChange: (value: T | null) => void;
};
