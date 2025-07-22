import { Close } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Modal,
  type ModalProps,
} from '@mui/material';
import type { ReactNode } from 'react';

import { Button } from '~/components/ui/Button';

type Props = ModalProps & {
  onClose: () => void;
  onCancel?: () => void;
  title: string;
  subheader?: string;
  children?: ReactNode;
  disabledSubmit?: boolean;
  maxWidth?: number;
  loading?: boolean;
};

export const CustomModal = ({
  onCancel,
  onClose,
  title,
  subheader,
  children,
  disabledSubmit,
  loading,
  maxWidth,
  ...modalProps
}: Props) => {
  return (
    <Modal onClose={onClose} disableAutoFocus disableEnforceFocus {...modalProps}>
      <Box>
        <Card
          sx={{
            position: 'absolute',
            maxWidth: maxWidth ? maxWidth : 720,
            maxHeight: 720,
            top: '50%',
            left: '50%',
            width: '75%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CardHeader
            onClose={onClose}
            subheader={subheader}
            title={title}
            action={
              <IconButton aria-label="close" onClick={onClose}>
                <Close />
              </IconButton>
            }
          />
          <CardContent
            sx={{
              flexGrow: 1,
              overflow: 'auto',
            }}
          >
            {children}
          </CardContent>
          <CardActions sx={{ justifySelf: 'flex-end', p: 2 }}>
            <Button disableElevation={true} onClick={onCancel} type="button" variant="outlined">
              Cancel
            </Button>
            <Button disabled={disabledSubmit} loading={loading} type="submit" variant="contained">
              Submit
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
