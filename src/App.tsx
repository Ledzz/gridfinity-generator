import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { World } from "./2/app/World.tsx";

function App() {
  return (
    <Canvas
      camera={{
        near: 0.1,
        far: 10000,
        position: [100, 60, 100],
      }}
    >
      <Environment preset={"studio"} environmentIntensity={0.7} />
      <OrbitControls />
      <axesHelper scale={100} />
      <World />
    </Canvas>
  );
}

export default App;
