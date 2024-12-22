import { FC, Fragment, useCallback } from "react";
import { TextInput } from "./TextInput.tsx";
import { DEFAULT_FONT_SIZE } from "../gridfinity/label.ts";
import { Label } from "./types/label.ts";
import { Box } from "./types/box.ts";
import { Button, Form, InputNumber } from "antd";

export const BoxEdit: FC<{
  box: Box;
  onChange: (value: Box | null) => void;
}> = ({ box, onChange }) => {
  const handleChange = useCallback(
    (field: keyof Box) => (value: number) => {
      onChange({ ...box, [field]: value });
    },
    [box, onChange],
  );
  const handleChangeLabel = useCallback(
    <T extends keyof Label>(index: number, field: T) =>
      (value: Label[T]) => {
        const labels = box.labels ? [...box.labels] : [];
        labels[index] = { ...labels[index], [field]: value };
        onChange({ ...box, labels });
      },
    [box, onChange],
  );
  const handleAddLabel = useCallback(() => {
    onChange({
      ...box,
      labels: [...(box.labels || []), { text: "", position: "top-center" }],
    });
  }, [box, onChange]);
  const handleRemoveLabel = useCallback(
    (index: number) => () => {
      const labels = box.labels ? [...box.labels] : [];
      labels.splice(index, 1);
      onChange({ ...box, labels });
    },
    [box, onChange],
  );
  const handleDeleteBox = useCallback(() => {
    onChange(null);
  }, [onChange]);
  return (
    <>
      <Button type={"primary"} danger onClick={handleDeleteBox}>
        delete box
      </Button>
      <Form>
        <Form.Item label="width">
          <InputNumber
            label="width"
            value={box.width}
            onChange={handleChange("width")}
            min={1}
          />
        </Form.Item>
        <Form.Item label="height">
          <InputNumber
            label="height"
            value={box.height}
            onChange={handleChange("height")}
            min={1}
          />
        </Form.Item>
        <Form.Item label="depth">
          <InputNumber
            label="depth"
            value={box.depth}
            onChange={handleChange("depth")}
            min={1}
          />
        </Form.Item>
        <Form.Item label="Wall thickness">
          <InputNumber
            label="wallThickness"
            value={box.wallThickness}
            onChange={handleChange("wallThickness")}
            step={0.1}
            min={0.1}
          />
        </Form.Item>
        {box.labels?.map((label, index) => (
          <Fragment key={index}>
            <Form.Item label={"Label text"}>
              <TextInput
                label={"text"}
                value={label.text}
                onChange={handleChangeLabel(index, "text")}
              />
            </Form.Item>
            <Form.Item label={"Font size"}>
              <InputNumber
                label="fontSize"
                value={label.fontSize ?? DEFAULT_FONT_SIZE}
                onChange={handleChangeLabel(index, "fontSize")}
                min={1}
              />
            </Form.Item>
            <Button danger onClick={handleRemoveLabel(index)}>
              Remove label
            </Button>
          </Fragment>
        ))}
        <Button onClick={handleAddLabel}>Add label</Button>
        <Button type={"primary"}>Submit</Button>
      </Form>
    </>
  );
};
