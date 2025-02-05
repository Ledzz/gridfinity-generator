import { sweepRounded } from "../sweepRounded.ts";
import { profileBaseWidth, profilePoints } from "./constants.ts";
import { DEFAULT_QUALITY, SIZE } from "../constants.ts";

export const profile = ({ quality = DEFAULT_QUALITY }: { quality: number }) =>
  sweepRounded(profilePoints, SIZE - profileBaseWidth * 2, 1.15, quality);
