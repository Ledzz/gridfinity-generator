import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { BoxEdit } from "./app/BoxEdit.tsx";
import { useWorldStore } from "./app/worldStore.ts";
import { useCallback } from "react";
import { serialize } from "@jscad/stl-serializer";
import { box } from "./gridfinity/box.ts";
import { World } from "./app/World.tsx";
import { createBox } from "./app/utils/createBox.ts";
import { createBaseplate } from "./app/utils/createBaseplate.ts";
import { useAppStore } from "./app/appStore.ts";
import { Button, Flex, Layout, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { DownloadOutlined } from "@ant-design/icons";

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG, colorSplit, lineType },
  } = theme.useToken();

  const selectedItemId = useAppStore((state) => state.selectedItemId);
  const selectedItem = useWorldStore((state) =>
    state.items.find((i) => i.id === selectedItemId),
  );
  const saveStl = useCallback(() => {
    const rawData = serialize({ binary: true }, box(selectedItem));
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
          {selectedItem ? (
            <BoxEdit
              box={selectedItem}
              onChange={(box) =>
                useWorldStore.setState((s) => ({
                  items: s.items
                    .map((item) => (item.id === selectedItem.id ? box : item))
                    .filter(Boolean),
                }))
              }
            />
          ) : null}
          <Flex wrap gap={"middle"}>
            <Button type="primary" icon={<DownloadOutlined />}>
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
            <Environment
              files={"/studio_small_03_1k.exr"}
              environmentIntensity={0.7}
            />
            <OrbitControls />

            {/*<arrowHelper args={[{ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, 60]} />*/}
            {/*<arrowHelper args={[{ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, 60]} />*/}
            <axesHelper scale={60} />
            {/*<gridHelper args={[100, 100, 0x444444, 0xdddddd]} />*/}
            {/*<gridHelper args={[100, 10]} />*/}
            <group rotation-x={-Math.PI / 2}>
              <World />
            </group>
          </Canvas>
        </Content>
      </Layout>
    </>
  );
}

export default App;
