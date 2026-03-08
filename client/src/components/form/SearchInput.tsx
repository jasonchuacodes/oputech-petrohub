import { SearchOutlined } from '@mui/icons-material';
import { type OutlinedInputProps, OutlinedInput } from '@mui/material';

type SearchInputProps = Omit<OutlinedInputProps, 'value' | 'onChange'> & {
  value?: string | null;
  onChange?: (value: string) => void;
};

export const SearchInput = ({
  placeholder = 'Search',
  value,
  onChange,
  slotProps,
  ...props
}: SearchInputProps) => {
  const mergedSlotProps: OutlinedInputProps['slotProps'] = {
    input: {
      sx: {
        fontSize: 'body2.fontSize',
        ...slotProps?.input?.sx,
      },
      ...slotProps?.input,
    },
    root: {
      sx: {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'divider',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: '2px',
        },
        bgcolor: 'background.paper',
        borderRadius: 2,
        maxWidth: 400,
        height: { xs: 44, sm: 40 },
        ...slotProps?.root?.sx,
      },
      ...slotProps?.root,
    },
  };

  return (
    <OutlinedInput
      placeholder={placeholder}
      size="small"
      fullWidth
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      startAdornment={<SearchOutlined sx={{ mr: 1 }} />}
      {...props}
      slotProps={mergedSlotProps}
    />
  );
};
