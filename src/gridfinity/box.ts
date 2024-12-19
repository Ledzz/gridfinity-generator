import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { baseplate } from "./baseplate.ts";
import {
  rotateX,
  translate,
  translateY,
} from "@jscad/modeling/src/operations/transforms";
import RecursiveArray from "@jscad/modeling/src/utils/recursiveArray";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import { circle, roundedCuboid } from "@jscad/modeling/src/primitives";
import { baseHeight } from "./constants.ts";
import { vectorText } from "@jscad/modeling/src/text";
import { hullChain } from "@jscad/modeling/src/operations/hulls";
import { Label } from "../app/store.ts";

const DEFAULT_FONT_SIZE = 20;

export function box({
  width = 1,
  depth = 1,
  height = 1,
  size = 42,
  wallThickness = 1,
  labels = [],
} = {}) {
  const outerFillet = 3.25; // TODO: Calculate
  const innerFillet = outerFillet - wallThickness; // TODO: Calculate
  const items: RecursiveArray<Geom3> = [];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      items.push(
        translate(
          [(i + 0.5 - width / 2) * size, 0, (j + 0.5 - depth / 2) * size],
          baseplate({ size }),
        ),
      );
    }
  }

  const processedLabels = labels.map((label: Label) => {
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
    return extrudeLinear({ height: 2 }, union(lineSegments));
  });

  return union(
    ...items,
    ...processedLabels,
    translateY(
      baseHeight,
      subtract(
        rotateX(
          -Math.PI / 2,
          extrudeLinear(
            { height: height * 7 },
            roundedRectangle({
              size: [width * size, depth * size],
              roundRadius: outerFillet,
            }),
          ),
        ),
        roundedCuboid({
          size: [
            width * size - wallThickness * 2,
            height * 7 - wallThickness + innerFillet * 2,
            depth * size - wallThickness * 2,
          ],
          center: [0, (height * 7) / 2 + innerFillet + wallThickness, 0],
          roundRadius: innerFillet,
        }),
      ),
    ),
  );
}
