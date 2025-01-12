import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { BufferAttribute, BufferGeometry } from "three";
import Module from "manifold-3d";
import { baseplate } from "../manifold/baseplate/baseplate.ts";
import { Mesh } from "manifold-3d/manifold-encapsulated-types";

const wasm = await Module();
wasm.setup();

// TODO: MB this shader? https://jsfiddle.net/prisoner849/kmau6591/
export const RenderManifold = <T extends Item>({
  onClick,
  type,
  ...props
}: Item & { onClick: () => void; type: T["type"] }) => {
  const [obj, setObj] = useState<BufferGeometry | null>(null);
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

function mesh2geometry(mesh: Mesh): BufferGeometry {
  const geometry = new BufferGeometry();
  // Assign buffers
  geometry.setAttribute(
    "position",
    new BufferAttribute(mesh.vertProperties, 3),
  );
  geometry.setIndex(new BufferAttribute(mesh.triVerts, 1));

  geometry.computeVertexNormals();
  return geometry;
}
