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
  title: string;
  onClose: () => void;
  type?: 'default' | 'danger';
  subheader?: string;
  children?: ReactNode;
  disabled?: boolean;
  maxWidth?: number;
  loading?: boolean;
  submitText?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
};

export const CustomModal = ({
  title,
  subheader,
  children,
  disabled,
  loading,
  maxWidth,
  submitText = 'Submit',
  onCancel,
  onClose,
  onSubmit,
  type = 'default',
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
            <Button
              disableElevation={true}
              onClick={onCancel ?? onClose}
              type="button"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              disabled={disabled}
              loading={loading}
              type="submit"
              variant="contained"
              onClick={onSubmit}
              color={type === 'danger' ? 'error' : 'primary'}
            >
              {submitText}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
