import { Stack, TextField as MUITextField, Typography, type TextFieldProps } from '@mui/material';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: Path<T>;
  register?: UseFormRegister<T>;
  placeholder: string;
  required?: boolean;
  label?: string;
  value?: string | null;
  mode?: 'edit' | 'view';
} & TextFieldProps;

export const TextField = <T extends object>({
  name,
  register,
  label,
  placeholder,
  required = false,
  value,
  mode = 'edit',
  ...muiProps
}: Props<T>) => {
  return (
    <Stack justifyContent="center" spacing={0.5} width="100%">
      <Typography fontWeight="bold" color="text.secondary">
        {label}
        {required && (
          <Typography component="span" color="error">
            {' '}
            *
          </Typography>
        )}
      </Typography>
      {mode === 'edit' ? (
        <MUITextField
          {...(register ? register(name) : {})}
          {...muiProps}
          fullWidth
          placeholder={placeholder}
          size="small"
        />
      ) : (
        <Typography sx={{ height: 40 }}>
          {value === '' || value === null ? 'N/A' : value}
        </Typography>
      )}
    </Stack>
  );
};
