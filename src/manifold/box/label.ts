import { BoxGeomProps } from "../../gridfinity/bin/box.ts";
import { Manifold, ManifoldToplevel, Vec2 } from "manifold-3d";
import { textToPolygons } from "./textToPolygons.ts";

export const DEFAULT_FONT_SIZE = 6;
const TEXT_HEIGHT = 0.3;
export type LabelGeomProps = {
  text: string;
  fontSize: number;
  position: LabelPosition;
  size: number | "auto" | "full";
  type: "label";
};

type VerticalPosition = "top" | "bottom";
type HorizontalPosition = "left" | "center" | "right";
type LabelPositionString = `${VerticalPosition}-${HorizontalPosition}`;
type LabelPosition = LabelPositionString | Vec2;

export const LABEL_POSITIONS: readonly LabelPositionString[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

const DEFAULT_LABEL_WIDTH = 32;
const LABEL_DEPTH = 10;
const WALL_THICKNESS = 0.3;
const TEXT_PADDING = 4;

export const label = (
  wasm: ManifoldToplevel,
  {
    text,
    position,
    fontSize = DEFAULT_FONT_SIZE,
    size,
  }: Partial<LabelGeomProps>,
  box: Pick<BoxGeomProps, "width" | "height" | "depth" | "quality">,
): Manifold | null => {
  const { Manifold, CrossSection } = wasm;

  const polygons = textToPolygons(text);

  console.log(polygons);

  return CrossSection.ofPolygons(polygons).extrude(1);
};