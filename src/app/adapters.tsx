import { useMemo } from "react";
import { box } from "../gridfinity/box.ts";
import { toMesh } from "../render/toMesh.ts";
import { baseplate } from "../gridfinity/baseplate.ts";

function create<Props>(
  render: (
    props: Props & { onClick: () => void },
  ) => Parameters<typeof toMesh>[0],
) {
  return ({ onClick, ...props }: Props & { onClick: () => void }) => {
    const obj = useMemo(() => toMesh(render(props)), [props]);
    return obj ? <primitive object={obj} onClick={onClick}></primitive> : null;
  };
}

export const Box = create(box);
export const Baseplate = create(baseplate);
