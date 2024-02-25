import './TextInput.css';

export interface NumberInputProps {
  value: string;
  setValue: (value: string) => void;
  name: string;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  info?: string;
}

export function NumberInput({
  value,
  setValue,
  name,
  label,
  min,
  max,
  disabled,
}: NumberInputProps) {
  return (
    <div className="my-text-input">
      <label htmlFor={`${name}-number-input`}>{label}</label>
      <input
        type="number"
        name={name}
        id={`${name}-number-input`}
        value={`${value}`}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  );
}
