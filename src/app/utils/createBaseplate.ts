import { Baseplate } from "../types/baseplate.ts";
import { v4 as uuidv4 } from "uuid";

export const createBaseplate = (): Baseplate => ({
  id: uuidv4(),
  type: "baseplate",
  width: 1,
  depth: 1,
  hasMagnetHoles: false,
});
