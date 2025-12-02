import { Avatar, Stack, Typography, Skeleton } from '@mui/material';

import type { User } from '~/services/user/user.types';

type UserHeaderProps = {
  user?: User;
  isLoading: boolean;
};

export const UserHeader = ({ user, isLoading }: UserHeaderProps) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {isLoading ? (
        <Stack spacing={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rounded" width={160} height={40} />
        </Stack>
      ) : (
        <>
          <Avatar>{user?.name?.charAt(0) ?? 'U'}</Avatar>
          <Stack>
            <Typography variant="body1" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user?.role}
            </Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
};
