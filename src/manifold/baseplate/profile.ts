import { ManifoldToplevel } from "manifold-3d";
import { sweepRounded } from "../sweepRounded.ts";
import { DEFAULT_QUALITY, SIZE } from "../../gridfinity/constants.ts";
import { profileBaseWidth, profilePoints } from "./constants.ts";

export const profile = (
  wasm: ManifoldToplevel,
  { quality = DEFAULT_QUALITY }: { quality: number },
) =>
  sweepRounded(wasm, profilePoints, SIZE - profileBaseWidth * 2, 1.15, quality);
