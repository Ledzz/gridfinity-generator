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
import { Vec3 } from "@jscad/modeling/src/maths/vec3";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";

export const DEFAULT_FONT_SIZE = 8;
const TEXT_HEIGHT = 1;

export type LabelGeomProps = {
  text: string;
  fontSize: number;
};

type LabelPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type PositionedLabelGeomProps = LabelGeomProps & {
  position: LabelPosition;
};

export const label = ({
  text,
  fontSize = DEFAULT_FONT_SIZE,
}: Partial<LabelGeomProps>) => {
  if (!text) {
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
  const width = 32;
  const depth = 10;
  return union(
    center(
      { relativeTo: [0, depth / 2, TEXT_HEIGHT / 2] },
      extrudeLinear({ height: TEXT_HEIGHT }, union(lineSegments)),
    ),
    translate(
      [-width / 2, 0, 0],
      rotate(
        [0, Math.PI / 2, 0],
        extrudeLinear(
          { height: width },
          polygon({
            points: [
              [0, 0],
              [depth, depth],
              [0, depth],
              [0, 0],
            ],
          }),
        ),
      ),
    ),
  );
};

export const positionedLabel = (
  { position = "top-center", ...props }: Partial<PositionedLabelGeomProps>,
  box: Pick<BoxGeomProps, "width" | "height" | "depth">,
): Geom3 | null => {
  if (!props.text) {
    return null;
  }
  const l = label(props);
  // TODO: Label should be cut by box inner
  return l
    ? (translate(getPosition(position, box), l) as unknown as Geom3)
    : null;
};

function getPosition(
  position: LabelPosition,
  box: Pick<BoxGeomProps, "width" | "height" | "depth">,
): Vec3 {
  switch (position) {
    case "top-center":
      return [0, (SIZE * box.depth) / 2 - 10, box.height * 7 + baseHeight];
    default:
      return [0, 0, 0];
  }
}
