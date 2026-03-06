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
        display: { xs: 'none', sm: 'flex' },
        width: 48,
        minHeight: 40,
        borderRadius: 2,
        color: 'divider',
        transition: 'background-color 0.3s ease',
        border: open ? '1px solid' : 'none',
        borderColor: 'primary.light',
        bgcolor: alpha(theme.palette.primary.light, 0.2),
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.light, 0.5),
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
