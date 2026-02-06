import { Avatar, Stack, Typography, Skeleton, Divider } from '@mui/material';

import { Show } from '~/components/ui';
import type { User } from '~/services/user/user.types';

type UserHeaderProps = {
  user?: User;
  isLoading: boolean;
};

export const UserHeader = ({ user, isLoading }: UserHeaderProps) => {
  return (
    <Show when={!isLoading} fallback={<SkeletonLoader />}>
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem />}
        borderRadius={2}
        border="1px solid"
        borderColor="divider"
        p={3}
        bgcolor="background.paper"
        width="100%"
      >
        <Stack direction="row" spacing={2} alignItems="center" minWidth={200}>
          <Avatar sx={{ height: 56, width: 56 }}>{user?.name?.charAt(0) ?? 'U'}</Avatar>
          <Stack>
            <Typography variant="h5" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.username}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={1.5} flex={1}>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="text.secondary" width={140} fontWeight={500}>
              Employee ID:
            </Typography>
            <Typography variant="body2">{user?.id}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="text.secondary" width={140} fontWeight={500}>
              Position:
            </Typography>
            <Typography variant="body2">{user?.position ?? '-'}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="text.secondary" width={140} fontWeight={500}>
              Employment Status:
            </Typography>
            <Typography variant="body2">Regular</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Show>
  );
};

const SkeletonLoader = () => {
  return (
    <Stack
      direction="row"
      spacing={3}
      alignItems="center"
      divider={<Divider orientation="vertical" flexItem />}
      borderRadius={2}
      border="1px solid"
      borderColor="divider"
      p={3}
      bgcolor="background.paper"
      width="100%"
    >
      <Stack direction="row" spacing={2} alignItems="center" minWidth={200}>
        <Skeleton variant="circular" width={52} height={52} />
        <Stack>
          <Typography variant="h5" fontWeight="bold">
            <Skeleton width={150} />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <Skeleton width={120} />
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={1.5} flex={1}>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" color="text.secondary" width={140} fontWeight={500}>
            Employee ID:
          </Typography>
          <Typography variant="body2">
            <Skeleton width={80} />
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" color="text.secondary" width={140} fontWeight={500}>
            Position:
          </Typography>
          <Typography variant="body2">
            <Skeleton width={100} />
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" color="text.secondary" width={140} fontWeight={500}>
            Employment Status:
          </Typography>
          <Typography variant="body2">
            <Skeleton width={80} />
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
