import { MoreVertOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, IconButton } from '@mui/material';
import { useState } from 'react';

import { useDisclosure } from '~/hooks/useDisclosure';
import { CancelPayrollRunModal } from './CancelPayrollRunModal';

type Props = {
  onConfirm: () => Promise<void>;
  loading: boolean;
  periodStart?: string;
  periodEnd?: string;
};

export const MoreDetailsMenu = ({ onConfirm, loading, periodStart, periodEnd }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const cancelDisclosure = useDisclosure();

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleCancelClick = () => {
    closeMenu();
    cancelDisclosure.onOpen();
  };

  return (
    <>
      <IconButton onClick={openMenu} size="small">
        <MoreVertOutlined fontSize="inherit" sx={{ color: 'text.secondary' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: { elevation: 4, sx: { mt: 0.5, minWidth: 140 } },
        }}
      >
        <MenuItem onClick={handleCancelClick}>
          <Typography variant="body2" color="error">Cancel</Typography>
        </MenuItem>
      </Menu>

      <CancelPayrollRunModal
        open={cancelDisclosure.open}
        onClose={cancelDisclosure.onClose}
        onConfirm={onConfirm}
        loading={loading}
        periodStart={periodStart}
        periodEnd={periodEnd}
      />
    </>
  );
};
