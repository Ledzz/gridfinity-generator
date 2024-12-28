import * as Comlink from "comlink";
import Worker from "./worker?worker";
import type { GridfinityGenApi } from "./worker";

export const GridfinityGenWorker = Comlink.wrap<GridfinityGenApi>(new Worker());
