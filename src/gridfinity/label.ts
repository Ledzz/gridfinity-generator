import { Label } from "../app/store.ts";
import { circle } from "@jscad/modeling/src/primitives";
import { vectorText } from "@jscad/modeling/src/text";
import { hullChain } from "@jscad/modeling/src/operations/hulls";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { union } from "@jscad/modeling/src/operations/booleans";

export const DEFAULT_FONT_SIZE = 20;
const TEXT_HEIGHT = 2;
export const label = (label: Label) => {
  if (!label.text) {
    return;
  }
  const lineRadius = 2 / 2;
  const lineCorner = circle({ radius: lineRadius });
  const lineSegmentPointArrays = vectorText({
    x: 0,
    y: 0,
    input: label.text,
    height: label.fontSize ?? DEFAULT_FONT_SIZE,
  });
  const lineSegments = lineSegmentPointArrays.map((segmentPoints) =>
    hullChain(segmentPoints.map((point) => translate(point, lineCorner))),
  );
  return extrudeLinear({ height: TEXT_HEIGHT }, union(lineSegments));
};
