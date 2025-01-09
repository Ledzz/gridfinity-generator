import { ManifoldToplevel } from "manifold-3d";
import { range } from "../gridfinity/utils/range.ts";
import { SIZE } from "../gridfinity/constants.ts";

export const magnetHoles = (wasm: ManifoldToplevel, { baseWidth, quality }) => {
  // return wasm.Manifold.compose(range(4).map((i) =>
  //     rotate(
  //         [0, 0, (i * Math.PI) / 2],
  //         translate(
  //             [
  //                 SIZE / 2 - baseWidth - 5.05,
  //                 SIZE / 2 - baseWidth - 5.05,
  //                 0,
  //             ],
  //             extrudeWithChamfer(
  //                 { height: 2.4, chamfer: 0.6 },
  //                 union(
  //                     circle({ radius: 6.1 / 2, segments: quality }),
  //                     // TODO: angle should be 80 degrees, not 90
  //                     rectangle({
  //                         size: [6.1 / 2, 6.1 / 2],
  //                         center: [6.1 / 4, 6.1 / 4],
  //                     }),
  //                 ),
  //             ),
  //         ),
  //     ),
  // ))
  const { Manifold, CrossSection } = wasm;
  return Manifold.compose(
    range(4).map((i) => {
      return (
        CrossSection.union(
          CrossSection.circle(6.1 / 2, quality),
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
