import { useMemo } from "react";
import { box } from "./gridfinity/box.ts";
import { toMesh } from "./render/toMesh.ts";

export const Scad = () => {
  const mesh = useMemo(() => {
    return toMesh(box({ width: 2, depth: 3, height: 1 }));
  }, []);

  return <primitive object={mesh}></primitive>;
};
