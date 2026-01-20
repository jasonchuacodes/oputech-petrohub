import { InvertColors, GasMeter, Payments, AttachMoney } from '@mui/icons-material';
import { Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ComponentType } from 'react';

import { useDisclosure } from '~/hooks/useDisclosure';
import { UserRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

import { AddIncomeModal } from './AddIncomeModal';
import { AddExpenseModal } from './AddExpenseModal';

type ShortcutsProps = {
  reportId: string;
  isReadOnly: boolean;
};

export const Shortcuts = ({ reportId, isReadOnly }: ShortcutsProps) => {
  const navigate = useNavigate();
  const incomeDisclosure = useDisclosure();
  const expenseDisclosure = useDisclosure();

  return (
    <>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          <ShortcutCard name="Lubricants" onClick={() => null} icon={InvertColors} />
          <ShortcutCard
            name="Disposals"
            onClick={() =>
              navigate(
                pathFor({
                  pathname: UserRoutes.ReportDisposal,
                  params: { reportId },
                }),
              )
            }
            icon={GasMeter}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <ShortcutCard
            name="Deposit"
            onClick={() => incomeDisclosure.setOpen(true)}
            icon={Payments}
            disabled={isReadOnly}
          />
          <ShortcutCard
            name="Expense"
            onClick={() => expenseDisclosure.setOpen(true)}
            icon={AttachMoney}
            disabled={isReadOnly}
          />
        </Stack>
      </Stack>

      <AddIncomeModal
        open={incomeDisclosure.open}
        onClose={() => incomeDisclosure.setOpen(false)}
        reportId={reportId}
      />
      <AddExpenseModal
        open={expenseDisclosure.open}
        onClose={() => expenseDisclosure.setOpen(false)}
        reportId={reportId}
      />
    </>
  );
};

const ShortcutCard = ({
  name,
  onClick,
  icon,
  disabled,
}: {
  name: string;
  onClick: () => void;
  icon: ComponentType;
  disabled?: boolean;
}) => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      bgcolor="background.paper"
      flex={1}
      p={2}
      spacing={0.5}
      onClick={disabled ? undefined : onClick}
      borderRadius={2}
      sx={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s',
      }}
    >
      <Icon component={icon} fontSize="medium" />
      <Typography variant="body2" color="text.primary">
        {name}
      </Typography>
    </Stack>
  );
};
