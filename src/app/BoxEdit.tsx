import { FC, useCallback } from "react";
import { Box } from "./gridfinity/types/box.ts";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { createLabel } from "./utils/createLabel.ts";
import { EditFormProps } from "./gridfinity/types/item.ts";
import { createWall } from "./utils/createWall.ts";
import { LABEL_POSITIONS } from "../gridfinity/bin/label.ts";
import { Label } from "./gridfinity/types/label.ts";
import { BoxItem } from "../gridfinity/bin/box.ts";
import { Wall } from "./gridfinity/types/wall.ts";

const labelPositionOptions = LABEL_POSITIONS.map((position) => ({
  value: position,
  label: position,
}));

function isLabel(item: BoxItem): item is Label {
  return item.type === "label";
}
function isWall(item: BoxItem): item is Wall {
  return item.type === "wall";
}

export const BoxEdit: FC<EditFormProps<Box>> = ({ value, onChange }) => {
  const handleDeleteBox = useCallback(() => {
    onChange(null);
  }, [onChange]);

  const [form] = Form.useForm();

  return (
    <>
      <Form
        layout={"vertical"}
        initialValues={value}
        onValuesChange={(_, v: Box) => {
          onChange({ ...value, ...v });
        }}
        form={form}
      >
        <Form.Item label="Width" name={"width"}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Depth" name={"depth"}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Height" name={"height"}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          label="Magnet holes"
          name={"hasMagnetHoles"}
          valuePropName={"checked"}
        >
          <Checkbox />
        </Form.Item>
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div>
              Labels
              {fields.map(({ key, name, ...restField }) => {
                const item = value.items[name];

                if (!isLabel(item)) {
                  return null;
                }

                return (
                  <Form.Item key={key}>
                    <Form.Item
                      label={"Label text"}
                      {...restField}
                      name={[name, "text"]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={"Position"}
                      {...restField}
                      name={[name, "position"]}
                    >
                      <Select options={labelPositionOptions} />
                    </Form.Item>

                    <Form.Item label={"Size"}>
                      <Radio.Group
                        value={item.size === "auto"}
                        onChange={(v) => {
                          onChange({
                            ...value,
                            items: value.items.map((item, i) => {
                              if (i === name) {
                                return {
                                  ...item,
                                  size: v.target.value ? "auto" : 1,
                                };
                              }
                              return item;
                            }),
                          });
                        }}
                      >
                        <Space direction="vertical">
                          <Radio value={true}>Auto</Radio>
                          <Radio value={false}>Custom</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                    {item.size !== "auto" ? (
                      <Form.Item {...restField} name={[name, "size"]}>
                        <InputNumber min={1} />
                      </Form.Item>
                    ) : null}

                    <Form.Item
                      label={"Font size"}
                      {...restField}
                      name={[name, "fontSize"]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(name)}
                    />
                  </Form.Item>
                );
              })}
              <Form.Item>
                <Button type="dashed" onClick={() => add(createLabel())} block>
                  + Add Label
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div>
              Walls
              {fields.map(({ key, name, ...restField }) => {
                const item = value.items[name];

                if (!isWall(item)) {
                  return null;
                }

                return (
                  <Form.Item key={key}>
                    <Form.Item
                      label={"width"}
                      {...restField}
                      name={[name, "width"]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      label={"height"}
                      {...restField}
                      name={[name, "height"]}
                    >
                      <InputNumber min={0} step={7} />
                    </Form.Item>
                    <Form.Item
                      label={"thickness"}
                      {...restField}
                      name={[name, "thickness"]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      label={"rotation"}
                      {...restField}
                      name={[name, "rotation"]}
                    >
                      <InputNumber min={0} step={90} />
                    </Form.Item>
                    <Form.Item
                      label={"position x"}
                      {...restField}
                      name={[name, "position", 0]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      label={"position y"}
                      {...restField}
                      name={[name, "position", 1]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>

                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(name)}
                    />
                  </Form.Item>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add(createWall(value))}
                  block
                >
                  + Add Wall
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Flex wrap gap={"middle"}>
          <Button type={"primary"} danger onClick={handleDeleteBox}>
            Delete box
          </Button>
        </Flex>
      </Form>
    </>
  );
};
