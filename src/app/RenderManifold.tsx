import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { BufferAttribute, BufferGeometry } from "three";
import Module, { Manifold, ManifoldToplevel } from "manifold-3d";
import { Mesh } from "manifold-3d/manifold-encapsulated-types";
import { Handle, PivotHandles } from "@react-three/handle";

const wasm = await Module();
wasm.setup();

// TODO: MB this shader? https://jsfiddle.net/prisoner849/kmau6591/
export const RenderManifold = <T extends Item>({
  onClick,
  type,
  render,
  ...props
}: Item & {
  onClick: () => void;
  type: T["type"];
  render: (wasm: ManifoldToplevel, props: T) => Manifold | Promise<Manifold>;
}) => {
  const [obj, setObj] = useState<BufferGeometry | null>(null);
  const propsHash = JSON.stringify(props);
  const memoizedProps = useMemo(() => props, [propsHash]);
  const isWireframe = useAppStore((state) => state.isWireframe);

  useEffect(() => {
    (async () => {
      const mesh = (
        await Promise.resolve(render(wasm, memoizedProps))
      ).getMesh();
      const geometry = mesh2geometry(mesh);
      setObj(geometry);
    })();
  }, [render, memoizedProps, type]);

  return obj ? (
    <PivotHandles scale={false} rotate={false}>
      <Handle useTargetFromContext>
        <mesh geometry={obj} onClick={onClick}>
          <meshStandardMaterial
            color={0x999999}
            flatShading
            wireframe={isWireframe}
          />
        </mesh>
      </Handle>
    </PivotHandles>
  ) : null;
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
