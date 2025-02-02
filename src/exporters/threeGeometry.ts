import { Mesh } from "manifold-3d/manifold-encapsulated-types";
import { BufferAttribute, BufferGeometry } from "three";

export function toThreeGeometry(mesh: Mesh): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(mesh.vertProperties, 3),
  );
  geometry.setIndex(new BufferAttribute(mesh.triVerts, 1));

  geometry.computeVertexNormals();
  return geometry;
}
