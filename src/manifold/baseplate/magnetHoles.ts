import { extrudeWithChamfer } from "../extrudeWithChamfer.ts";
import { DEFAULT_QUALITY, SIZE } from "../constants.ts";
import { range } from "../utils/range.ts";
import { manifold } from "../manifoldModule.ts";

export const magnetHoles = ({
  baseWidth,
  quality = DEFAULT_QUALITY,
}: {
  baseWidth: number;
  quality: number;
}) => {
  const { Manifold, CrossSection } = manifold;
  return Manifold.compose(
    range(4).map((i) => {
      return extrudeWithChamfer(
        { height: 2.4, chamfer: 0.6 },
        CrossSection.union(
          CrossSection.circle(6.1 / 2, quality),
          // TODO: angle should be 80 degrees, not 90
          CrossSection.square([6.1 / 2, 6.1 / 2]),
        ),
      )
        .translate(SIZE / 2 - baseWidth - 5.05, SIZE / 2 - baseWidth - 5.05, 0)
        .rotate(0, 0, (i * 180) / 2);
    }),
  );
};
