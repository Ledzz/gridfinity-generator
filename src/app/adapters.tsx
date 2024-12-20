import { useMemo } from "react";
import { box } from "../gridfinity/box.ts";
import { toMesh } from "../render/toMesh.ts";
import { baseplate } from "../gridfinity/baseplate.ts";

function create<Props>(render: (props: Props) => Parameters<typeof toMesh>[0]) {
  return (props: Props) => {
    const obj = useMemo(() => toMesh(render(props)), [props]);
    return <primitive object={obj}></primitive>;
  };
}

export const Box = create(box);
export const Baseplate = create(baseplate);
