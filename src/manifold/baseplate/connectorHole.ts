import { ManifoldToplevel, Vec2 } from "manifold-3d";
import { SIZE } from "../constants.ts";

const connectorPoly = [
  [3, 0],
  [3, 3],
  [7, 6],
  [7, 9],
  [-7, 9],
  [-7, 6],
  [-3, 3],
  [-3, 0],
] as Vec2[];

const connectorHole = (
  wasm: ManifoldToplevel,
  {
    index, // right, top, left, bottom
    height,
  }: {
    index: number;
    height: number;
  },
) => {
  const { CrossSection } = wasm;
  return new CrossSection(connectorPoly)
    .extrude(height)
    .rotate([0, 0, 180 / 2])
    .translate([SIZE / 2, 0, 0])
    .rotate([0, 0, (index * 180) / 2]);
};

export const connectorHoles = (
  wasm: ManifoldToplevel,
  {
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
  },
) => {
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
  return wasm.Manifold.compose(
    ca.map((index) => connectorHole(wasm, { index, height })),
  );
};
