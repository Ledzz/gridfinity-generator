import { ManifoldToplevel } from "manifold-3d";
import { range } from "../../gridfinity/utils/range.ts";
import { SIZE } from "../../gridfinity/constants.ts";

export const magnetHoles = (wasm: ManifoldToplevel, { baseWidth, quality }) => {
  const { Manifold, CrossSection } = wasm;
  return Manifold.compose(
    range(4).map((i) => {
      return (
        CrossSection.union(
          CrossSection.circle(6.1 / 2, quality),
          // TODO: angle should be 80 degrees, not 90
          CrossSection.square([6.1 / 2, 6.1 / 2]),
        )
          // TODO: chamfer
          .extrude(2.4)
          .translate(
            SIZE / 2 - baseWidth - 5.05,
            SIZE / 2 - baseWidth - 5.05,
            0,
          )
          .rotate(0, 0, (i * 180) / 2)
      );
    }),
  );
};