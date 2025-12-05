import { SearchOutlined } from '@mui/icons-material';
import { InputAdornment, OutlinedInput, Stack } from '@mui/material';

type SearchInputProps = {
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string) => void;
};

export const SearchInput = ({ placeholder = 'Search', value, onChange }: SearchInputProps) => {
  return (
    <Stack alignItems="end" direction="row" spacing={1} width="100%" maxWidth={560}>
      <OutlinedInput
        placeholder={placeholder}
        size="small"
        fullWidth
        value={value ?? ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        sx={{ bgcolor: 'background.paper', height: 40 }}
        slotProps={{
          input: {
            sx: {
              fontSize: 'body2.fontSize',
            },
          },
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchOutlined sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        }
      />
    </Stack>
  );
};
