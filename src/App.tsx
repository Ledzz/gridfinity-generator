import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useWorldStore } from "./app/worldStore.ts";
import { Suspense, useCallback } from "react";
import { serialize } from "@jscad/stl-serializer";
import { World } from "./app/World.tsx";
import { createBox } from "./app/utils/createBox.ts";
import { createBaseplate } from "./app/utils/createBaseplate.ts";
import { useAppStore } from "./app/appStore.ts";
import { Button, Flex, Layout, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { DownloadOutlined } from "@ant-design/icons";
import { EDIT_FORMS, GEOMETRY_CREATORS } from "./gridfinity/constants.ts";

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG, colorSplit, lineType },
  } = theme.useToken();

  const selectedItemId = useAppStore((state) => state.selectedItemId);
  const selectedItem = useWorldStore((state) =>
    state.items.find((i) => i.id === selectedItemId),
  );
  const saveStl = useCallback(() => {
    if (!selectedItem) return;
    const rawData = serialize(
      { binary: true },
      GEOMETRY_CREATORS[selectedItem.type](selectedItem),
    );
    const blob = new Blob(rawData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model.stl";
    a.click();
  }, [selectedItem]);
  const addBox = useCallback(() => {
    useWorldStore.setState((s) => ({
      items: [...s.items, createBox()],
    }));
  }, []);
  const addBaseplate = useCallback(() => {
    useWorldStore.setState((s) => ({
      items: [...s.items, createBaseplate()],
    }));
  }, []);
  const Edit = selectedItem ? EDIT_FORMS[selectedItem.type] : null;

  return (
    <>
      <Layout
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Sider
          style={{
            background: colorBgContainer,
            minHeight: "100vh",
            borderInlineEnd: `1px ${lineType} ${colorSplit}`,
            padding: "16px",
          }}
          width={300}
        >
          {Edit ? (
            <Edit
              value={selectedItem}
              onChange={(value) =>
                useWorldStore.setState((s) => ({
                  items: s.items
                    .map((item) => (item.id === selectedItem.id ? value : item))
                    .filter(Boolean),
                }))
              }
            />
          ) : null}
          <Flex wrap gap={"middle"}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={saveStl}
            >
              Save STL
            </Button>

            <Button onClick={addBox}>add box</Button>
            <Button onClick={addBaseplate}>add baseplate</Button>
          </Flex>
        </Sider>
        <Content>
          <Canvas
            camera={{
              near: 0.1,
              far: 10000,
              position: [100, 60, 100],
            }}
          >
            <Suspense
              fallback={
                <>
                  <pointLight position={[70, 100, 70]} intensity={50000 / 2} />
                  <pointLight
                    position={[-70, -40, -70]}
                    intensity={50000 / 2}
                  />
                  <ambientLight intensity={1} />
                </>
              }
            >
              <Environment
                files={"/studio_small_03_compressed.exr"}
                environmentIntensity={0.7}
              />
            </Suspense>
            <OrbitControls target={[0, 0, 0]} />
            {/*<gridHelper args={[100, 10]} position={[0, 3, -21]} />*/}
            {/*<arrowHelper args={[[0, 0, 1], [21, 21, 21], 60]} />*/}
            {/*<arrowHelper args={[{ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, 60]} />*/}
            <axesHelper scale={60} />
            {/*<gridHelper args={[100, 100, 0x444444, 0xdddddd]} />*/}
            {/*<gridHelper args={[100, 10]} />*/}
            <group rotation-x={-Math.PI / 2}>
              <World />
              {/*<Stl*/}
              {/*  renderOrder={100}*/}
              {/*  position={[-42, -21, 0]}*/}
              {/*  url={"/GridLite 2x1.stl"}*/}
              {/*>*/}
              {/*  <meshStandardMaterial*/}
              {/*    color={0xff0000}*/}
              {/*    // wireframe*/}
              {/*    // wireframeLinewidth={2}*/}
              {/*    // transparent*/}
              {/*    // opacity={0.8}*/}
              {/*  />*/}
              {/*</Stl>*/}
            </group>
          </Canvas>
        </Content>
      </Layout>
    </>
  );
}

export default App;
