import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { useAppStore } from "./appStore.ts";
import { Group, Mesh } from "three";
import { toThreeMesh } from "../exporters/threeGeometry.ts";
import { Manifold } from "manifold-3d";
import { flatten, RecursiveArray } from "../manifold/utils/nestedArray.ts";
import { PivotHandles } from "@react-three/handle";
import { GroupProps } from "@react-three/fiber";
import { PointerEvent } from "@pmndrs/pointer-events";

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
export const RenderManifolds = <T extends Item>({
  type,
  render,
  ...props
}: Item & {
  type: T["type"];
  render: (
    props: T,
  ) => RecursiveArray<Manifold> | Promise<RecursiveArray<Manifold>>;
}) => {
  const [objects, setObjects] = useState<Manifold[] | null>(null);
  const propsHash = JSON.stringify(props);
  const memoizedProps = useMemo(() => props, [propsHash]);

  useEffect(() => {
    (async () => {
      // @ts-expect-error wtf?
      const manifolds = await render(memoizedProps);
      setObjects(flatten(manifolds));
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
    ? objects.map((manifold, i) => (
        <RenderManifold
          key={i}
          manifold={manifold}
          onClick={handleClick as any}
        />
      ))
    : null;
};

function RenderManifold({
  manifold,
  ...props
}: GroupProps & { manifold: Manifold }) {
  const [mesh, setMesh] = useState<Mesh | null>(null);
  const selectedSubItemId = useAppStore((state) => state.selectedSubItemId);
  const [pivotHandles, setPivotHandles] = useState<Group | null>(null);
  // const isWireframe = useAppStore((state) => state.isWireframe);

  useEffect(() => {
    const threeMesh = toThreeMesh(manifold, true);

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
