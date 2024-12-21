import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { BoxEdit } from "./app/BoxEdit.tsx";
import { useStore } from "./app/store.ts";
import { useCallback } from "react";
import { serialize } from "@jscad/stl-serializer";
import { box } from "./gridfinity/box.ts";
import { World } from "./app/World.tsx";
import { createBox } from "./app/utils/createBox.ts";
import { createBaseplate } from "./app/utils/createBaseplate.ts";

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
  const addBox = useCallback(() => {
    useStore.setState((s) => ({
      items: [...s.items, createBox()],
    }));
  }, []);
  const addBaseplate = useCallback(() => {
    useStore.setState((s) => ({
      items: [...s.items, createBaseplate()],
    }));
  }, []);
  return (
    <>
      {boxJson ? (
        <BoxEdit
          box={boxJson}
          onChange={(box) =>
            useStore.setState((s) => ({
              items: s.items
                .map((item) => (item.id === boxJson.id ? box : item))
                .filter(Boolean),
            }))
          }
        />
      ) : null}
      <button onClick={saveStl}>export</button>
      <button onClick={addBox}>add box</button>
      <button onClick={addBaseplate}>add baseplate</button>
      <Canvas
        camera={{
          near: 0.1,
          far: 10000,
          position: [100, 60, 100],
        }}
      >
        <Environment
          files={"/studio_small_03_1k.exr"}
          environmentIntensity={0.7}
        />
        <OrbitControls />
        <axesHelper scale={100} />
        <World />
      </Canvas>
    </>
  );
}

export default App;
