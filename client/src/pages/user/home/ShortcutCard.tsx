import { Avatar, Icon, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/ui';

type ShortcutCardProps = {
  title: string;
  icon: React.ElementType;
  to: string;
};

export const ShortcutCard = ({ title, icon, to }: ShortcutCardProps) => {
  const navigate = useNavigate();

  const handleRedirect = () => navigate(to);

  return (
    <Button
      onClick={handleRedirect}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: 0.5,
        bgcolor: 'background.paper',
        border: '1px solid', 
        borderColor: 'divider',
        borderRadius: 2,
      }}
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
    </Button>
  );
};
