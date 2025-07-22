import { FilterAltOutlined } from '@mui/icons-material';
import { Stack } from '@mui/material';

import { TextField } from '~/components/form';
import { Button } from '~/components/ui';

export const SearchInput = () => {
  return (
    <Stack alignItems="end" direction="row" spacing={1} width="50%" maxWidth={560}>
      <TextField
        name="search"
        placeholder="Search employee"
        size="small"
        sx={{ bgcolor: 'background.paper' }}
      />
      <Button variant="outlined" size="small" sx={{ minWidth: 40, height: 40 }}>
        <FilterAltOutlined fontSize="small" />
      </Button>
    </Stack>
  );
};
