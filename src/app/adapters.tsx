import { useMemo } from "react";
import { toMesh } from "../render/toMesh.ts";
import { GEOMETRY_CREATORS } from "../gridfinity/constants.ts";
import { Item } from "./types/item.ts";

export const RenderGeom = <Props,>({
  onClick,
  type,
  ...props
}: Props & { onClick: () => void; type: Item["type"] }) => {
  const obj = useMemo(
    () => toMesh(GEOMETRY_CREATORS[type](props)),
    [props, type],
  );
  return obj ? <primitive object={obj} onClick={onClick}></primitive> : null;
};
