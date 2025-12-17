import BaseChip, { type ChipProps as MuiChipProps } from '@mui/material/Chip';

export type ChipProps = {
  label: string;
  color?: 'primary' | 'error' | 'warning' | 'info' | 'success';
  sx?: MuiChipProps['sx'];
};

export const Chip = ({ label, color = 'primary', sx }: ChipProps) => (
  <BaseChip
    label={label}
    sx={{
      borderRadius: 2, // 8px
      bgcolor: `${color}.alpha`,
      fontSize: 12,
      height: 24,
      fontWeight: 'normal',
      ...sx,
    }}
  />
);
