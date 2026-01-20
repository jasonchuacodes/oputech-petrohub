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
  ...modalProps
}: Props) => {
  return (
    <Modal onClose={onClose} disableAutoFocus disableEnforceFocus {...modalProps}>
      <Box>
        <Card
          sx={{
            position: 'absolute',
            maxWidth: maxWidth ? maxWidth : 560,
            maxHeight: 720,
            top: '50%',
            left: '50%',
            width: '95%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
            }}
          >
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
              }}
            >
              {children}
            </CardContent>
          )}
          <CardActions
            sx={{
              width: '100%',
              borderTop: '1px solid',
              borderColor: 'divider',
              justifyContent: 'flex-end',
              p: 2,
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
        </Card>
      </Box>
    </Modal>
  );
};
