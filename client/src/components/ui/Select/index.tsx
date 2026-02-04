import BaseSelect, { type SelectProps } from '@mui/material/Select';
import type { PropsWithChildren } from 'react';

export const Select = ({ children, sx, ...props }: PropsWithChildren<SelectProps>) => (
  <BaseSelect
    sx={{
      minHeight: {
        xs: 44,
        sm: 40,
      },
      minWidth: 240,
      borderRadius: 2,
      bgcolor: 'background.paper',
      '& .MuiSelect-select': {
        fontSize: 'inherit',
      },
      '& .MuiTypography-root': {
        fontSize: {
          xs: 'body1.fontSize',
          sm: 'body2.fontSize',
        },
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '1px',
        borderColor: 'divider',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderWidth: '1px',
        borderColor: 'divider',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '1px',
        borderColor: 'divider',
      },
      ...sx,
    }}
    MenuProps={{
      PaperProps: {
        elevation: 4,
        sx: {
          mt: 0.5,
          minWidth: 560,
        },
      },
      ...props.MenuProps,
    }}
    {...props}
  >
    {children}
  </BaseSelect>
);
