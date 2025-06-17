import { SIZE } from "../constants.ts";
import { manifold } from "../manifoldModule.ts";
import { connectorPoly } from "../connectorPoly.ts";

const connectorHole = ({
  index, // right, top, left, bottom
  height,
}: {
  index: number;
  height: number;
}) => {
  const { CrossSection } = manifold;
  return new CrossSection(connectorPoly)
    .extrude(height)
    .rotate([0, 0, 180 / 2])
    .translate([SIZE / 2, 0, 0])
    .rotate([0, 0, (index * 180) / 2]);
};

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
  return manifold.Manifold.compose(
    ca.map((index) => connectorHole({ index, height })),
  );
};
