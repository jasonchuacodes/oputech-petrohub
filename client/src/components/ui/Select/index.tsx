import BaseSelect, { type SelectProps } from '@mui/material/Select';
import type { PropsWithChildren } from 'react';

export const Select = ({ children, sx, ...props }: PropsWithChildren<SelectProps>) => (
  <BaseSelect
    sx={{
      minWidth: 240,
      borderRadius: 2,
      bgcolor: 'background.paper',
      '& .MuiSelect-select': {
        fontSize: 'body2.fontSize',
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
