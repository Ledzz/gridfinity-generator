import { InputNumber, Radio, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { RadioChangeEvent } from "antd/es/radio/interface";
import { Vec2 } from "manifold-3d";

type ValueType = string | Vec2;

type Vec2WithOptionsProps<T extends ValueType = ValueType> = {
  options: Array<{ label: string; value: string }>;
  value?: T;
  onChange?: (value: T) => void;
  initialValue: Vec2;
  min?: number;
  max?: number;
  step?: number;
};

const CUSTOM_VALUE = "custom";

export function Vec2WithOptions<T extends ValueType = ValueType>({
  options,
  value,
  onChange,
  initialValue,
  min,
  max,
  step,
}: Vec2WithOptionsProps<T>) {
  const [innerSelectValue, setInnerSelectValue] = useState<string | undefined>(
    undefined,
  );
  const [innerValue, setInnerValue] = useState<Vec2 | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const option = options.find((o) => o.value === value);
    setInnerSelectValue(option?.value ?? CUSTOM_VALUE);
    if (!option) {
      setInnerValue(value as Vec2);
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
    (index: number) => (v: number | null | undefined) => {
      if (innerValue && v !== null && v !== undefined) {
        const newValue = [...innerValue];
        newValue[index] = v;
        setInnerValue(newValue as Vec2);
        // @ts-expect-error TODO
        onChange?.(newValue as Vec2);
      } else {
        setInnerValue(null);
        // @ts-expect-error TODO
        onChange?.(null);
      }
    },
    [innerValue, onChange],
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
      {innerSelectValue === CUSTOM_VALUE && typeof innerValue !== "number" ? (
        <div>
          <InputNumber
            min={min}
            max={max}
            step={step}
            value={innerValue?.[0]}
            onChange={handleNumberChange(0)}
          />
          <InputNumber
            min={min}
            max={max}
            step={step}
            value={innerValue?.[1]}
            onChange={handleNumberChange(1)}
          />
        </div>
      ) : null}
    </>
  );
}
