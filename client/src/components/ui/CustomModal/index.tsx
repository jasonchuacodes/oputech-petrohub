import { Close } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Icon,
  IconButton,
  Modal,
  Stack,
  Typography,
  type ModalProps,
} from '@mui/material';
import type { ComponentType, ReactNode } from 'react';

import { Button } from '~/components/ui/Button';

type Props = Omit<ModalProps, 'children'> & {
  title: string;
  onClose: () => void;
  type?: 'default' | 'danger';
  subheader?: string | ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  maxWidth?: number;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  icon?: ComponentType;
  hideActions?: boolean;
};

export const CustomModal = ({
  title,
  subheader,
  children,
  disabled,
  loading,
  maxWidth,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  onClose,
  onSubmit,
  type = 'default',
  icon,
  hideActions = false,
  ...modalProps
}: Props) => {
  return (
    <Modal
      onClose={(_, reason) => { if (reason !== 'backdropClick') onClose(); }}
      disableAutoFocus
      disableEnforceFocus
      {...modalProps}
      disablePortal
    >
      <Box>
        <Card
          sx={{
            position: 'absolute',
            maxWidth: maxWidth ?? 560,
            top: '50%',
            left: '50%',
            width: { xs: '98%', sm: '95%' },
            maxHeight: { xs: '90vh', sm: 720 },
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Box p={2} sx={{ flexShrink: 0 }}>
            <Stack direction="row" alignItems="start" spacing={3}>
              {icon && (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: type === 'danger' ? 'error.main' : 'primary.main',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 2,
                      left: 2,
                      width: '100%',
                      height: '100%',
                      bgcolor: type === 'danger' ? 'error.main' : 'primary.main',
                      borderRadius: 2,
                      opacity: 0.2,
                      transform: 'rotate(15deg)',
                      transformOrigin: 'bottom right',
                      zIndex: -1,
                    },
                  }}
                >
                  <Icon
                    component={icon}
                    sx={{
                      color: 'common.white',
                      fontSize: 24,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 'h5.fontSize',
                    color: 'text.primary',
                    fontWeight: 'bold',
                  }}
                >
                  {title}
                </Typography>
                {subheader && (
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      fontSize: 'body2.fontSize',
                      color: 'text.secondary',
                    }}
                  >
                    {subheader}
                  </Typography>
                )}
              </Box>
              <IconButton aria-label="close" onClick={onClose}>
                <Close />
              </IconButton>
            </Stack>
          </Box>
          {children && (
            <CardContent
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                pt: 2,
                minHeight: 0,
              }}
            >
              {children}
            </CardContent>
          )}
          {!hideActions && (
            <CardActions
              sx={{
                width: '100%',
                borderTop: '1px solid',
                borderColor: 'divider',
                justifyContent: 'flex-end',
                p: 2,
                flexShrink: 0,
              }}
            >
              <Button
                disableElevation={true}
                onClick={onCancel ?? onClose}
                type="button"
                variant="outlined"
              >
                {cancelText}
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
          )}
        </Card>
      </Box>
    </Modal>
  );
};
