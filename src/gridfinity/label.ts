import { Box, Label } from "../app/store.ts";
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
import { baseHeight } from "./constants.ts";

export const DEFAULT_FONT_SIZE = 8;
const TEXT_HEIGHT = 1;
export const label = ({ text, fontSize = DEFAULT_FONT_SIZE }: Label) => {
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
  const width = 32;
  const depth = 10;
  return union(
    translate(
      [0, 0, depth / 2],
      center(
        {},
        rotate(
          [-Math.PI / 2, 0, 0],
          extrudeLinear({ height: TEXT_HEIGHT }, union(lineSegments)),
        ),
      ),
    ),
    translate(
      [0, -depth, 0],
      rotate(
        [0, -Math.PI / 2, 0],
        translate(
          [0, 0, -width / 2],
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
    ),
  );
};

export const positionedLabel = (
  { position = "top-center", ...props }: Label,
  box: Box,
) => {
  return translate(getPosition(position, box), label(props));
};

function getPosition(position: string, box: Box) {
  switch (position) {
    case "top-center":
      return [0, box.height * 7 + baseHeight, (-box.size * box.depth) / 2];
    default:
      return [0, 0, 0];
  }
}
