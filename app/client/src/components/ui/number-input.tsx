import { useState, type ComponentProps, type Ref } from 'react';
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { cn } from '~/utils/cn';

type NumberInputProps<T extends FieldValues> = Omit<ComponentProps<'input'>, 'name'> & {
  control: Control<T>;
  name: Path<T>;
  step?: number;
  min?: number;
  max?: number;
};

type NumberField = {
  name: string;
  onBlur: () => void;
  onChange: (value: number | undefined) => void;
  ref: Ref<HTMLInputElement>;
  value: number | undefined;
};

type NumberInputFieldProps = Omit<
  ComponentProps<'input'>,
  'name' | 'value' | 'onChange' | 'type'
> & {
  field: NumberField;
  fieldState: ControllerFieldState;
  step: number;
  min?: number;
  max?: number;
};

function NumberInputField({
  field,
  fieldState,
  step,
  min,
  max,
  className,
  ...props
}: NumberInputFieldProps) {
  const decimals = String(step).includes('.') ? String(step).split('.')[1].length : 0;
  const round = (value: number) => Number(value.toFixed(decimals));
  const [text, setText] = useState(() => field.value?.toString() ?? '');
  const [lastValue, setLastValue] = useState(field.value);

  if (field.value !== lastValue) {
    setLastValue(field.value);
    setText(field.value?.toString() ?? '');
  }

  return (
    <div
      className={cn(
        'flex h-11 overflow-hidden rounded-sm border border-input bg-card focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/10 wide:h-10',
        fieldState.error && 'border-destructive ring-destructive/20',
        className,
      )}
    >
      <input
        {...props}
        {...field}
        autoComplete="off"
        value={text}
        placeholder={props.placeholder ?? '0'}
        type="number"
        inputMode={props.inputMode ?? (decimals > 0 ? 'decimal' : 'numeric')}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const nextText = event.target.value;
          setText(nextText);
          if (nextText === '') {
            setLastValue(undefined);
            field.onChange(undefined);
            return;
          }
          const parsed = event.target.valueAsNumber;
          const value = Number.isNaN(parsed) ? undefined : round(parsed);
          setLastValue(value);
          field.onChange(value);
        }}
        className="min-w-0 flex-1 [appearance:textfield] bg-transparent px-3 text-base outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:opacity-50 wide:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}

export function NumberInput<T extends FieldValues>({
  control,
  name,
  step = 1,
  min,
  max,
  className,
  ...props
}: NumberInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <NumberInputField
          {...props}
          field={field as NumberField}
          fieldState={fieldState}
          step={step}
          min={min}
          max={max}
          className={className}
        />
      )}
    />
  );
}
