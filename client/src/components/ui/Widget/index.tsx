import { OpenInNewOutlined } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type React from 'react';
import { CardContainer } from '../CardContainer';

type WidgetProps = {
  title: string;
  to: string;
  children: React.ReactNode;
};

export const Widget = ({ title, to, children }: WidgetProps) => {
  const navigate = useNavigate();

  return (
    <CardContainer spacing={1}>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontWeight="medium" variant="body1">
          {title}
        </Typography>
        <IconButton onClick={() => navigate(to)} size="small">
          <OpenInNewOutlined fontSize="inherit" />
        </IconButton>
      </Stack>

      {/* Content */}
      {children}
    </CardContainer>
  );
};
