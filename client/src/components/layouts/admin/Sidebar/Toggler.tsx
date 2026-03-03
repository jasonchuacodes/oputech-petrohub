import { KeyboardDoubleArrowRightOutlined } from '@mui/icons-material';
import { alpha, Box, IconButton } from '@mui/material';

import theme from '~/theme';

export const Toggler = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: open ? 'flex-end' : 'center',
        borderTop: 1,
        borderColor: 'primary.light',
        bgcolor: 'primary.main',
        p: 0.5,
      }}
    >
      <IconButton
        size="small"
        sx={{
          width: 48,
          borderRadius: 2,
          color: 'divider',
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
    </Box>
  );
};
