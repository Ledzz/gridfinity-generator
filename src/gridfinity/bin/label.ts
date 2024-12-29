import { circle, polygon } from "@jscad/modeling/src/primitives";
import { vectorText } from "@jscad/modeling/src/text";
import { hullChain } from "@jscad/modeling/src/operations/hulls";
import {
  center,
  rotate,
  translate,
} from "@jscad/modeling/src/operations/transforms";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { union } from "@jscad/modeling/src/operations/booleans";
import { baseHeight, SIZE } from "../constants.ts";
import { BoxGeomProps } from "./box.ts";

export const DEFAULT_FONT_SIZE = 8;
const TEXT_HEIGHT = 1;

export type LabelGeomProps = {
  text: string;
  fontSize: number;
  position: LabelPosition;
  size: number | "auto";
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

const LABEL_WIDTH = 32;
const LABEL_DEPTH = 10;
const LABEL_MARGIN = 10;
const LIP_HEIGHT = 8.4;

export const label = (
  { text, position, fontSize = DEFAULT_FONT_SIZE }: Partial<LabelGeomProps>,

  box: Pick<BoxGeomProps, "width" | "height" | "depth">,
) => {
  if (!text || !position) {
    return [];
  }
  const lineRadius = 0.5;
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

  const h = {
    left: (-SIZE * box.width + LABEL_WIDTH) / 2 + LABEL_MARGIN,
    center: 0,
    right: (SIZE * box.width - LABEL_WIDTH) / 2 - LABEL_MARGIN,
  } as const;
  const v = {
    top: (SIZE * box.depth) / 2 - LABEL_DEPTH,
    bottom: -(SIZE * box.depth) / 2,
  } as const;

  return translate(
    [
      h[horizontal],
      v[vertical],
      box.height * 7 + baseHeight - LIP_HEIGHT + TEXT_HEIGHT,
    ],
    union(
      center(
        {
          relativeTo: [0, LABEL_DEPTH / 2, TEXT_HEIGHT / 2],
        },
        extrudeLinear({ height: TEXT_HEIGHT }, union(lineSegments)),
      ),
      center(
        {
          relativeTo: [0, LABEL_DEPTH / 2, -LABEL_DEPTH / 2],
        },
        rotate(
          [0, Math.PI / 2, vertical === "bottom" ? Math.PI : 0],
          extrudeLinear(
            { height: LABEL_WIDTH },
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
  );
};
