import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useWorldStore } from "./app/worldStore.ts";
import { FC, Suspense, useCallback } from "react";
import { World } from "./app/World.tsx";
import { createBox } from "./app/utils/createBox.ts";
import { createBaseplate } from "./app/utils/createBaseplate.ts";
import { BED_SIZES, useAppStore } from "./app/appStore.ts";
import {
  Button,
  Checkbox,
  Flex,
  InputNumber,
  Layout,
  Select,
  theme,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { DownloadOutlined } from "@ant-design/icons";
import { EDIT_FORMS } from "./constants.ts";
import { EditFormProps, Item } from "./app/gridfinity/types/item.ts";
import { noEvents, PointerEvents } from "./utils/pointer-events.ts";
import { OrbitHandles } from "@react-three/handle";
import { toSTL } from "./exporters/stl.ts";
import { RENDER } from "./app/gridfinity/items.ts";
import { to3MF } from "./exporters/3mf.ts";

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG, colorSplit, lineType },
  } = theme.useToken();

  const selectedItemId = useAppStore((state) => state.selectedItemId);
  const isWireframe = useAppStore((state) => state.isWireframe);
  const selectedItem = useWorldStore((state) =>
    state.items.find((i) => i.id === selectedItemId),
  );
  const saveStl = useCallback(() => {
    const save = async <T extends Item>(item: T) => {
      const manifolds = await RENDER[item.type](item);

      const data = toSTL(manifolds);

      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = `${item.type}-${item.width}x${item.depth}`;
      a.download = `${filename}.stl`;
      a.click();
    };

    if (selectedItem) {
      save(selectedItem);
    }
  }, [selectedItem]);
  const save3MF = useCallback(() => {
    const save = async <T extends Item>(item: T) => {
      const manifolds = await RENDER[item.type](item);

      const data = to3MF(manifolds);

      const blob = new Blob(data, {
        type: "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = `${item.type}-${item.width}x${item.depth}`;
      a.download = `${filename}.3mf`;
      a.click();
    };

    if (selectedItem) {
      save(selectedItem);
    }
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
  const EditComponent = selectedItem
    ? (EDIT_FORMS[selectedItem.type] as FC<EditFormProps<typeof selectedItem>>)
    : null;
  const bedSize = useAppStore((s) => s.bedSize);
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
            height: "100vh",
            borderInlineEnd: `1px ${lineType} ${colorSplit}`,
            padding: "16px",
            overflow: "auto",
          }}
          width={300}
        >
          <Checkbox
            checked={isWireframe}
            onChange={(e) => {
              useAppStore.setState({ isWireframe: e.target.checked });
            }}
          >
            Wireframe
          </Checkbox>
          <div>Bed size</div>
          <Select
            options={Object.keys(BED_SIZES).map((v) => ({
              value: v,
              label: v,
            }))}
            onChange={(v: string) => {
              useAppStore.setState({
                bedSize: BED_SIZES[v],
              });
            }}
          ></Select>
          <InputNumber
            min={1}
            value={bedSize?.[0]}
            onChange={(e) =>
              useAppStore.setState({
                bedSize: [e ?? 0, useAppStore.getState().bedSize?.[1] ?? 0],
              })
            }
          />
          x
          <InputNumber
            min={1}
            value={bedSize?.[1]}
            onChange={(e) => {
              useAppStore.setState({
                bedSize: [useAppStore.getState().bedSize?.[0] ?? 0, e ?? 0],
              });
            }}
          />
          {EditComponent && selectedItem ? (
            <EditComponent
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
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={save3MF}
            >
              Save 3MF
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
              position: [-100, 60, 100],
            }}
            events={noEvents}
          >
            <PointerEvents />
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
                files={"studio_small_03_compressed.exr"}
                environmentIntensity={0.7}
              />
            </Suspense>
            <OrbitHandles />

            {/*<gridHelper args={[100, 10]} position={[0, 3, -21]} />*/}
            {/*<arrowHelper args={[[0, 0, 1], [21, 21, 21], 60]} />*/}
            {/*<arrowHelper args={[{ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, 60]} />*/}
            {/*<gridHelper args={[100, 100, 0x444444, 0xdddddd]} />*/}
            {/*<gridHelper args={[100, 10]} />*/}

            {bedSize ? (
              <gridHelper
                args={[1, 10, 0xaaaaaa, 0xdddddd]}
                scale={[bedSize[0], 1, bedSize[1]]}
              />
            ) : null}
            {/*<axesHelper scale={60} />*/}

            <group rotation-x={-Math.PI / 2}>
              <World />
              {/*<mesh geometry={mesh}>*/}
              {/*  <meshStandardMaterial color={0x999999} flatShading />*/}
              {/*</mesh>*/}
              {/*<primitive object={mesh}></primitive>*/}
              {/*<Stl*/}
              {/*  renderOrder={100}*/}
              {/*  position={[-21, -21, 5]}*/}
              {/*  url={"/Tray 1x1x3.stl"}*/}
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
