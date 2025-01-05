import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { Group, Plane, PlaneHelper, Raycaster, Vector3 } from "three";
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
  const groupRef = useRef<Group>(null);
  const mouse = new Vector3();
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const raycaster = new Raycaster();
  const plane = new Plane();
  const objectPosition = new Vector3();
  const intersectionPoint = new Vector3();
  const offset = new Vector3();
  const controls = useThree((state) => state.controls);
  const initialIntersection = useRef(new Vector3());
  const planeNormal = new Vector3();
  const scene = useThree((state) => state.scene);

  const raycast = (e, intersection: Vector3) => {
    groupRef.current.getWorldPosition(objectPosition);

    const axis = "z";
    // switch (axis) {
    //   case "x":
    // planeNormal.set(0, 1, 0);
    // break;
    // case "y":
    planeNormal.set(0, 0, 1);
    // break;
    // case "z":
    // planeNormal.set(1, 0, 0);
    // break;
    // }
    plane.setFromNormalAndCoplanarPoint(planeNormal, objectPosition);
    const helper = new PlaneHelper(plane, 40, 0xff0000);
    scene.add(helper);

    mouse.set(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
      0,
    );

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersection);
  };

  const handleMouseMove = (e) => {
    raycast(e, intersectionPoint);
    const delta = intersectionPoint.clone().add(objectPosition);
    // .sub(offset)
    // .sub(initialIntersection.current);

    // console.log(intersectionPoint);

    /*offset
      .clone()
      .add(intersectionPoint)
      .sub(initialIntersection.current); //intersectionPoint.clone().add(offset);*/
    // .sub(objectPosition);

    // offset.copy(intersectionPoint).sub(objectPosition);
    // groupRef.current.position.z = delta.y;
    groupRef.current.worldToLocal(delta);
    delta.set(0, 0, delta.z);
    console.log(groupRef.current.position.z);
    groupRef.current.position.copy(delta);
    controls.enabled = false;
  };

  const handleStartDrag = (axis) => (e) => {
    raycast(e, initialIntersection.current);
    offset.copy(groupRef.current.position.clone());
    console.log(initialIntersection.current, groupRef.current.position);
    document.addEventListener("pointermove", handleMouseMove);
    document.addEventListener("pointerup", handleEndDrag);
  };

  const handleEndDrag = () => {
    document.removeEventListener("pointermove", handleMouseMove);
    document.removeEventListener("pointerup", handleEndDrag);
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
