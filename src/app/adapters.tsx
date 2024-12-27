import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { GridfinityGenWorker } from "../gridfinity";
import { toMesh } from "../render/toMesh.ts";
import { useAppStore } from "./appStore.ts";
import { Mesh } from "three";

export const RenderGeom = <Props,>({
  onClick,
  type,
  ...props
}: Props & { onClick: () => void; type: Item["type"] }) => {
  const [obj, setObj] = useState(null);
  const propsHash = JSON.stringify(props);
  const memoizedProps = useMemo(() => props, [propsHash]);
  const isWireframe = useAppStore((state) => state.isWireframe);

  useEffect(() => {
    GridfinityGenWorker[type](memoizedProps).then((o) => {
      setObj(toMesh(o));
    });
  }, [memoizedProps, type]);

  useEffect(() => {
    if (obj) {
      obj.traverse((o) => {
        if (o instanceof Mesh) {
          o.material.wireframe = isWireframe;
        }
      });
    }
  }, [isWireframe, obj]);

  return obj ? <primitive object={obj} onClick={onClick}></primitive> : null;
};
