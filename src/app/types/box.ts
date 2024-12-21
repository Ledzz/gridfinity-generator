import { Label } from "./label.ts";

export type Box = {
  id: string;
  type: "box";
  width: number;
  height: number;
  depth: number;
  wallThickness: number;
  labels?: Label[];
};
