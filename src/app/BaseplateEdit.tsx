import { FC, Fragment, useCallback } from "react";
import { Button, Flex, Form, InputNumber } from "antd";
import { Baseplate } from "./types/baseplate.ts";

export const BaseplateEdit: FC<{
  value: Baseplate;
  onChange: (value: Baseplate | null) => void;
}> = ({ value, onChange }) => {
  const handleDeleteBaseplate = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <>
      <Form
        layout={"vertical"}
        initialValues={value}
        onValuesChange={(_, v) => {
          onChange({ ...value, ...v });
        }}
      >
        <Form.Item label="Width" name={"width"}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Depth" name={"depth"}>
          <InputNumber min={1} />
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