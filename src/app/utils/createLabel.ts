import { Label } from "../gridfinity/types/label.ts";
import { v4 as uuidv4 } from "uuid";

export const createLabel = (): Label => ({
  id: uuidv4(),
  type: "label",
  fontSize: 8,
  text: "",
  position: "top-center",
  size: "auto",
});
