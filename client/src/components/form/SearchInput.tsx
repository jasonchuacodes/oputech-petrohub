import { SearchOutlined } from '@mui/icons-material';
import { InputAdornment, Stack } from '@mui/material';

import { TextField } from '~/components/form';

type SearchInputProps = {
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string) => void;
};

export const SearchInput = ({ placeholder = 'Search', value, onChange }: SearchInputProps) => {
  return (
    <Stack alignItems="end" direction="row" spacing={1} width="100%" maxWidth={560}>
      <TextField
        name="search"
        placeholder={placeholder}
        size="small"
        fullWidth={true}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        sx={{ bgcolor: 'background.paper', height: 40 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Stack>
  );
};
