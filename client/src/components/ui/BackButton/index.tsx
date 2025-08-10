import { ArrowBackOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type BackButtonProps = { to: string; text?: string };

export const BackButton = ({ to, text = 'Back' }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      onClick={() => navigate(to)}
      sx={{ cursor: 'pointer', color: 'text.secondary' }}
    >
      <ArrowBackOutlined fontSize="inherit" />
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
};
