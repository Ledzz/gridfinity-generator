import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { BufferGeometry } from "three";
import { toThreeGeometry } from "../exporters/threeGeometry.ts";
import { Manifold } from "manifold-3d";

// TODO: MB this shader? https://jsfiddle.net/prisoner849/kmau6591/
export const RenderManifold = <T extends Item>({
  onClick,
  type,
  render,
  ...props
}: Item & {
  onClick: () => void;
  type: T["type"];
  render: (props: T) => Manifold[] | Promise<Manifold[]>;
}) => {
  const [objects, setObjects] = useState<BufferGeometry[] | null>(null);
  const propsHash = JSON.stringify(props);
  const memoizedProps = useMemo(() => props, [propsHash]);
  const isWireframe = useAppStore((state) => state.isWireframe);

  useEffect(() => {
    (async () => {
      // @ts-expect-error wtf?
      const manifolds = await render(memoizedProps);
      const meshes = manifolds.map((m) => m.getMesh());
      setObjects(meshes.map(toThreeGeometry));
    })();
  }, [render, memoizedProps, type]);

  return objects
    ? // <HandleTarget>
      //   <PivotHandles
      //     scale={false}
      //     rotation={false as any}
      //     apply={(state, target) => {
      //       target.position.copy(state.current.position);
      //       console.log(state.current.position);
      //     }}
      //   >
      objects.map((object, i) => (
        <mesh key={i} geometry={object} onClick={onClick}>
          <meshStandardMaterial
            color={Math.random() * 0xaaaaaa}
            flatShading
            wireframe={isWireframe}
          />
        </mesh>
      )) // </PivotHandles>
    : // </HandleTarget>
      null;
};
