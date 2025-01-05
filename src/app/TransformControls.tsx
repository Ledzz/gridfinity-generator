import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { Plane, Raycaster, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";

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

function Arrow({ axis, ...props }) {
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
    <group
      ref={groupRef}
      rotation={AXIS_MAP[axis].rotation}
      onPointerEnter={() => arrowRef.current.setColor(0xffff00)}
      onPointerLeave={() => arrowRef.current.setColor(AXIS_MAP[axis].color)}
      {...props}
    >
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.2, 0, 1.1, 4]} />
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
  const groupRef = useRef(null);
  const mouse = new Vector3();
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const raycaster = new Raycaster();
  const plane = new Plane();
  const objectPosition = new Vector3();
  const intersectionPoint = new Vector3();
  const controls = useThree((state) => state.controls);

  const handleMouseMove = (e) => {
    mouse.set(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
      0,
    );
    groupRef.current.getWorldPosition(objectPosition);
    raycaster.setFromCamera(mouse, camera);
    plane.setFromNormalAndCoplanarPoint(new Vector3(1, 0, 0), objectPosition);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    groupRef.current.position.z = intersectionPoint.y;
    controls.enabled = false;
    console.log(controls);
    console.log(mouse);
  };

  const handleStartDrag = (axis) => (e) => {
    document.addEventListener("pointermove", handleMouseMove);
  };

  const handleEndDrag = () => {
    document.removeEventListener("pointermove", handleMouseMove);
    controls.enabled = true;
  };

  useEffect(() => {
    return () => {
      handleEndDrag();
    };
  });

  return (
    <group ref={groupRef}>
      <Arrow axis={"x"} onPointerDown={handleStartDrag("x")} />
      <Arrow axis={"y"} onPointerDown={handleStartDrag("y")} />
      <Arrow axis={"z"} onPointerDown={handleStartDrag("z")} />
      {children}
    </group>
  );
};
