import { Label } from "../gridfinity/types/label.ts";
import { DEFAULT_FONT_SIZE } from "../../manifold/box/label.ts";
import { getId } from "./getId.ts";

export const createLabel = (): Label => ({
  id: getId(),
  type: "label",
  fontSize: DEFAULT_FONT_SIZE,
  text: "",
  position: "top-center",
  size: "full",
});
