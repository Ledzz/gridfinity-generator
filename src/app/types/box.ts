import { Label } from "./label.ts";

export type Box = {
  id: string;
  type: "box";
  width: number;
  height: number;
  depth: number;
  labels?: Label[];
};
