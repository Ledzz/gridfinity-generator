import { FC, useCallback } from "react";
import { Button, Flex, Form, InputNumber } from "antd";
import { EditFormProps } from "./gridfinity/types/item.ts";
import { BaseplateExtend } from "./gridfinity/types/baseplate-extend.ts";

export const BaseplateExtendEdit: FC<EditFormProps<BaseplateExtend>> = ({
  value,
  onChange,
}) => {
  const handleDeleteBaseplateExtend = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <>
      <Form
        layout={"vertical"}
        initialValues={value}
        onValuesChange={(_, v: BaseplateExtend) => {
          onChange({ ...value, ...v });
        }}
      >
        <Form.Item label="Width (units)" name={"width"}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Depth (mm)" name={"depth"}>
          <InputNumber min={1} />
        </Form.Item>

        <Flex wrap gap={"middle"}>
          <Button type={"primary"} danger onClick={handleDeleteBaseplateExtend}>
            Delete baseplate extend
          </Button>
        </Flex>
      </Form>
    </>
  );
};
