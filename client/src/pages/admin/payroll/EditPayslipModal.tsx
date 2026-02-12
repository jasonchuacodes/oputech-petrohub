import { AddOutlined, ReceiptLongOutlined, RemoveOutlined } from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Input, NumberInput } from '~/components/form';
import { Button, CustomModal } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';

type DeductionItem = {
  name: string;
  amount: number;
};

type EditPayslipFormData = {
  grossPay: number;
  deductions: DeductionItem[];
};

type PayslipData = {
  id: string;
  name: string;
  position: string | null;
  salaryRate: number;
  totalHours: number;
  overtime: number;
  grossPay: number;
  deductions: DeductionItem[];
  totalDeductions: number;
  netAmount: number;
};

type EditPayslipModalProps = {
  open: boolean;
  onClose: () => void;
  payslip: PayslipData | null;
  onSave: (data: EditPayslipFormData) => void;
};

export const EditPayslipModal = ({ open, onClose, payslip, onSave }: EditPayslipModalProps) => {
  const { control, handleSubmit, reset, watch } = useForm<EditPayslipFormData>({
    defaultValues: {
      grossPay: 0,
      deductions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deductions',
  });

  // Reset form when payslip changes
  useEffect(() => {
    if (payslip) {
      reset({
        grossPay: payslip.grossPay,
        deductions: payslip.deductions,
      });
    }
  }, [payslip, reset]);

  // Auto-calculate net pay
  const grossPay = watch('grossPay');
  const deductions = watch('deductions');

  const netAmount = useMemo(() => {
    const total = deductions.reduce((sum, d) => sum + (d.amount || 0), 0);
    return (grossPay || 0) - total;
  }, [grossPay, deductions]);

  const onSubmit = (data: EditPayslipFormData) => {
    onSave(data);
    onClose();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  if (!payslip) return null;

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Edit Payslip"
      subheader="Adjust gross pay and deductions before running payroll."
      icon={ReceiptLongOutlined}
      submitText="Update"
    >
      <Stack spacing={3}>
        {/* Employee Details */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.primary">
            Employee Details:
          </Typography>
          <Stack pl={1} spacing={1}>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary" width="50%">
                Name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payslip.name}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary" width="50%">
                Position
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payslip.position ?? '—'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary" width="50%">
                Salary Rate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(payslip.salaryRate)}/day
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
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary" width="50%">
                Total Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(payslip.totalHours, 2)} hrs
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary" width="50%">
                Overtime
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(payslip.overtime, 2)} hrs
              </Typography>
            </Stack>

            <Divider />

            <Stack direction="row" spacing={1} alignItems="center">
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
          </Stack>
        </Stack>

        {/* Net Pay */}
        <Box bgcolor="primary.alpha" borderRadius={2} p={2}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
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
