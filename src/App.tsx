import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { World } from "./app/World.tsx";
import { BoxEdit } from "./app/BoxEdit.tsx";
import { useStore } from "./app/store.ts";
import { useCallback } from "react";
import { serialize } from "@jscad/stl-serializer";
import { box } from "./gridfinity/box.ts";

function App() {
  const boxJson = useStore((state) => state.items[0]);
  const saveStl = useCallback(() => {
    const rawData = serialize({ binary: true }, box(boxJson));
    const blob = new Blob(rawData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model.stl";
    a.click();
  }, [boxJson]);
  return (
    <>
      <BoxEdit
        box={boxJson}
        onChange={(box) => useStore.setState({ items: [box] })}
      />
      <button onClick={saveStl}>export</button>
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
