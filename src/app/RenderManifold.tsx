import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { BufferGeometry, Mesh } from "three";
import { toThreeMesh } from "../exporters/threeGeometry.ts";
import { Manifold } from "manifold-3d";
import { flatten, RecursiveArray } from "../manifold/utils/nestedArray.ts";
import { PivotHandles } from "@react-three/handle";

const toggleSelect = (id: number, subId?: number) => {
  useAppStore.setState((s) => {
    const selectedItemId = s.selectedItemId === id ? null : id;
    return {
      selectedItemId,
      selectedSubItemId: selectedItemId ? (subId ?? null) : null,
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
    const itemId = e.target.userData.id;

    if (!itemId) {
      toggleSelect(props.id);
      return;
    }

    toggleSelect(props.id, itemId);
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
  const [pivotHandles, setPivotHandles] = useState<any>(null);
  // const isWireframe = useAppStore((state) => state.isWireframe);

  useEffect(() => {
    const threeMesh = toThreeMesh(manifold);

    setMesh(threeMesh);
  }, [manifold]);

  useEffect(() => {
    if (pivotHandles) {
      pivotHandles.position.copy(mesh?.userData.position);
      mesh?.position.set(0, 0, 0);
    }
  }, [mesh?.position, mesh?.userData.position, pivotHandles]);

  if (!mesh) {
    return null;
  }
  return selectedSubItemId && selectedSubItemId === mesh.userData.id ? (
    <PivotHandles
      ref={setPivotHandles}
      scale={false}
      rotation={false as any}
      apply={(state, target) => {
        target.position.copy(state.current.position);
        console.log(state.current.position);
      }}
    >
      <primitive object={mesh} {...props} />
    </PivotHandles>
  ) : (
    <primitive object={mesh} {...props} />
  );
}
