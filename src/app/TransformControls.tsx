import { FC, PropsWithChildren } from "react";
import { Vector3 } from "three";

// dir?: Vector3,
//     origin?: Vector3,
//     length?: number,
//     color?: ColorRepresentation,
//     headLength?: number,
//     headWidth?: number,

const start = new Vector3(0, 0, 0);
const dir = new Vector3(0, 0, 1);

export const TransformControls: FC<PropsWithChildren> = ({ children }) => {
  return (
    <group>
      <arrowHelper args={[dir, start, 60]} />
      {children}
    </group>
  );
};
