import { DEFAULT_QUALITY } from "../../gridfinity/constants.ts";
import { ManifoldToplevel } from "manifold-3d";
import { BoxItemGeomProps } from "../../gridfinity/bin/box-item.ts";

export type BoxGeomProps = {
  width: number;
  depth: number;
  height: number;
  size: number;
  items: BoxItemGeomProps[];
  profileFillet: number;
  quality: number;
  hasMagnetHoles: boolean;
};

export const box = (
  wasm: ManifoldToplevel,
  {
    width = 1,
    depth = 1,
    height = 1,
    items = [],
    quality = DEFAULT_QUALITY,
    hasMagnetHoles = false,
  }: Partial<BoxGeomProps> = {},
) => {
  return wasm.Manifold.cube([42, 42, 42], true);
};
