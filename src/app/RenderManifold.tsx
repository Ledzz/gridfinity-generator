import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { BufferGeometry, Mesh } from "three";
import { toThreeMesh } from "../exporters/threeGeometry.ts";
import { Manifold } from "manifold-3d";
import { flatten, RecursiveArray } from "../manifold/utils/nestedArray.ts";
import { HandleTarget, PivotHandles } from "@react-three/handle";
import { hashUUID } from "../manifold/utils/hashUUID.ts";

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
      const objects = flatten(manifolds);
      setObjects(objects);
    })();
  }, [render, memoizedProps, type]);

  const handleClick = (e: PointerEvent) => {
    // toggleSelect(props.id, itemId);
    const itemId = e.target.userData.id;
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

      objects.map((manifold, i) => (
        <RenderSingleManifold
          key={i}
          manifold={manifold}
          onClick={handleClick}
        />
      )) // </PivotHandles>
    : // </HandleTarget>
      null;
};

function RenderSingleManifold({ manifold, ...props }) {
  const [mesh, setMesh] = useState<Mesh | null>(null);
  const selectedSubItemId = useAppStore((state) => state.selectedSubItemId);
  // const isWireframe = useAppStore((state) => state.isWireframe);

  useEffect(() => {
    const threeMesh = toThreeMesh(manifold);

    setMesh(threeMesh);
  }, [manifold]);

  if (!mesh) {
    return null;
  }
  console.log(selectedSubItemId);
  return selectedSubItemId &&
    hashUUID(selectedSubItemId) === mesh.userData.id ? (
    <HandleTarget>
      <PivotHandles
        scale={false}
        rotation={false as any}
        apply={(state, target) => {
          target.position.copy(state.current.position);
          console.log(state.current.position);
        }}
      >
        <primitive object={mesh} {...props} />
      </PivotHandles>
    </HandleTarget>
  ) : (
    <primitive object={mesh} {...props} />
  );
}
