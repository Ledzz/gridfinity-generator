import { DEFAULT_QUALITY, SIZE } from "../../gridfinity/constants.ts";
import { ManifoldToplevel } from "manifold-3d";
import { Vec2 } from "@jscad/modeling/src/maths/vec2";
import { centerHole } from "./centerHole.ts";
import { mapReduce2DWithLink } from "../../gridfinity/utils/range.ts";
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
  const {
    Manifold: { cube, sphere },
    CrossSection,
  } = wasm;
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

      const a = CrossSection.square([SIZE * width, SIZE * depth], true)
        // TODO: chamfer
        .extrude(height + baseHeight);
      const b = mapReduce2DWithLink(a, width, depth, (i, x, y) => {
        const translate = [
          SIZE * (x - (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
          SIZE * (y - (depth % 2 === 0 ? depth / 2 - 0.5 : depth / 2 - 0.5)),
          0,
        ] as const;
        return i
          .subtract(
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
                CrossSection.square([SIZE, SIZE], true)
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
              .translate(translate),
          )
          .add(
            profile(wasm, { quality })
              .translate([0, 0, height])
              .translate(translate),
          );
      });

      return b;
    }
  }
};
