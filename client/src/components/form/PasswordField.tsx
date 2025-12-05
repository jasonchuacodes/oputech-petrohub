import {
  CheckOutlined,
  ContentCopyOutlined,
  RefreshOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { ButtonGroup, IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button } from '~/components/ui';
import { generatePassword } from '~/utils/password';
import { Input } from './Input';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  copiable?: boolean;
  randomizer?: boolean;
};

export const PasswordField = <T extends FieldValues>({
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

  // Get access to field value and onChange
  const { field } = useController({ name, control });
  const fieldValue = field.value ?? '';

  const handleCopy = async () => {
    if (!fieldValue) {
      toast.error('No password to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(fieldValue);
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

  const visibilityToggle = (
    <IconButton size="small" onClick={() => setIsVisible(!isVisible)} edge="end">
      {isVisible ? (
        <VisibilityOutlined fontSize="inherit" />
      ) : (
        <VisibilityOffOutlined fontSize="inherit" />
      )}
    </IconButton>
  );

  return (
    <Stack spacing={0.5} width="100%">
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <Input
          name={name}
          control={control}
          type={isVisible ? 'text' : 'password'}
          label={label}
          required={required}
          placeholder={placeholder}
          endAdornment={visibilityToggle}
          fullWidth
        />
        {(copiable || randomizer) && (
          <ButtonGroup
            variant="outlined"
            size="small"
            sx={{ alignSelf: 'flex-end', mb: 0.5, height: '2.3rem' }}
          >
            {copiable && (
              <Button disabled={!fieldValue} size="small" onClick={handleCopy}>
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
        )}
      </Stack>
    </Stack>
  );
};
