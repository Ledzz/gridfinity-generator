import { FC } from "react";

export const NumberInput: FC<{
  value: number;
  label: string;
  onChange: (value: number) => void;
}> = ({ value, onChange, label, ...props }) => {
  return (
    <label>
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        {...props}
      />
    </label>
  );
};
