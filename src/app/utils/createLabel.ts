import { Label } from "../gridfinity/types/label.ts";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_FONT_SIZE } from "../../gridfinity/bin/label.ts";

export const createLabel = (): Label => ({
  id: uuidv4(),
  type: "label",
  fontSize: DEFAULT_FONT_SIZE,
  text: "",
  position: "top-center",
  size: "full",
});
