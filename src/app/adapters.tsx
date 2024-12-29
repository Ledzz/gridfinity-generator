import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { GridfinityGenWorker } from "../gridfinity";
import { toMesh } from "../render/toMesh.ts";
import { useAppStore } from "./appStore.ts";
import { Mesh, MeshBasicMaterial, Object3D } from "three";

export const RenderGeom = <T extends Item>({
  onClick,
  type,
  ...props
}: Item & { onClick: () => void; type: T["type"] }) => {
  const [obj, setObj] = useState<Object3D | null>(null);
  const propsHash = JSON.stringify(props);
  const memoizedProps = useMemo(() => props, [propsHash]);
  const isWireframe = useAppStore((state) => state.isWireframe);

  useEffect(() => {
    GridfinityGenWorker[type](memoizedProps).then((o) => {
      if (o) {
        setObj(toMesh(o));
      }
    });
  }, [memoizedProps, type]);

  useEffect(() => {
    if (obj) {
      obj.traverse((o) => {
        if (o instanceof Mesh) {
          (o.material as MeshBasicMaterial).wireframe = isWireframe;
        }
      });
    }
  }, [isWireframe, obj]);

  return obj ? <primitive object={obj} onClick={onClick}></primitive> : null;
};
