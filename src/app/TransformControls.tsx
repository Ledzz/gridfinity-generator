import { FC, PropsWithChildren, useRef } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

// dir?: Vector3,
//     origin?: Vector3,
//     length?: number,
//     color?: ColorRepresentation,
//     headLength?: number,
//     headWidth?: number,

const tmp1 = new Vector3();
const tmp2 = new Vector3();

const AXIS_MAP = {
  x: {
    rotation: [0, 0, -Math.PI / 2],
    color: 0xff0000,
  },
  y: {
    rotation: [0, 0, Math.PI],
    color: 0x00ff00,
  },
  z: {
    rotation: [Math.PI / 2, 0, 0],
    color: 0x0000ff,
  },
};

const start = new Vector3(0, 0, 0);
const dir = new Vector3(0, 1, 0);

function Arrow({ axis }) {
  const arrowRef = useRef(null);
  const groupRef = useRef(null);
  const size = 1;

  useFrame((state) => {
    const camera = state.camera;
    camera.getWorldPosition(tmp1);
    groupRef.current.getWorldPosition(tmp2);
    const factor =
      tmp2.distanceTo(camera.position) *
      Math.min((1.9 * Math.tan((Math.PI * camera.fov) / 360)) / camera.zoom, 7);
    groupRef.current.scale.set(1, 1, 1).multiplyScalar((factor * size) / 4);
  });

  return (
    <group ref={groupRef} rotation={AXIS_MAP[axis].rotation}>
      <mesh
        onPointerEnter={() => arrowRef.current.setColor(0xffff00)}
        onPointerLeave={() => arrowRef.current.setColor(AXIS_MAP[axis].color)}
        position={[0, 0.3, 0]}
      >
        <cylinderGeometry args={[0.2, 0, 0.6, 4]} />
        <meshBasicMaterial wireframe depthTest={false} />
      </mesh>
      <arrowHelper
        renderOrder={Infinity}
        ref={arrowRef}
        args={[dir, start, 1, AXIS_MAP[axis].color]}
      />
    </group>
  );
}

export const TransformControls: FC<PropsWithChildren> = ({ children }) => {
  return (
    <group>
      <Arrow axis={"x"} />
      <Arrow axis={"y"} />
      <Arrow axis={"z"} />
      {children}
    </group>
  );
};
