import { Manifold, Vec2 } from "manifold-3d";
import { textToPolygons } from "./textToPolygons.ts";
import { boxInnerContent } from "./boxInnerContent.ts";
import { BoxGeomProps } from "./box.ts";
import { baseHeight, LIP_HEIGHT, SIZE } from "../constants.ts";
import { manifold } from "../manifoldModule.ts";
import { hashUUID } from "../utils/hashUUID.ts";

export const DEFAULT_FONT_SIZE = 6;
const TEXT_HEIGHT = 0.3;
export type LabelGeomProps = {
  id: string;
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
  {
    id,
    text,
    position,
    fontSize = DEFAULT_FONT_SIZE,
    size,
  }: Partial<LabelGeomProps>,
  box: Pick<BoxGeomProps, "width" | "height" | "depth" | "quality">,
): Promise<Manifold[] | null> => {
  if (!position) {
    return null;
  }
  const { CrossSection } = manifold;

  const polygons = await textToPolygons(text ?? "", fontSize);
  const crossSection = CrossSection.ofPolygons(polygons);
  const { min, max } = crossSection.bounds();

  const textWidth = max[0] - min[0];
  const labelWidth =
    (size === "full"
      ? SIZE * box.width
      : size === "auto"
        ? textWidth + TEXT_PADDING * 2
        : size) ?? DEFAULT_LABEL_WIDTH;

  const p = getPosition({ position, box, labelWidth });
  const shouldRotate =
    typeof position === "string" && position.includes("bottom");

  const body = CrossSection.ofPolygons([
    [0, 0],
    [LABEL_DEPTH, LABEL_DEPTH],
    [0, LABEL_DEPTH],
    [0, 0],
  ])
    .extrude(labelWidth)
    .rotate([90, 0, -90])
    .translate([labelWidth / 2, 0, -LABEL_DEPTH]);

  const translateAndIntersect = (m: Manifold) =>
    m
      .translate([
        p[0],
        p[1] + LABEL_DEPTH,
        box.height * 7 + baseHeight - LIP_HEIGHT,
      ])
      .intersect(boxInnerContent(box));

  return manifold.Manifold.compose([
    translateAndIntersect(
      crossSection
        .extrude(TEXT_HEIGHT)
        .rotate([180, 0, 0])
        .translate([
          -(max[0] + min[0]) / 2,
          (max[1] + min[1]) / 2 - LABEL_DEPTH / 2 + (shouldRotate ? 1 : -1),
          TEXT_HEIGHT,
        ]),
    ),
    translateAndIntersect(body),
  ]).setProperties(1, (newProp, position, oldProp) => {
    newProp[0] = hashUUID(id);
  });
};

function getPosition({
  position,
  box,
  labelWidth,
}: {
  position: LabelPosition;
  box: Pick<BoxGeomProps, "width" | "depth">;
  labelWidth: number;
}): Vec2 {
  const h = {
    left: (-SIZE * box.width + labelWidth) / 2 + WALL_THICKNESS,
    center: 0,
    right: (SIZE * box.width - labelWidth) / 2 - WALL_THICKNESS,
  } as const;
  const v = {
    top: (SIZE * box.depth) / 2 - LABEL_DEPTH - WALL_THICKNESS,
    bottom: -(SIZE * box.depth) / 2,
  } as const;

  if (typeof position === "string") {
    const [vertical, horizontal] = position.split("-") as [
      VerticalPosition,
      HorizontalPosition,
    ];
    return [h[horizontal], v[vertical]];
  } else {
    return position;
  }
}
