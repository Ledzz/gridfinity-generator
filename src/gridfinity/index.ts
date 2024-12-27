import * as Comlink from "comlink";
import Worker from "./worker?worker";

export const GridfinityGenWorker = Comlink.wrap(new Worker());
