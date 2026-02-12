import { MoreHorizOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, IconButton, Divider } from '@mui/material';
import { useState } from 'react';

import type { PayslipData } from '~/context/payroll/PayslipContext';
import { usePayslipContext } from '~/context/payroll/usePayslipContext';
import { useDisclosure } from '~/hooks/useDisclosure';

import { ViewPayslipModal } from './ViewPayslipModal';
import { EditPayslipModal } from './EditPayslipModal';

export const MoreDetailsMenu = () => {
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

  const handleDelete = () => {
    closeMenu();
    console.log('delete', payslipId);
  };

  const handleSavePayslip = (data: { grossPay: number; deductions: PayslipData['deductions'] }) => {
    console.log('Save payslip:', payslipId, data);
    // TODO: Update payslip data (future implementation)
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
        <Divider />
        <MenuItem onClick={handleDelete}>
          <Typography variant="body2" color="error">
            Delete
          </Typography>
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
        onSave={handleSavePayslip}
      />
    </>
  );
};
