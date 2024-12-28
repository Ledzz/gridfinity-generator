import { FC, useCallback } from "react";
import { Button, Checkbox, Flex, Form, InputNumber } from "antd";
import { EditFormProps } from "./gridfinity/types/item.ts";
import { Baseplate } from "./gridfinity/types/baseplate.ts";

export const BaseplateEdit: FC<EditFormProps<Baseplate>> = ({
  value,
  onChange,
}) => {
  const handleDeleteBaseplate = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <>
      <Form
        layout={"vertical"}
        initialValues={value}
        onValuesChange={(_, v: Baseplate) => {
          onChange({ ...value, ...v });
        }}
      >
        <Form.Item label="Width" name={"width"}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Depth" name={"depth"}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          label="Magnet holes"
          name={"hasMagnetHoles"}
          valuePropName={"checked"}
        >
          <Checkbox />
        </Form.Item>
        <Form.Item
          label="Stackable connectors"
          name={"hasStackableConnectors"}
          valuePropName={"checked"}
        >
          <Checkbox />
        </Form.Item>

        <Flex wrap gap={"middle"}>
          <Button type={"primary"} danger onClick={handleDeleteBaseplate}>
            Delete baseplate
          </Button>
        </Flex>
      </Form>
    </>
  );
};
