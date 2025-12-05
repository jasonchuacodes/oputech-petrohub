import { Avatar, Typography } from '@mui/material';

type AvatarPickerProps = {
  name?: string;
};

export const AvatarPicker = ({ name }: AvatarPickerProps) => {
  // TODO: Implement avatar upload functionality
  const handleClick = () => {
    console.log('Avatar picker clicked - upload functionality not yet implemented');
  };

  const getInitial = () => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
      <Avatar
        sx={{
          width: 80,
          height: 80,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
        }}
        onClick={handleClick}
      >
        <Typography fontSize="inherit">{getInitial()}</Typography>
      </Avatar>
  );
};
