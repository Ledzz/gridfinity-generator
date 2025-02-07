import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Mesh as ThreeMesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { Manifold } from "manifold-3d";

export function toThreeMesh(manifold: Manifold): ThreeMesh {
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
    bounds.expandByPoint(
      tmp,
      //     mesh.vertProperties.slice(i, i + 3) as [number, number, number],
    );
  }
  bounds.getCenter(tmp);
  geometry.translate(-tmp.x, -tmp.y, -tmp.z);
  const material = new MeshStandardMaterial({
    color: 0x6666666,
    flatShading: true,
  });
  const threeMesh = new ThreeMesh(geometry, material);
  threeMesh.position.copy(tmp);
  // console.log(bounds);
  // console.log(mesh.numRun);
  // const matrix = new Matrix4(...mesh.transform(1));
  // const position = new Vector3();
  // const quaternion = new Quaternion();
  // const scale = new Vector3();
  // matrix.decompose(position, quaternion, scale);
  // console.log(position, quaternion, scale);
  // geometry.applyMatrix4(matrix);
  // const position =
  if (mesh.numProp === 4) {
    threeMesh.userData.id = mesh.vertProperties[3];
  }
  return threeMesh;
}
