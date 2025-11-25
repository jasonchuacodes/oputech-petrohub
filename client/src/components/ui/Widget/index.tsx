import { OpenInNewOutlined } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography, type StackProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type React from 'react';

import { CardContainer } from '../CardContainer';

type WidgetProps = {
  title: string;
  to: string;
  children: React.ReactNode;
  props?: StackProps;
};

export const Widget = ({ title, to, children, props }: WidgetProps) => {
  const navigate = useNavigate();

  return (
    <CardContainer
      maxHeight={560}
      spacing={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
      {...props}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight="medium" variant="body1">
          {title}
        </Typography>
        <IconButton onClick={() => navigate(to)} size="small">
          <OpenInNewOutlined fontSize="inherit" />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </CardContainer>
  );
};
