import { ComponentProps, FC } from "react";

export const TextInput: FC<
  Omit<ComponentProps<"input">, "onChange"> & {
    value: string;
    label: string;
    onChange: (value: string) => void;
  }
> = ({ value, onChange, label, ...props }) => {
  return (
    <label>
      {label}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  );
};
