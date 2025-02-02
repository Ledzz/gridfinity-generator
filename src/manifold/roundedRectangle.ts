import { ManifoldToplevel, Vec2 } from "manifold-3d";
import { DEFAULT_QUALITY } from "./constants.ts";

export const roundedRectangle = (
  wasm: ManifoldToplevel,
  {
    quality = DEFAULT_QUALITY,
    size,
    radius,
  }: { quality?: number; size: Vec2; radius: number },
) => {
  const { CrossSection } = wasm;
  return CrossSection.square(
    [size[0] - radius * 2, size[1] - radius * 2],
    true,
  ).offset(radius, "Round", 0, quality);
};
