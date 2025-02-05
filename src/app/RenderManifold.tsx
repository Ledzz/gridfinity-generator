import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { BufferGeometry } from "three";
import Module, { Manifold, ManifoldToplevel } from "manifold-3d";
import { toThreeGeometry } from "../exporters/threeGeometry.ts";
import { HandleTarget, PivotHandles } from "@react-three/handle";

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
      const mesh = // @ts-expect-error wtf
        (await Promise.resolve(render(wasm, memoizedProps))).getMesh();
      const geometry = toThreeGeometry(mesh);
      setObj(geometry);
    })();
  }, [render, memoizedProps, type]);

  return obj ? (
    <HandleTarget>
      <PivotHandles
        scale={false}
        rotation={false as any}
        apply={(state, target) => {
          target.position.copy(state.current.position);
          console.log(state.current.position);
        }}
      >
        <mesh geometry={obj} onClick={onClick}>
          <meshStandardMaterial
            color={0x999999}
            flatShading
            wireframe={isWireframe}
          />
        </mesh>
      </PivotHandles>
    </HandleTarget>
  ) : null;
};
