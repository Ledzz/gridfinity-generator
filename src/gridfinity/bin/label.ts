import { circle, polygon } from "@jscad/modeling/src/primitives";
import { vectorText } from "@jscad/modeling/src/text";
import { hullChain } from "@jscad/modeling/src/operations/hulls";
import {
  center,
  rotate,
  translate,
} from "@jscad/modeling/src/operations/transforms";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { intersect, union } from "@jscad/modeling/src/operations/booleans";
import { baseHeight, LIP_HEIGHT, SIZE } from "../constants.ts";
import { BoxGeomProps } from "./box.ts";
import { boxInnerContent } from "./boxInnerContent.ts";
import RecursiveArray from "@jscad/modeling/src/utils/recursiveArray";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { colorize } from "@jscad/modeling/src/colors";

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
type LabelPosition = `${VerticalPosition}-${HorizontalPosition}`;

export const LABEL_POSITIONS: readonly LabelPosition[] = [
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
  {
    text,
    position,
    fontSize = DEFAULT_FONT_SIZE,
    size,
  }: Partial<LabelGeomProps>,
  box: Pick<BoxGeomProps, "width" | "height" | "depth">,
): RecursiveArray<Geom3> | null => {
  if (!text || !position) {
    return [];
  }
  const lineRadius = fontSize / 20;
  const lineCorner = circle({ radius: lineRadius });
  const lineSegmentPointArrays = vectorText({
    input: text,
    height: fontSize / 2,
  });
  const lineSegments = lineSegmentPointArrays.map((segmentPoints) =>
    hullChain(segmentPoints.map((point) => translate(point, lineCorner))),
  );
  if (!lineSegments.length) {
    return null;
  }
  const [vertical, horizontal] = position.split("-") as [
    VerticalPosition,
    HorizontalPosition,
  ];

  let textWidth = 0;

  lineSegments.forEach((segment) => {
    segment.sides.forEach((side) => {
      side.forEach((point) => {
        textWidth = Math.max(textWidth, point[0]);
      });
    });
  });

  const labelWidth =
    (size === "full"
      ? SIZE * box.width
      : size === "auto"
        ? textWidth + TEXT_PADDING * 2
        : size) ?? DEFAULT_LABEL_WIDTH;

  const h = {
    left: (-SIZE * box.width + labelWidth) / 2 + WALL_THICKNESS,
    center: 0,
    right: (SIZE * box.width - labelWidth) / 2 - WALL_THICKNESS,
  } as const;
  const v = {
    top: (SIZE * box.depth) / 2 - LABEL_DEPTH - WALL_THICKNESS,
    bottom: -(SIZE * box.depth) / 2,
  } as const;

  return [
    translate(
      [
        h[horizontal],
        v[vertical],
        box.height * 7 + baseHeight - LIP_HEIGHT - TEXT_HEIGHT,
      ],
      center(
        {
          relativeTo: [0, LABEL_DEPTH / 2 - 1, TEXT_HEIGHT / 2],
        },
        colorize(
          [0.1, 0.1, 0.1, 1],
          extrudeLinear({ height: TEXT_HEIGHT }, union(lineSegments)),
        ),
      ),
    ),
    intersect(
      boxInnerContent(box),
      translate(
        [
          h[horizontal],
          v[vertical],
          box.height * 7 + baseHeight - LIP_HEIGHT - TEXT_HEIGHT,
        ],
        center(
          {
            relativeTo: [0, LABEL_DEPTH / 2, -LABEL_DEPTH / 2],
          },
          rotate(
            [0, Math.PI / 2, vertical === "bottom" ? Math.PI : 0],
            extrudeLinear(
              { height: labelWidth },
              polygon({
                points: [
                  [0, 0],
                  [LABEL_DEPTH, LABEL_DEPTH],
                  [0, LABEL_DEPTH],
                  [0, 0],
                ],
              }),
            ),
          ),
        ),
      ),
    ),
  ];
};
