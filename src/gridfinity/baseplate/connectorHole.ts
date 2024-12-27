import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { SIZE } from "../constants.ts";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { polygon } from "@jscad/modeling/src/primitives";

const connectorPoly = [
  [3, 0],
  [3, 3],
  [7, 6],
  [7, 9],
  [-7, 9],
  [-7, 6],
  [-3, 3],
  [-3, 0],
];

const connectorHole = ({
  index, // right, top, left, bottom
  height,
}: {
  index: number;
  height: number;
}) =>
  rotate(
    [0, 0, (index * Math.PI) / 2],
    translate(
      [SIZE / 2, 0, 0],
      rotate(
        [0, 0, Math.PI / 2],
        extrudeLinear(
          { height },
          polygon({
            points: connectorPoly,
          }),
        ),
      ),
    ),
  );

export const connectorHoles = ({
  x,
  y,
  width,
  depth,
  height,
}: {
  x: number;
  y: number;
  width: number;
  depth: number;
  height: number;
}) => {
  const ca: number[] = [];
  if (x === 0) {
    ca.push(2);
  }
  if (x === width - 1) {
    ca.push(0);
  }
  if (y === 0) {
    ca.push(3);
  }
  if (y === depth - 1) {
    ca.push(1);
  }
  return ca.map((index) => connectorHole({ index, height }));
};
