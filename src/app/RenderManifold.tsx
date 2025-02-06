import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { BufferGeometry, Object3D } from "three";
import { toThreeGeometry } from "../exporters/threeGeometry.ts";
import { Manifold } from "manifold-3d";
import { flatten, RecursiveArray } from "../manifold/utils/nestedArray.ts";
import { ManifoldEntries } from "../manifold/mapping.ts";
import { HandleTarget, PivotHandles } from "@react-three/handle";

const toggleSelect = (id: string, subId: string) => {
  useAppStore.setState((s) => {
    const selectedItemId = s.selectedItemId === id ? null : id;
    return {
      selectedItemId,
      selectedSubItemId: selectedItemId ? subId : null,
    };
  });
};

// TODO: MB this shader? https://jsfiddle.net/prisoner849/kmau6591/
export const RenderManifold = <T extends Item>({
  onClick,
  type,
  render,
  ...props
}: Item & {
  onClick: () => void;
  type: T["type"];
  render: (
    props: T,
  ) => RecursiveArray<Manifold> | Promise<RecursiveArray<Manifold>>;
}) => {
  const [objects, setObjects] = useState<BufferGeometry[] | null>(null);
  const propsHash = JSON.stringify(props);
  const memoizedProps = useMemo(() => props, [propsHash]);

  useEffect(() => {
    (async () => {
      // @ts-expect-error wtf?
      const manifolds = await render(memoizedProps);
      const objects = flatten(manifolds).map((m) => {
        const objId = ManifoldEntries.find((e) => e[1] === m)?.[0];
        const mesh = m.getMesh();
        const threeGeometry = toThreeGeometry(mesh);
        threeGeometry.userData = { id: objId };
        return threeGeometry;
      });
      setObjects(objects);
    })();
  }, [render, memoizedProps, type]);

  const handleClick = (object: Object3D) => {
    const itemId = object.userData.id;
    if (itemId) {
      console.log(props.id, itemId);
      toggleSelect(props.id, itemId);
    }
  };

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
        <Item key={i} object={object} onClick={() => handleClick(object)} />
      )) // </PivotHandles>
    : // </HandleTarget>
      null;
};

function Item({ object, ...props }) {
  const selectedSubItemId = useAppStore((state) => state.selectedSubItemId);
  const isWireframe = useAppStore((state) => state.isWireframe);

  const mesh = (
    <mesh geometry={object} {...props}>
      <meshStandardMaterial
        color={0x666666}
        flatShading
        wireframe={isWireframe}
      />
    </mesh>
  );

  return selectedSubItemId === object.userData.id ? (
    <HandleTarget>
      <PivotHandles
        scale={false}
        rotation={false as any}
        apply={(state, target) => {
          target.position.copy(state.current.position);
          console.log(state.current.position);
        }}
      >
        {mesh}
      </PivotHandles>
    </HandleTarget>
  ) : (
    mesh
  );
}
