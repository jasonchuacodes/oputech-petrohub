import { Avatar, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type ShortcutCardProps = {
  title: string;
  icon: React.ElementType;
  to: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const ShortcutCard = ({ title, icon, to, onClick, disabled = false }: ShortcutCardProps) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <Stack
      onClick={handleRedirect}
      justifyContent="center"
      alignItems="center"
      flex={1}
      gap={0.5}
      p={2}
      bgcolor="background.paper"
      borderRadius={2}
      sx={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Avatar
        sx={{
          height: 32,
          width: 32,
          bgcolor: 'text.primary',
        }}
      >
        <Icon component={icon} fontSize="small" sx={{ color: 'common.white' }} />
      </Avatar>
      <Typography variant="body2" color="text.primary">
        {title}
      </Typography>
    </Stack>
  );
};
