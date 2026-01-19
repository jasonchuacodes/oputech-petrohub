import { InvertColors, GasMeter, Payments, AttachMoney } from '@mui/icons-material';
import { Icon, Stack, Typography } from '@mui/material';
import type { ComponentType } from 'react';

export const Shortcuts = () => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <ShortcutCard name="Lubricants" onClick={() => null} icon={InvertColors} />
        <ShortcutCard name="Disposals" onClick={() => null} icon={GasMeter} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <ShortcutCard name="Deposit" onClick={() => null} icon={Payments} />
        <ShortcutCard name="Expense" onClick={() => null} icon={AttachMoney} />
      </Stack>
    </Stack>
  );
};

const ShortcutCard = ({
  name,
  onClick,
  icon,
}: {
  name: string;
  onClick: () => void;
  icon: ComponentType;
}) => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      bgcolor="background.paper"
      flex={1}
      p={2}
      spacing={0.5}
      onClick={onClick}
      borderRadius={2}
    >
      <Icon component={icon} fontSize="medium" />
      <Typography variant="body2" color="text.primary">
        {name}
      </Typography>
    </Stack>
  );
};
