import { BoxGeomProps } from "../../gridfinity/bin/box.ts";
import { Manifold, ManifoldToplevel, Vec2 } from "manifold-3d";
import { textToPolygons } from "./textToPolygons.ts";
import { baseHeight, LIP_HEIGHT, SIZE } from "../../gridfinity/constants.ts";

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

export const label = async (
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

  const polygons = await textToPolygons(text, fontSize);
  const crossSection = CrossSection.ofPolygons(polygons);
  const { min, max } = crossSection.bounds();

  const textWidth = max[0] - min[0];
  const labelWidth =
    (size === "full"
      ? SIZE * box.width
      : size === "auto"
        ? textWidth + TEXT_PADDING * 2
        : size) ?? DEFAULT_LABEL_WIDTH;

  const body = CrossSection.ofPolygons([
    [0, 0],
    [LABEL_DEPTH, LABEL_DEPTH],
    [0, LABEL_DEPTH],
    [0, 0],
  ])
    .extrude(labelWidth)
    .rotate([90, 0, -90])
    .translate([labelWidth / 2, 0, -LABEL_DEPTH]);

  return crossSection
    .extrude(TEXT_HEIGHT)
    .rotate([180, 0, 0])
    .translate([
      -(max[0] + min[0]) / 2,
      (max[1] + min[1]) / 2 - LABEL_DEPTH / 2 + 1,
      TEXT_HEIGHT,
    ])
    .add(body)
    .translate([0, 0, box.height * 7 + baseHeight - LIP_HEIGHT]);
};
