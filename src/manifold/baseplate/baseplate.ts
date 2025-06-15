import { profileBaseHeight, profileBaseWidth } from "./constants.ts";
import { centerHole } from "./centerHole.ts";
import { connectorHoles } from "./connectorHole.ts";
import { magnetHoles } from "./magnetHoles.ts";
import { profile } from "./profile.ts";
import { roundedRectangle } from "../roundedRectangle.ts";
import { DEFAULT_QUALITY, SIZE } from "../constants.ts";
import { mapReduce2D } from "../utils/range.ts";
import { manifold } from "../manifoldModule.ts";

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

export const baseplate = ({
  style = "refined-lite",
  height = 3,
  hasMagnetHoles = false,
  hasStackableConnectors = false,
  width = 1,
  depth = 1,
  quality = DEFAULT_QUALITY,
}: Partial<BaseplateGeomProps> = {}) => {
  const { Manifold, CrossSection } = manifold;
  const cachedProfile = profile({ quality }).translate([0, 0, height]);
  const cachedMagnetHoles = magnetHoles({
    baseWidth: profileBaseWidth,
    quality,
  });
  const cachedHollowInside = roundedRectangle({
    quality,
    size: [SIZE, SIZE],
    radius: 1.15 + profileBaseWidth,
  })
    .extrude(profileBaseHeight)
    .translate([0, 0, height]);
  const empty = Manifold.union([]);
  switch (style) {
    case "refined-lite": {
      return [
        Manifold.compose([
          ...mapReduce2D(width, depth, (x, y) =>
            Manifold.compose([
              // Base
              CrossSection.square([SIZE, SIZE], true)
                .extrude(height + profileBaseHeight)
                .subtract(
                  centerHole({
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
                    ? connectorHoles({ width, depth, height, x, y })
                    : empty,
                )
                .subtract(hasMagnetHoles ? cachedMagnetHoles : empty),
              cachedProfile,
            ]).translate([
              SIZE *
                (x - (width % 2 === 0 ? width / 2 - 0.5 : width / 2 - 0.5)),
              SIZE *
                (y - (depth % 2 === 0 ? depth / 2 - 0.5 : depth / 2 - 0.5)),
              0,
            ]),
          ),
        ]),
      ];
    }
  }
};
