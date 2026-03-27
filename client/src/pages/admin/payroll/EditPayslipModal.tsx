import { AddOutlined, ReceiptLongOutlined, RemoveOutlined } from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input, NumberInput } from '~/components/form';
import { Button, CustomModal, Show } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';
import type { Payslip } from '~/services/payroll/payroll.types';

const EditPayslipSchema = z.object({
  grossPay: z.number().min(0, 'Amount must be positive'),
  deductions: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
    })
  ),
  notes: z.string().optional(),
});

type EditPayslipForm = z.infer<typeof EditPayslipSchema>;

type EditPayslipModalProps = {
  open: boolean;
  onClose: () => void;
  payslip: Payslip | null;
  timesheetId: string;
  onSave: (timesheetId: string, amount: number, notes?: string) => void;
};

export const EditPayslipModal = ({
  open,
  onClose,
  payslip,
  timesheetId,
  onSave,
}: EditPayslipModalProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<EditPayslipForm>({
    resolver: zodResolver(EditPayslipSchema),
    defaultValues: {
      grossPay: payslip ? parseFloat(payslip.totalCompensation) : 0,
      deductions: [],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deductions',
  });

  const grossPay = watch('grossPay');
  const deductions = watch('deductions');

  // Recalculate net amount based on edited gross pay and deductions
  const netAmount = useMemo(() => {
    const totalDeductions = deductions.reduce((sum, d) => sum + (d.amount || 0), 0);
    return (grossPay || 0) - totalDeductions;
  }, [grossPay, deductions]);

  const onSubmit = (data: EditPayslipForm) => {
    onSave(timesheetId, data.grossPay, data.notes);
    onClose();
  };

  if (!payslip) return null;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Edit Payslip"
      subheader="Adjust gross pay and deductions before running payroll."
      icon={ReceiptLongOutlined}
      submitText="Update"
      disabled={!isValid}
    >
      <Stack spacing={3} textAlign='start'>
        {/* Employee Details */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.primary">
            Employee Details:
          </Typography>
          <Stack pl={1} spacing={1}>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payslip.user?.name || 'Unknown'}
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Position
              </Typography>
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Salary Rate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(parseFloat(payslip.rateSnapshot))}/
                {payslip.rateTypeSnapshot.toLowerCase()}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Earnings */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.primary">
            Earnings:
          </Typography>
          <Stack pl={1} spacing={1}>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Total Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(payslip.totalHours, 2)} hrs
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Overtime
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(0, 2)} hrs
              </Typography>
            </Stack>

            <Divider />

            <Stack direction="row" alignItems="center">
              <Typography variant="body2" color="text.secondary" width="50%">
                Gross Pay
              </Typography>
              <Box width="50%">
                <NumberInput
                  name="grossPay"
                  control={control}
                  startAdornment={<Typography>₱</Typography>}
                  min={0}
                  step={0.01}
                />
              </Box>
            </Stack>
          </Stack>
        </Stack>

        {/* Deductions */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.primary">
            Deductions:
          </Typography>
          <Stack pl={1} spacing={1}>
            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={1} alignItems="center">
                <Box width="50%">
                  <Input
                    name={`deductions.${index}.name` as const}
                    control={control}
                    placeholder="e.g., SSS Contribution"
                  />
                </Box>
                <NumberInput
                  name={`deductions.${index}.amount` as const}
                  control={control}
                  startAdornment={<Typography>₱</Typography>}
                  min={0}
                  step={0.01}
                  fullWidth={false}
                  width="50%"
                />
                <IconButton onClick={() => remove(index)}>
                  <RemoveOutlined fontSize="small" />
                </IconButton>
              </Stack>
            ))}

            <Button
              sx={{ alignSelf: 'start' }}
              variant="outlined"
              onClick={() => append({ name: '', amount: 0 })}
              startIcon={<AddOutlined fontSize="small" sx={{ color: 'text.secondary' }} />}
            >
              <Typography variant="body2" color="text.secondary">
                Add Deduction
              </Typography>
            </Button>

            <Show when={deductions.length > 1}>
              <Divider />

              <Stack direction="row">
                <Typography variant="body2" color="text.secondary" width="50%">
                  Total Deductions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(deductions.reduce((sum, d) => sum + (d.amount || 0), 0))}
                </Typography>
              </Stack>
            </Show>
          </Stack>
        </Stack>

        {/* Notes */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.primary">
            Notes:
          </Typography>
          <Stack pl={1}>
            <Input
              name="notes"
              control={control}
              placeholder="Add notes about this adjustment (optional)"
              multiline
              rows={3}
            />
          </Stack>
        </Stack>

        {/* Net Pay */}
        <Box bgcolor="primary.alpha" borderRadius={2} p={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" color="success.dark">
              Net Pay
            </Typography>
            <Typography variant="body2" fontWeight={600} color="success.dark">
              {formatCurrency(netAmount)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </CustomModal>
  );
};
