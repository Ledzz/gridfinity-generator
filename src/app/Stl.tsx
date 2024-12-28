import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { FC, PropsWithChildren } from "react";

export const Stl: FC<PropsWithChildren<{ url: string }>> = ({
  url,
  children,
  ...props
}) => {
  const stl = useLoader(STLLoader, url);

  return (
    <mesh castShadow receiveShadow {...props}>
      <primitive attach="geometry" object={stl}></primitive>
      {children}
    </mesh>
  );
};
