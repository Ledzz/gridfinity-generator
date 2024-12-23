import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

export const Stl = ({ url, children, ...props }) => {
  const stl = useLoader(STLLoader, url);

  return (
    <mesh castShadow receiveShadow {...props}>
      <primitive attach="geometry" object={stl}></primitive>
      {children}
    </mesh>
  );
};
