import { TextField } from '@mui/material';
import { Controller, type Control, type Path } from 'react-hook-form';
import { formatDigitsWithPattern } from '../../utils/textUtils';

type Props<T extends object> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  pattern: string;
  variant?: 'standard' | 'outlined' | 'filled';
};

export const InputWithFormat = <T extends object>({
  name,
  control,
  placeholder,
  pattern,
  variant = 'standard',
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => {
        const safeValue = value ?? '';
        const maxRawLength = (pattern.match(/9/g) || []).length;
        const rawDigits = safeValue.replace(/\D/g, '').slice(0, maxRawLength);

        const { formatted } = formatDigitsWithPattern(rawDigits, pattern);

        return (
          <TextField
            {...field}
            value={formatted}
            onChange={(e) => {
              const rawDigits = e.target.value.replace(/\D/g, '');
              const slicedRaw = rawDigits.slice(0, maxRawLength);
              onChange(slicedRaw === '' ? null : slicedRaw);
            }}
            fullWidth
            variant={variant}
            placeholder={placeholder}
          />
        );
      }}
    />
  );
};
