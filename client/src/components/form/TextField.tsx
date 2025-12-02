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
      {label && (
        <>
          <Typography variant="body2" fontWeight="medium" color="text.secondary">
            {label}
            {required && (
              <Typography component="span" color="error">
                {' '}
                *
              </Typography>
            )}
          </Typography>
        </>
      )}

      {mode === 'edit' ? (
        <MUITextField
          {...(register ? register(name) : {})}
          {...muiProps}
          fullWidth
          placeholder={placeholder}
          size="small"
          slotProps={{
            htmlInput: {
              sx: {
                fontSize: 'body2.fontSize',
              },
            },
          }}
        />
      ) : (
        <Typography variant="body2" sx={{ height: 40, display: 'flex', alignItems: 'center' }}>
          {value === '' || value === null ? 'N/A' : value}
        </Typography>
      )}
    </Stack>
  );
};
