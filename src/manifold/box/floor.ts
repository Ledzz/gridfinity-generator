import { Vec2 } from "manifold-3d";
import { roundedRectangle } from "../roundedRectangle.ts";
import { sweepRounded } from "../sweepRounded.ts";
import { DEFAULT_QUALITY, FILLET, SIZE, TOLERANCE } from "../constants.ts";
import { BoxGeomProps } from "./box.ts";
import { mapReduce2D, range } from "../utils/range.ts";
import { manifold } from "../manifoldModule.ts";

const points = [
  [0, 0], // Innermost bottom point
  [0.8, 0.8], // Up and out at a 45 degree angle
  [0.8, 2.6], // Straight up
  [2.95, 4.75], // Up and out at a 45 degree angle
  [2.95, 5], // Up and out at a 45 degree angle
  [0, 5],
] as Vec2[];

export function floor({
  width,
  depth,
  quality = DEFAULT_QUALITY,
  hasMagnetHoles,
}: Pick<BoxGeomProps, "quality" | "width" | "depth" | "hasMagnetHoles">) {
  const { Manifold, CrossSection } = manifold;
  const baseWidth = Math.max(...points.map((point) => point[0]));
  const baseHeight = Math.max(...points.map((point) => point[1]));
  const baseSize = SIZE - baseWidth * 2 - TOLERANCE;
  const r = 5.86 / 2;
  const cachedMagnetHole = Manifold.union([
    CrossSection.union([
      CrossSection.circle(1.25, quality),
      CrossSection.square([4.28, 2.5], true).translate([4.28 / 2, 0]),
    ])
      .extrude(2.25)
      .translate([6.07, 13, 0]),
    CrossSection.union([
      CrossSection.circle(r, quality),
      CrossSection.ofPolygons([
        [5.6, r],
        [0, r],
        [0, -r],
        [3.5, -r],
        [3.5 + 2.1, -r - 1.47],
      ]),
    ])
      .extrude(1.9)
      .translate([13, 13, 0.35]),
  ]);

  const magnetHoles = hasMagnetHoles
    ? Manifold.union(
        range(4).map((i) => cachedMagnetHole.rotate([0, 0, i * 90])),
      )
    : Manifold.union([]);

  const cachedBase = roundedRectangle({
    size: [baseSize, baseSize],
    radius: FILLET,
    quality,
  })
    .extrude(baseHeight)
    .add(sweepRounded(points, 35.6, FILLET, quality))
    .subtract(magnetHoles);

  const bases = mapReduce2D(width, depth, (i, j) =>
    cachedBase.translate([
      (i + 0.5 - width / 2) * SIZE,
      (j + 0.5 - depth / 2) * SIZE,
      0,
    ]),
  );

  return Manifold.compose([
    ...bases,
    roundedRectangle({
      size: [width * SIZE - TOLERANCE, depth * SIZE - TOLERANCE],
      radius: FILLET + baseWidth,
      quality,
    })
      .extrude(1)
      .translate([0, 0, baseHeight]),
  ]);
}
