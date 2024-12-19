import { FC, useCallback } from "react";
import { Box } from "./store.ts";
import { NumberInput } from "./NumberInput.tsx";

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
      <button type="submit">Submit</button>
    </>
  );
};
