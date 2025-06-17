import { SIZE } from "../constants.ts";
import { manifold } from "../manifoldModule.ts";
import { connectorPoly } from "../connectorPoly.ts";
import { range } from "../utils/range.ts";

export interface BaseplateExtendGeomProps {
  width: number;
  depth: number;
}

const height = 2.8;
const gap = 0.2;

const connectorCrossSection = () => {
  const { CrossSection } = manifold;
  return new CrossSection(connectorPoly);
};

export const baseplateExtend = ({
  width = 1,
  depth = 10,
}: Partial<BaseplateExtendGeomProps> = {}) => {
  const { Manifold, CrossSection } = manifold;
  if (depth < 12) {
    const connectors = Manifold.compose(
      range(width).map((i) =>
        connectorCrossSection()
          .offset(-gap)
          .extrude(height)
          .rotate([0, 0, 180])
          .translate([
            SIZE * (i - (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
            gap,
            0,
          ]),
      ),
    );

    return CrossSection.square([SIZE * width, depth])
      .extrude(height)
      .translate([(-SIZE * width) / 2, 0, 0])
      .add(connectors);
  } else {
    const connectorHoles = Manifold.compose(
      range(width).map((i) =>
        connectorCrossSection()
          .extrude(height)
          .translate([
            SIZE * (i - (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
            0,
            0,
          ])
          .translate([0, 0, 0]),
      ),
    );

    return CrossSection.square([SIZE * width, depth])
      .extrude(height)
      .translate([(-SIZE * width) / 2, 0, 0])
      .subtract(connectorHoles);
  }
};
