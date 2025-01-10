import { ManifoldToplevel, SimplePolygon } from "manifold-3d";
import { DEFAULT_QUALITY } from "../gridfinity/constants.ts";
import { range } from "../gridfinity/utils/range.ts";

export const sweepRounded = (
  wasm: ManifoldToplevel,
  profile: SimplePolygon,
  size: number | [number, number],
  fillet: number,
  quality: number = DEFAULT_QUALITY,
) => {
  const { CrossSection, Manifold } = wasm;
  const width = Array.isArray(size) ? size[0] : size;
  const depth = Array.isArray(size) ? size[1] : size;

  const shape = CrossSection.ofPolygons(profile);

  return Manifold.compose(
    range(4).map((i) => {
      const x = i % 2 === 0 ? width / 2 : depth / 2;
      const z = i % 2 === 1 ? -width / 2 + fillet : -depth / 2 + fillet;
      const extrude = (i % 2 === 1 ? width : depth) - fillet * 2;
      const angle = shape
        .translate([fillet, 0])
        .revolve(quality / 4, 90)
        .rotate([-90, 0, 0])
        .translate([-fillet, 0, 0]);

      return shape
        .extrude(extrude)
        .add(angle)
        .translate([x, 0, z])
        .rotate([180 / 2, 0, (i * 180) / 2]);
    }),
  );
};
