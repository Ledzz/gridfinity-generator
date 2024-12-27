import { cuboid } from "@jscad/modeling/src/primitives";

export const centerHole = ({ width, depth, height, x, y }) => {
  const squareSize = 17.4;
  const add = 9.45;

  let w = squareSize;
  let h = squareSize;
  let cx = 0;
  let cy = 0;

  if (x !== 0) {
    w += add;
    cx -= add / 2;
  }
  if (x !== width - 1) {
    w += add;
    cx += add / 2;
  }
  if (y !== 0) {
    h += add;
    cy -= add / 2;
  }
  if (y !== depth - 1) {
    h += add;
    cy += add / 2;
  }

  return cuboid({
    center: [cx, cy, height / 2],
    size: [w, h, height],
  });
};
