import { useEffect, useMemo, useState } from "react";
import { Item } from "./gridfinity/types/item.ts";
import { GridfinityGenWorker } from "../gridfinity";
import { toMesh } from "../render/toMesh.ts";

export const RenderGeom = <Props,>({
  onClick,
  type,
  ...props
}: Props & { onClick: () => void; type: Item["type"] }) => {
  const [obj, setObj] = useState(null);
  const propsHash = JSON.stringify(props);
  const memoizedProps = useMemo(() => props, [propsHash]);

  useEffect(() => {
    GridfinityGenWorker[type](memoizedProps).then((o) => {
      setObj(toMesh(o));
    });
  }, [memoizedProps, type]);
  // return null;
  return obj ? <primitive object={obj} onClick={onClick}></primitive> : null;
};
