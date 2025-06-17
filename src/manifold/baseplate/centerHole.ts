import { Vec2 } from "manifold-3d";
import { BaseplateGeomProps } from "./baseplate.ts";
import { manifold } from "../manifoldModule.ts";

export const centerHole = ({
  width,
  depth,
  height,
  x,
  y,
  hasMagnetHoles,
}: Pick<BaseplateGeomProps, "width" | "depth" | "height" | "hasMagnetHoles"> & {
  x: number;
  y: number;
}) => {
  const points = getPoints({ x, y, width, depth, hasMagnetHoles });
  const { CrossSection } = manifold;
  return new CrossSection(points).extrude(height);
};

function getPoints({
  x,
  y,
  width,
  depth,
  hasMagnetHoles,
}: Pick<BaseplateGeomProps, "width" | "depth" | "hasMagnetHoles"> & {
  x: number;
  y: number;
}): Array<Vec2> {
  const halfSquareSize = 9;
  const add = 9.85;

  return [
    ...(hasMagnetHoles
      ? [[halfSquareSize, -halfSquareSize]]
      : [
          [
            halfSquareSize + (x !== width - 1 ? add : 0),
            -halfSquareSize - (y > 0 ? add : 0),
          ],
        ]),
    ...(x !== width - 1
      ? [
          [halfSquareSize + add, -halfSquareSize],
          [halfSquareSize + add, halfSquareSize],
        ]
      : []),
    ...(hasMagnetHoles
      ? [[halfSquareSize, halfSquareSize]]
      : [
          [
            halfSquareSize + (x !== width - 1 ? add : 0),
            halfSquareSize + (y !== depth - 1 ? add : 0),
          ],
        ]),
    ...(y !== depth - 1
      ? [
          [halfSquareSize, halfSquareSize + add],
          [-halfSquareSize, halfSquareSize + add],
        ]
      : []),

    ...(hasMagnetHoles
      ? [[-halfSquareSize, halfSquareSize]]
      : [
          [
            -halfSquareSize - (x > 0 ? add : 0),
            halfSquareSize + (y !== depth - 1 ? add : 0),
          ],
        ]),
    ...(x !== 0
      ? [
          [-halfSquareSize - add, halfSquareSize],
          [-halfSquareSize - add, -halfSquareSize],
        ]
      : []),
    ...(hasMagnetHoles
      ? [[-halfSquareSize, -halfSquareSize]]
      : [
          [
            -halfSquareSize - (x > 0 ? add : 0),
            -halfSquareSize - (y > 0 ? add : 0),
          ],
        ]),
    ...(y !== 0
      ? [
          [-halfSquareSize, -halfSquareSize - add],
          [halfSquareSize, -halfSquareSize - add],
        ]
      : []),
  ] as Vec2[];
}
