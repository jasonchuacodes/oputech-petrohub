import { KeyboardDoubleArrowRightOutlined } from '@mui/icons-material';
import { alpha, IconButton } from '@mui/material';

import theme from '~/theme';

export const Toggler = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <IconButton
      size="small"
      sx={{
        position: 'absolute',
        bottom: 8,
        right: open ? 8 : 4,
        width: 48,
        borderRadius: 2,
        color: 'divider',
        bgcolor: alpha(theme.palette.background.paper, 0.05),
        transition: 'background-color 0.3s ease',
        '&:hover': {
          bgcolor: alpha(theme.palette.background.paper, 0.1),
        },
      }}
      onClick={() => setOpen(!open)}
    >
      <KeyboardDoubleArrowRightOutlined
        fontSize="small"
        sx={{
          transition: 'transform 0.3s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </IconButton>
  );
};
