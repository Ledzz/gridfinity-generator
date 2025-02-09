import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Mesh as ThreeMesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { Manifold } from "manifold-3d";

/**
 * @param manifold
 * @param offsetPosition True if need to offset geometry and mesh positions
 */
export function toThreeMesh(
  manifold: Manifold,
  offsetPosition = false,
): ThreeMesh {
  const mesh = manifold.getMesh();
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(mesh.vertProperties, mesh.numProp),
  );
  geometry.setIndex(new BufferAttribute(mesh.triVerts, 1));

  geometry.computeVertexNormals();

  const bounds = new Box3();
  const tmp = new Vector3();
  for (let i = 0; i < mesh.vertProperties.length; i += mesh.numProp) {
    tmp.set(
      mesh.vertProperties[i],
      mesh.vertProperties[i + 1],
      mesh.vertProperties[i + 2],
    );
    bounds.expandByPoint(tmp);
  }
  bounds.getCenter(tmp);
  if (offsetPosition) {
    geometry.translate(-tmp.x, -tmp.y, -tmp.z);
  }
  const material = new MeshStandardMaterial({
    color: 0x6666666,
    flatShading: true,
  });
  const threeMesh = new ThreeMesh(geometry, material);
  if (offsetPosition) {
    threeMesh.position.copy(tmp);
  }

  if (mesh.numProp > 3) {
    threeMesh.userData.id = mesh.vertProperties[3];
    threeMesh.userData.position = tmp.clone();
  }
  return threeMesh;
}
