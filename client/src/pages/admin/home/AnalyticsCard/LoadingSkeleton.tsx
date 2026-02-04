import { Skeleton, Stack } from '@mui/material';

import { Show } from '~/components/ui';

type LoadingSkeletonProps = {
  graph?: boolean;
};

export const LoadingSkeleton = ({ graph = true }: LoadingSkeletonProps) => (
  <Stack
    sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      flex: 1,
    }}
  >
    <Stack spacing={1}>
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="40%" height={40} />
    </Stack>

    <Show when={graph}>
      <Skeleton variant="rounded" width="100%" height={160} />
    </Show>

    <Skeleton variant="text" width="50%" height={20} />
  </Stack>
);
