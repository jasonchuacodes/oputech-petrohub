import {
  Stack,
  Select as MUISelect,
  Typography,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  onChange: (e: SelectChangeEvent) => void;
  options: SelectOption[];

  register?: UseFormRegister<T>;
  label?: string;
  required?: boolean;
  selected?: string;
};

export const Select = <T extends object>({
  options,
  label,
  name,
  onChange,
  required,
  selected,
  register,
}: SelectProps<T>) => {
  return (
    <Stack spacing={0.5} width="100%">
      <Typography fontWeight="bold" color="text.secondary">
        {label}
        {required && (
          <Typography component="span" color="error">
            {' '}
            *
          </Typography>
        )}
      </Typography>
      <MUISelect
        {...(register ? register(name) : {})}
        onChange={onChange}
        value={selected}
        size="small"
      >
        {options.map(({ label, value }: SelectOption) => (
          <MenuItem key={`option-${value}`} value={value}>
            {label}
          </MenuItem>
        ))}
      </MUISelect>
    </Stack>
  );
};
