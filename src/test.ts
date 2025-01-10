import Module from "manifold-3d";
import { BufferAttribute, BufferGeometry, Mesh } from "three";
import { baseplate } from "./manifold/baseplate/baseplate.ts";
import { BufferGeometryUtils } from "three/examples/jsm/Addons";

const wasm = await Module();
wasm.setup();
console.time("manifold");
const result = baseplate(wasm, {
  width: 5,
  depth: 5,
  hasMagnetHoles: true,
});
console.timeEnd("manifold");

const id2matIndex = new Map();

export const mesh = mesh2geometry(result.getMesh());

function mesh2geometry(mesh: Mesh) {
  const geometry = new BufferGeometry();
  // Assign buffers
  geometry.setAttribute(
    "position",
    new BufferAttribute(mesh.vertProperties, 3),
  );
  geometry.setIndex(new BufferAttribute(mesh.triVerts, 1));
  // Create a group (material) for each ID. Note that there may be multiple
  // triangle runs returned with the same ID, though these will always be
  // sequential since they are sorted by ID. In this example there are two runs
  // for the MeshNormalMaterial, one corresponding to each input mesh that had
  // this ID. This allows runTransform to return the total transformation matrix
  // applied to each triangle run from its input mesh - even after many
  // consecutive operations.
  // let id = mesh.runOriginalID[0];
  // let start = mesh.runIndex[0];
  // for (let run = 0; run < mesh.numRun; ++run) {
  //   const nextID = mesh.runOriginalID[run + 1];
  //   if (nextID !== id) {
  //     const end = mesh.runIndex[run + 1];
  //     geometry.addGroup(start, end - start, id2matIndex.get(id));
  //     id = nextID;
  //     start = end;
  //   }
  // }
  // geometry.computeVertexNormals();
  // geometry.normalizeNormals();

  geometry.deleteAttribute("normal");

  const geom2 = BufferGeometryUtils.mergeVertices(geometry);
  // Compute vertex normals for proper lighting
  geom2.computeVertexNormals();
  return geom2;
}
