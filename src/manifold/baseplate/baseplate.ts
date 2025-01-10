import { DEFAULT_QUALITY, SIZE } from "../../gridfinity/constants.ts";
import { ManifoldToplevel } from "manifold-3d";
import { centerHole } from "./centerHole.ts";
import { mapReduce2D } from "../../gridfinity/utils/range.ts";
import { profile } from "./profile.ts";
import { profileBaseHeight, profileBaseWidth } from "./constants.ts";
import { connectorHoles } from "./connectorHole.ts";
import { magnetHoles } from "./magnetHoles.ts";

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
  switch (style) {
    case "refined-lite": {
      return (
        CrossSection.square([SIZE * width, SIZE * depth], true)
          // TODO: chamfer
          .extrude(height + profileBaseHeight)
          .subtract(
            Manifold.union(
              mapReduce2D(width, depth, (x, y) =>
                centerHole(wasm, {
                  width,
                  depth,
                  height,
                  x,
                  y,
                  hasMagnetHoles,
                })
                  // Hollow inside
                  .add(
                    CrossSection.square(
                      [
                        SIZE - (1.15 + profileBaseWidth) * 2,
                        SIZE - (1.15 + profileBaseWidth) * 2,
                      ],
                      true,
                    )
                      .offset(1.15 + profileBaseWidth, "Round")
                      .extrude(profileBaseHeight)
                      .translate([0, 0, height]),
                  )
                  .add(
                    hasStackableConnectors
                      ? connectorHoles(wasm, { width, depth, height, x, y })
                      : Manifold.union([]),
                  )
                  .add(
                    hasMagnetHoles
                      ? magnetHoles(wasm, {
                          baseWidth: profileBaseWidth,
                          quality,
                        })
                      : Manifold.union([]),
                  )
                  .translate([
                    SIZE *
                      (x -
                        (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
                    SIZE *
                      (y -
                        (depth % 2 === 0 ? depth / 2 - 0.5 : depth / 2 - 0.5)),
                    0,
                  ]),
              ),
            ),
          )
          .add(
            Manifold.union(
              mapReduce2D(width, depth, (x, y) =>
                profile(wasm, { quality }).translate([
                  SIZE *
                    (x - (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
                  SIZE *
                    (y - (depth % 2 === 0 ? depth / 2 - 0.5 : depth / 2 - 0.5)),
                  height,
                ]),
              ),
            ),
          )
      );
    }
  }
};
