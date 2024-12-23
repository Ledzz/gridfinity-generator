import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

export const Stl = ({ url, ...props }) => {
  const stl = useLoader(STLLoader, url);

  return (
    <mesh castShadow receiveShadow {...props}>
      <primitive attach="geometry" object={stl}></primitive>
      <meshStandardMaterial
        color={0xff0000}
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};
