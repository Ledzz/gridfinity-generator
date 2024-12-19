import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { World } from "./app/World.tsx";
import { BoxEdit } from "./app/BoxEdit.tsx";
import { useStore } from "./app/store.ts";

function App() {
  const box = useStore((state) => state.items[0]);
  return (
    <>
      <BoxEdit
        box={box}
        onChange={(box) => useStore.setState({ items: [box] })}
      />
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
    </>
  );
}

export default App;
