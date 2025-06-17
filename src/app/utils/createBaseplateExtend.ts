import { getId } from "./getId.ts";
import { BaseplateExtend } from "../gridfinity/types/baseplate-extend.ts";

export const createBaseplateExtend = (): BaseplateExtend => ({
  id: getId(),
  type: "baseplateExtend",
  width: 1,
  depth: 20,
});
