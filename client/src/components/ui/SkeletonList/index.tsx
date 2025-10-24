import { Skeleton, Stack } from "@mui/material";

interface SkeletonListProps {
  rows?: number;
  height?: number | string;
}

export const SkeletonList = ({ rows = 3, height = 40 }: SkeletonListProps) => {
  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} height={height} variant="rounded" />
      ))}
    </Stack>
  );
};
