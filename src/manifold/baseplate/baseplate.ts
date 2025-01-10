import { DEFAULT_QUALITY, SIZE } from "../../gridfinity/constants.ts";
import { ManifoldToplevel, Vec3 } from "manifold-3d";
import { profileBaseHeight, profileBaseWidth } from "./constants.ts";
import { mapReduce2D } from "../../gridfinity/utils/range.ts";
import { centerHole } from "./centerHole.ts";
import { connectorHoles } from "./connectorHole.ts";
import { magnetHoles } from "./magnetHoles.ts";
import { profile } from "./profile.ts";

export interface BaseplateGeomProps {
  style: "refined-lite";
  fillet: number;
  size: number;
  height: number;
  hasMagnetHoles: boolean;
  hasStackableConnectors: boolean;
  width: number;
  depth: number;
  quality: number;
}

export const baseplate = (
  wasm: ManifoldToplevel,
  {
    style = "refined-lite",
    height = 3,
    hasMagnetHoles = false,
    hasStackableConnectors = false,
    width = 1,
    depth = 1,
    quality = DEFAULT_QUALITY,
  }: Partial<BaseplateGeomProps> = {},
) => {
  const { Manifold, CrossSection } = wasm;
  const cachedProfile = profile(wasm, { quality }).translate([0, 0, height]);
  const cachedMagnetHoles = magnetHoles(wasm, {
    baseWidth: profileBaseWidth,
    quality,
  });
  const cachedHollowInside = CrossSection.square(
    [
      SIZE - (1.15 + profileBaseWidth) * 2,
      SIZE - (1.15 + profileBaseWidth) * 2,
    ],
    true,
  )
    .offset(1.15 + profileBaseWidth, "Round", 0, quality)
    .extrude(profileBaseHeight)
    .translate([0, 0, height]);
  const empty = Manifold.union([]);
  switch (style) {
    case "refined-lite": {
      return Manifold.compose([
        ...mapReduce2D(width, depth, (x, y) => {
          const translate = [
            SIZE * (x - (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
            SIZE * (y - (depth % 2 === 0 ? depth / 2 - 0.5 : depth / 2 - 0.5)),
            0,
          ] as Vec3;
          return Manifold.compose([
            CrossSection.square([SIZE, SIZE], true)
              // TODO: chamfer
              .extrude(height + profileBaseHeight)
              .subtract(
                centerHole(wasm, {
                  width,
                  depth,
                  height,
                  x,
                  y,
                  hasMagnetHoles,
                }),
              )
              // Hollow inside
              .subtract(cachedHollowInside)
              .subtract(
                hasStackableConnectors
                  ? connectorHoles(wasm, { width, depth, height, x, y })
                  : empty,
              )
              .subtract(hasMagnetHoles ? cachedMagnetHoles : empty),
            cachedProfile,
          ]).translate(translate);
        }),
      ]);
    }
  }
};
