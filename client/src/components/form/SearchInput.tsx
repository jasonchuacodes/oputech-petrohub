import { FilterAltOutlined, SearchOutlined } from '@mui/icons-material';
import { InputAdornment, Stack } from '@mui/material';

import { TextField } from '~/components/form';
import { Button } from '~/components/ui';

export const SearchInput = ({ placeholder = 'Search' }: { placeholder?: string }) => {
  return (
    <Stack alignItems="end" direction="row" spacing={1} width="100%" maxWidth={560}>
      <TextField
        name="search"
        placeholder={placeholder}
        size="small"
        fullWidth={true}
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
      <Button variant="outlined" size="small" sx={{ minWidth: 40, height: 40, flexShrink: 0 }}>
        <FilterAltOutlined fontSize="small" />
      </Button>
    </Stack>
  );
};
