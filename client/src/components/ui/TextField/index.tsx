import { Stack, TextField as MUITextField, Typography, type TextFieldProps } from '@mui/material';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  placeholder: string;
  required?: boolean;
} & TextFieldProps;

export const TextField = <T extends object>({
  name,
  register,
  label,
  placeholder,
  required = false,
  ...muiProps
}: Props<T>) => {
  return (
    <Stack spacing={0.5}>
      <Typography fontSize="small" fontWeight="bold" color="text.secondary">
        {label}
        {required && (
          <Typography component="span" color="error">
            {' '}
            *
          </Typography>
        )}
      </Typography>
      <MUITextField {...register(name)} placeholder={placeholder} size="small" {...muiProps} />
    </Stack>
  );
};
