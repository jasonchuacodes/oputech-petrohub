import { Avatar, Stack, Typography } from '@mui/material';

import { type User } from '~/services/user/user.types';
import { toTitleCase } from '~/utils/textUtils';

interface ShiftUserCardProps {
  user: User;
}

export const ShiftUserCard = ({ user }: ShiftUserCardProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Avatar sx={{ width: 36, height: 36 }}>
        <Typography fontSize="small">{user.name.charAt(0).toUpperCase()}</Typography>
      </Avatar>
      <Stack spacing={0.5}>
        <Typography fontWeight={600} fontSize="small">
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {toTitleCase(user.position || 'Employee')}
        </Typography>
      </Stack>
    </Stack>
  );
};
