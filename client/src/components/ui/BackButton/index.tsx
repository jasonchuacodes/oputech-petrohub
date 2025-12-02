import { ArrowBackOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type BackButtonProps = { to: string; text?: string; onClick?: () => void };

export const BackButton = ({ to, text = 'Back', onClick }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    if (onClick) {
      onClick();
    }

    navigate(to);
  }, [navigate, onClick, to]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      onClick={handleNavigate}
      sx={{ cursor: 'pointer', color: 'text.secondary' }}
    >
      <ArrowBackOutlined fontSize="inherit" />
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
};
