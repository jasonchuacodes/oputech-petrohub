import {
  Stack,
  Select as MUISelect,
  Typography,
  MenuItem,
  Chip,
  Box,
  type SelectChangeEvent,
} from '@mui/material';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { useState } from 'react';

type SelectOption = {
  label: string;
  value: string;
};

type MultiSelectProps<T extends FieldValues> = {
  name: Path<T>;
  onChange: (e: SelectChangeEvent<string[]>) => void;
  options: SelectOption[];

  register?: UseFormRegister<T>;
  label?: string;
  required?: boolean;
  selected?: string[];
  placeholder?: string;
};

export const MultiSelect = <T extends object>({
  options,
  label,
  name,
  onChange,
  required,
  selected,
  placeholder,
  register,
}: MultiSelectProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack spacing={0.5} width="100%">
      <Typography variant="body2" fontWeight="medium" color="text.primary">
        {label}
        {required && (
          <Typography component="span" color="error">
            {' '}
            *
          </Typography>
        )}
      </Typography>
      <MUISelect
        {...(register ? register(name) : {})}
        onChange={onChange}
        value={selected || []}
        multiple
        size="small"
        displayEmpty
        open={options.length === 0 ? false : open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slotProps={{
          input: {
            sx: {
              fontSize: 'body2.fontSize',
            },
          },
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
          },
          borderRadius: 2,
        }}
        renderValue={(selected) => {
          if (selected.length === 0 && placeholder) {
            return <Typography color="text.secondary">{placeholder}</Typography>;
          }
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <Chip
                    key={value}
                    label={option?.label}
                    size="small"
                  />
                );
              })}
            </Box>
          );
        }}
      >
        {options.map(({ label, value }: SelectOption) => (
          <MenuItem key={`option-${value}`} value={value} sx={{ fontSize: 'body2.fontSize' }}>
            {label}
          </MenuItem>
        ))}
      </MUISelect>
    </Stack>
  );
};
