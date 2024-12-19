import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Scad } from "./2/Scad.tsx";

function App() {
  return (
    <Canvas
      camera={{
        near: 0.1,
        far: 10000,
        position: [100, 60, 100],
      }}
    >
      <Environment preset={"studio"} />
      <OrbitControls />
      <axesHelper scale={100} />
      <Scad />
    </Canvas>
  );
}

export default App;
