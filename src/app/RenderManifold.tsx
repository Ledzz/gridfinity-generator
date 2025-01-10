import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { BufferAttribute, BufferGeometry, Mesh, Object3D } from "three";
import Module from "manifold-3d";
import { BufferGeometryUtils } from "three/examples/jsm/Addons";
import { baseplate } from "../manifold/baseplate/baseplate.ts";

const wasm = await Module();
wasm.setup();

export const RenderManifold = <T extends Item>({
  onClick,
  type,
  ...props
}: Item & { onClick: () => void; type: T["type"] }) => {
  const [obj, setObj] = useState<Object3D | null>(null);
  const propsHash = JSON.stringify(props);
  const memoizedProps = useMemo(() => props, [propsHash]);
  const isWireframe = useAppStore((state) => state.isWireframe);

  useEffect(() => {
    console.time("mesh");
    const mesh = baseplate(wasm, memoizedProps).getMesh();
    console.timeEnd("mesh");

    console.time("geometry");

    const geometry = mesh2geometry(mesh);
    console.timeEnd("geometry");
    setObj(geometry);
  }, [memoizedProps, type]);

  return obj ? (
    // <TransformControls>
    <mesh geometry={obj} onClick={onClick}>
      <meshStandardMaterial
        color={0x999999}
        flatShading
        wireframe={isWireframe}
      />
    </mesh>
  ) : // </TransformControls>
  null;
};

function mesh2geometry(mesh: Mesh) {
  const geometry = new BufferGeometry();
  // Assign buffers
  geometry.setAttribute(
    "position",
    new BufferAttribute(mesh.vertProperties, 3),
  );
  geometry.setIndex(new BufferAttribute(mesh.triVerts, 1));

  geometry.deleteAttribute("normal");

  const geom2 = BufferGeometryUtils.mergeVertices(geometry);
  // Compute vertex normals for proper lighting
  geom2.computeVertexNormals();
  return geom2;
}
