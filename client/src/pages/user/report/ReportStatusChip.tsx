import { Stack, Typography, Icon } from '@mui/material';
import type { ComponentType } from 'react';

type LabelWithIconProps = {
  icon: ComponentType;
  label: string;
  color: string;
  isHexColor?: boolean;
  sx?: object;
};

export const ReportStatusChip = ({
  icon,
  label,
  color,
  isHexColor = false,
  sx = {},
}: LabelWithIconProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{
        borderRadius: 24 / 2,
        bgcolor: isHexColor ? color : `${color}.alpha`,
        fontSize: 12,
        color: isHexColor ? color : `${color}.main`,
        fontWeight: 'normal',
        px: 1,
        py: 0.5,
        ...sx,
      }}
    >
      {icon && <Icon component={icon} sx={{ height: 16, width: 16 }} />}
      <Typography variant="body2" sx={{ lineHeight: 1 }}>
        {label}
      </Typography>
    </Stack>
  );
};
