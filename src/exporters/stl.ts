import { toThreeMesh } from "./threeGeometry.ts";
import { Group } from "three";
import { STLExporter } from "three-stdlib";
import { Manifold } from "manifold-3d";
import { flatten, RecursiveArray } from "../manifold/utils/nestedArray.ts";

const exporter = new STLExporter();

export function toSTL(manifolds: RecursiveArray<Manifold>) {
  const group = new Group();
  const flatManifolds = flatten(manifolds);

  for (const manifold of flatManifolds) {
    group.add(toThreeMesh(manifold));
  }

  const data = exporter.parse(group, { binary: true });
  return new Uint32Array(data.buffer);
}
