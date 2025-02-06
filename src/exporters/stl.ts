import { toThreeGeometry } from "./threeGeometry.ts";
import { Group, Mesh as ThreeMesh, MeshStandardMaterial } from "three";
import { STLExporter } from "three-stdlib";
import { Manifold } from "manifold-3d";
import { flatten, RecursiveArray } from "../manifold/utils/nestedArray.ts";

const exporter = new STLExporter();

export function toSTL(manifolds: RecursiveArray<Manifold>) {
  const group = new Group();
  const meshes = flatten(manifolds).map((m) => m.getMesh());

  for (const mesh of meshes) {
    const geometry = toThreeGeometry(mesh);
    const threeMesh = new ThreeMesh(
      geometry,
      new MeshStandardMaterial({
        color: 0x999999,
        flatShading: true,
      }),
    );
    group.add(threeMesh);
  }

  const data = exporter.parse(group, { binary: true });
  return new Uint32Array(data.buffer);
}
