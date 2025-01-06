import { InputNumber, Radio, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { RadioChangeEvent } from "antd/es/radio/interface";

type ValueType = string | number;

type NumberWithOptionsProps<T extends ValueType = ValueType> = {
  options: Array<{ label: string; value: string }>;
  value?: T;
  onChange?: (value: T) => void;
  initialValue: number;
  min?: number;
  max?: number;
  step?: number;
};

const CUSTOM_VALUE = "custom";

export function NumberWithOptions<T extends ValueType = ValueType>({
  options,
  value,
  onChange,
  initialValue,
  min,
  max,
  step,
}: NumberWithOptionsProps<T>) {
  const [innerSelectValue, setInnerSelectValue] = useState<string | undefined>(
    undefined,
  );
  const [innerValue, setInnerValue] = useState<number | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const option = options.find((o) => o.value === value);
    setInnerSelectValue(option?.value ?? CUSTOM_VALUE);
    if (!option) {
      setInnerValue(value as number);
    }
  }, [options, value]);

  const handleSelectChange = useCallback(
    (e: RadioChangeEvent) => {
      const v = e.target?.value as string;
      setInnerSelectValue(v);
      if (v === CUSTOM_VALUE) {
        if (innerValue === undefined) {
          setInnerValue(initialValue);
        } else {
          // @ts-expect-error TODO
          onChange?.(innerValue);
        }
      } else {
        // @ts-expect-error TODO
        onChange?.(v);
      }
    },
    [initialValue, innerValue, onChange],
  );

  const handleNumberChange = useCallback(
    (v: number | null | undefined) => {
      setInnerValue(v);
      // @ts-expect-error TODO
      onChange?.(v);
    },
    [onChange],
  );

  return (
    <>
      <Radio.Group value={innerSelectValue} onChange={handleSelectChange}>
        <Space direction="vertical">
          {options.map((o) => (
            <Radio key={o.value} value={o.value}>
              {o.label}
            </Radio>
          ))}
          <Radio value={CUSTOM_VALUE}>Custom</Radio>
        </Space>
      </Radio.Group>
      {innerSelectValue === CUSTOM_VALUE ? (
        <InputNumber
          min={min}
          max={max}
          step={step}
          value={innerValue}
          onChange={handleNumberChange}
        />
      ) : null}
    </>
  );
}
