import { FC, useMemo } from "react";
import { box } from "../gridfinity/box.ts";
import { toMesh } from "../render/toMesh.ts";
import { Geom2 } from "@jscad/modeling/src/geometries/geom2";
import Geom3 from "@jscad/modeling/src/geometries/geom3/type";

export const Box: FC<Parameters<typeof box>[0]> = (props) => {
  return <primitive object={useJSCAD(box, props)}></primitive>;
};

function useJSCAD<Props, ReturnType extends Geom2 | Geom3>(
  render: (props: Props) => ReturnType,
  props: Props,
) {
  return useMemo(() => toMesh(render(props)), [props]);
}
