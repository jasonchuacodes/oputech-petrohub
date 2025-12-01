import {
  CheckOutlined,
  ContentCopyOutlined,
  RefreshOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { ButtonGroup, IconButton, OutlinedInput, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button } from '~/components/ui';
import { generatePassword } from '~/utils/passwordUtils';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  copiable?: boolean;
  randomizer?: boolean;
};

export const PasswordField = <T extends object>({
  name,
  control,
  label,
  required = false,
  placeholder,
  copiable = false,
  randomizer = true,
}: Props<T>) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCheckIcon, setShowCheckIcon] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleCopy = async () => {
          const value = field.value || '';
          if (!value) {
            toast.error('No password to copy');
            return;
          }

          try {
            await navigator.clipboard.writeText(value);
            setShowCheckIcon(true);
            toast.success('Password copied to clipboard');

            setTimeout(() => {
              setShowCheckIcon(false);
            }, 2000);
          } catch (error) {
            toast.error('Failed to copy password');
            console.error(error);
          }
        };

        const handleGenerate = () => {
          const newPassword = generatePassword();
          field.onChange(newPassword);
        };

        return (
          <Stack justifyContent="center" spacing={0.5} width="100%">
            <Typography fontWeight="bold" color="text.secondary">
              {label}
              {required && (
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              )}
            </Typography>
            <Stack direction="row" spacing={1}>
              <OutlinedInput
                {...field}
                size="small"
                type={isVisible ? 'text' : 'password'}
                placeholder={placeholder}
                fullWidth
                endAdornment={
                  <IconButton size="small" onClick={() => setIsVisible(!isVisible)} edge="end">
                    {isVisible ? (
                      <VisibilityOutlined fontSize="inherit" />
                    ) : (
                      <VisibilityOffOutlined fontSize="inherit" />
                    )}
                  </IconButton>
                }
              />
              <ButtonGroup variant="outlined" size="small">
                {copiable && (
                  <Button disabled={!field.value} size="small" onClick={handleCopy}>
                    {showCheckIcon ? (
                      <CheckOutlined fontSize="inherit" />
                    ) : (
                      <ContentCopyOutlined fontSize="inherit" />
                    )}
                  </Button>
                )}
                {randomizer && (
                  <Button size="small" onClick={handleGenerate} startIcon={<RefreshOutlined />}>
                    Generate
                  </Button>
                )}
              </ButtonGroup>
            </Stack>
          </Stack>
        );
      }}
    />
  );
};
