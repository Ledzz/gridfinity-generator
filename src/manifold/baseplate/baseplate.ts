import { DEFAULT_QUALITY, SIZE } from "../../gridfinity/constants.ts";
import { ManifoldToplevel, Vec2 } from "manifold-3d";
import { centerHole } from "./centerHole.ts";
import { connectorHoles } from "./connectorHole.ts";
import { magnetHoles } from "./magnetHoles.ts";
import { mapReduce2D } from "../../gridfinity/utils/range.ts";
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
  switch (style) {
    case "refined-lite": {
      const points = [
        [0, 0], // Innermost bottom point
        [0.7, 0.7], // Up and out at a 45 degree angle
        [0.7, 2.5], // Straight up
        [2.6, 4.4], // Up and out at a 45 degree angle
        [2.85, 4.4], // Top shelf
        [2.85, 0], // Straight down
      ] as Vec2[];

      points.reverse();

      const baseWidth = Math.max(...points.map((point) => point[0]));
      const baseHeight = Math.max(...points.map((point) => point[1]));

      return (
        CrossSection.square([SIZE * width, SIZE * depth], true)
          // TODO: chamfer
          .extrude(height + baseHeight)
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
                    // TODO: RoundedRectangle
                    CrossSection.square(
                      [
                        SIZE - (1.15 + baseWidth) * 2,
                        SIZE - (1.15 + baseWidth) * 2,
                      ],
                      true,
                    )
                      .offset(1.15 + baseWidth, "Round")
                      .extrude(baseHeight)
                      .translate([0, 0, height]),
                  )
                  // TODO: hasConnectorHoles
                  .add(connectorHoles(wasm, { width, depth, height, x, y }))
                  // TODO: hasMagnetHoles
                  .add(
                    magnetHoles(wasm, {
                      baseWidth,
                      quality,
                    }),
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
