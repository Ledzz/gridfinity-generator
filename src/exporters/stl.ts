import { Mesh } from "manifold-3d/manifold-encapsulated-types";
import { toThreeGeometry } from "./threeGeometry.ts";
import { Mesh as ThreeMesh, MeshStandardMaterial } from "three";
import { STLExporter } from "three-stdlib";

const exporter = new STLExporter();

export function toSTL(mesh: Mesh) {
  const geometry = toThreeGeometry(mesh);
  const threeMesh = new ThreeMesh(
    geometry,
    new MeshStandardMaterial({
      color: 0x999999,
      flatShading: true,
    }),
  );
  const data = exporter.parse(threeMesh, { binary: true });
  return new Uint32Array(data.buffer);
}
