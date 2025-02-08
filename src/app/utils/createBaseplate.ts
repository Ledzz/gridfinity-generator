import { Baseplate } from "../gridfinity/types/baseplate.ts";
import { getId } from "./getId.ts";

export const createBaseplate = (): Baseplate => ({
  id: getId(),
  type: "baseplate",
  width: 1,
  depth: 1,
  hasMagnetHoles: false,
  hasStackableConnectors: true,
});
