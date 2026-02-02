import BaseChip, { type ChipProps as MuiChipProps } from '@mui/material/Chip';

export type ChipProps = {
  label?: string;
  color?: 'primary' | 'secondary' | 'info' | string;
  sx?: MuiChipProps['sx'];
};

export const Chip = ({ label, color = 'primary', sx }: ChipProps) => {
  const isHexColor = color.startsWith('#');

  return (
    <BaseChip
      label={label}
      sx={{
        borderRadius: 4,
        bgcolor: isHexColor ? color : `${color}.alpha`,
        fontSize: 12,
        height: 24,
        fontWeight: 'normal',
        ...sx,
      }}
    />
  );
};
