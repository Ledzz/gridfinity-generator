import { LabelGeomProps } from "../../../gridfinity/bin/label.ts";

export type Label = LabelGeomProps & {
  id: string;
  type: "label";
};
