import { MoreHorizOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, IconButton } from '@mui/material';
import { useState } from 'react';

import { usePayslipContext } from '~/context/payroll/usePayslipContext';
import { useDisclosure } from '~/hooks/useDisclosure';

import { ViewPayslipModal } from '../ViewPayslipModal';
import { EditPayslipModal } from '../EditPayslipModal';

type Props = {
  onUpdateCompensation: (timesheetId: string, amount: number, notes?: string) => void;
};

export const MoreDetailsMenu = ({ onUpdateCompensation }: Props) => {
  const { payslip, payslipId } = usePayslipContext();

  const viewDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleView = () => {
    closeMenu();
    viewDisclosure.onOpen();
  };

  const handleEdit = () => {
    closeMenu();
    editDisclosure.onOpen();
  };

  return (
    <>
      <IconButton onClick={openMenu} size="small">
        <MoreHorizOutlined fontSize="inherit" sx={{ color: 'text.secondary' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id={`payslip-menu-${payslipId}`}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 0.5,
              minWidth: 140,
            },
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <Typography variant="body2">View</Typography>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Typography variant="body2">Edit</Typography>
        </MenuItem>
      </Menu>

      <ViewPayslipModal
        open={viewDisclosure.open}
        onClose={viewDisclosure.onClose}
        payslip={payslip}
      />
      <EditPayslipModal
        open={editDisclosure.open}
        onClose={editDisclosure.onClose}
        payslip={payslip}
        timesheetId={payslipId}
        onSave={onUpdateCompensation}
      />
    </>
  );
};
