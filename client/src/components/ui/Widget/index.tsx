import { ArrowOutwardOutlined } from '@mui/icons-material';
import { Box, Stack, Typography, type StackProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type React from 'react';

import { Button } from '../Button';

type WidgetProps = {
  title: string;
  to: string;
  children: React.ReactNode;
  props?: StackProps;
};

export const Widget = ({ title, to, children, props }: WidgetProps) => {
  const navigate = useNavigate();

  return (
    <Stack
      maxHeight={560}
      minHeight={360}
      width="100%"
      height="100%"
      flex={1}
      display="flex"
      flexDirection="column"
      bgcolor="background.paper"
      borderRadius={2}
      {...props}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid"
        borderColor="divider"
      >
        <Typography fontWeight="bold" variant="body1">
          {title}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ height: 28 }}
          onClick={() => navigate(to)}
          endIcon={<ArrowOutwardOutlined fontSize="inherit" />}
        >
          See All
        </Button>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Stack>
  );
};
