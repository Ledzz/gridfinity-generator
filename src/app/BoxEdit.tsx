import { FC, useCallback } from "react";
import { Box } from "./gridfinity/types/box.ts";
import { Button, Checkbox, Flex, Form, Input, InputNumber } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { createLabel } from "./utils/createLabel.ts";
import { EditFormProps } from "./gridfinity/types/item.ts";
import { createWall } from "./utils/createWall.ts";

export const BoxEdit: FC<EditFormProps<Box>> = ({ value, onChange }) => {
  const handleDeleteBox = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <>
      <Form
        layout={"vertical"}
        initialValues={value}
        onValuesChange={(_, v: Box) => {
          onChange({ ...value, ...v });
        }}
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
              {fields
                .filter((f) => value.items[f.name]?.type === "label")
                .map(({ key, name, ...restField }) => (
                  <Form.Item key={key}>
                    <Form.Item
                      label={"Label text"}
                      {...restField}
                      name={[name, "text"]}
                    >
                      <Input />
                    </Form.Item>
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
                ))}
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
              {fields
                .filter((f) => value.items[f.name]?.type === "wall")
                .map(({ key, name }) => (
                  <Form.Item key={key}>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(name)}
                    />
                  </Form.Item>
                ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add(createWall())} block>
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
