import * as Comlink from "comlink";
import { box } from "./bin/box.ts";
import { baseplate } from "./baseplate/baseplate.ts";

const gridfinityGenApi = {
  box,
  baseplate,
} as const;

export type GridfinityGenApi = typeof gridfinityGenApi;

Comlink.expose(gridfinityGenApi);
