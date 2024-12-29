import * as Comlink from "comlink";
import Worker from "./worker?worker";
import type { GridfinityGenApi } from "./worker";

export const GridfinityGenWorker = Comlink.wrap<GridfinityGenApi>(
  new Worker(),
) as unknown as WorkerApi;

type WorkerApi = {
  [K in keyof GridfinityGenApi]: (
    props: Parameters<GridfinityGenApi[K]>[0],
  ) => Promise<Awaited<ReturnType<GridfinityGenApi[K]>>>;
};
