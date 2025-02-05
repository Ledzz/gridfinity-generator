import { Mesh } from "manifold-3d/manifold-encapsulated-types";
import { toThreeGeometry } from "./threeGeometry.ts";
import { Group, Mesh as ThreeMesh, MeshStandardMaterial } from "three";
import { STLExporter } from "three-stdlib";

const exporter = new STLExporter();

export function toSTL(meshes: Mesh[]) {
  const group = new Group();
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
