import { ManifoldToplevel, Vec3 } from "manifold-3d";
import { profileBaseHeight, profileBaseWidth } from "./constants.ts";
import { centerHole } from "./centerHole.ts";
import { connectorHoles } from "./connectorHole.ts";
import { magnetHoles } from "./magnetHoles.ts";
import { profile } from "./profile.ts";
import { extrudeWithChamfer } from "../extrudeWithChamfer.ts";
import { roundedRectangle } from "../roundedRectangle.ts";
import { DEFAULT_QUALITY, SIZE } from "../constants.ts";
import { mapReduce2D } from "../utils/range.ts";

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
  const cachedHollowInside = roundedRectangle(wasm, {
    quality,
    size: [SIZE, SIZE],
    radius: 1.15 + profileBaseWidth,
  })
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
            extrudeWithChamfer(
              { height: height + profileBaseHeight, chamfer: -0.6 },
              CrossSection.square([SIZE, SIZE], true),
            )
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
