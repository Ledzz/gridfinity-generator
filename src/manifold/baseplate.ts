import { DEFAULT_QUALITY } from "../gridfinity/constants.ts";
import { Manifold } from "manifold-3d/manifold-encapsulated-types";

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
  Manifold: Manifold,
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
  switch (style) {
    case "refined-lite": {
      const { cube, sphere } = Manifold;

      return cube([100, 100, 100], true);
    }
  }
};
