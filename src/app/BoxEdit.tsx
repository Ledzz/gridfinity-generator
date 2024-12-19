import { FC, Fragment, useCallback } from "react";
import { Box, Label } from "./store.ts";
import { NumberInput } from "./NumberInput.tsx";
import { TextInput } from "./TextInput.tsx";
import { DEFAULT_FONT_SIZE } from "../gridfinity/label.ts";

export const BoxEdit: FC<{ box: Box; onChange: (value: Box) => void }> = ({
  box,
  onChange,
}) => {
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
    onChange({ ...box, labels: [...(box.labels || []), { text: "" }] });
  }, []);
  return (
    <>
      <NumberInput
        label="width"
        value={box.width}
        onChange={handleChange("width")}
        min={1}
      />
      <NumberInput
        label="height"
        value={box.height}
        onChange={handleChange("height")}
        min={1}
      />
      <NumberInput
        label="depth"
        value={box.depth}
        onChange={handleChange("depth")}
        min={1}
      />
      <NumberInput
        label="wallThickness"
        value={box.wallThickness}
        onChange={handleChange("wallThickness")}
        min={1}
      />
      {box.labels?.map((label, index) => (
        <Fragment key={index}>
          <TextInput
            label={"text"}
            value={label.text}
            onChange={handleChangeLabel(index, "text")}
          />
          <NumberInput
            label="fontSize"
            value={label.fontSize ?? DEFAULT_FONT_SIZE}
            onChange={handleChangeLabel(index, "fontSize")}
            min={1}
          />
        </Fragment>
      ))}
      <button type="button" onClick={handleAddLabel}>
        Add label
      </button>
      <button type="submit">Submit</button>
    </>
  );
};
