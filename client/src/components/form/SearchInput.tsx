import { type OutlinedInputProps, OutlinedInput, Stack, Typography } from '@mui/material';

type SearchInputProps = Omit<OutlinedInputProps, 'value' | 'onChange'> & {
  label?: string;
  value?: string | null;
  onChange?: (value: string) => void;
};

export const SearchInput = ({
  label,
  placeholder = 'Search',
  value,
  onChange,
  ...props
}: SearchInputProps) => {
  return (
    <Stack spacing={0.5} width="100%">
      {label && <Typography variant='body1' color='text.primary'>{label}</Typography>}
      <OutlinedInput
        placeholder={placeholder}
        size="small"
        fullWidth
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        sx={{
          bgcolor: 'background.paper',
          height: 40,
          maxWidth: 560,
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: 'text.primary',
          },
        }}
        slotProps={{
          input: {
            sx: {
              fontSize: 'body1.fontSize',
            },
          },
        }}
        {...props}
      />
    </Stack>
  );
};
