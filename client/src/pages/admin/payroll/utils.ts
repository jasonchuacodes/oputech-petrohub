import { PayrollRunStatus, PaymentStatus } from '~/services/payroll/payroll.types';

export const getStatusColor = (status: PayrollRunStatus) => {
  switch (status) {
    case PayrollRunStatus.PAID:
      return 'success';
    case PayrollRunStatus.PENDING:
      return 'warning';
    case PayrollRunStatus.CANCELLED:
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status: PayrollRunStatus) => {
  switch (status) {
    case PayrollRunStatus.PAID:
      return 'Paid';
    case PayrollRunStatus.PENDING:
      return 'Pending';
    case PayrollRunStatus.CANCELLED:
      return 'Cancelled';
    default:
      return status;
  }
};

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PAID:
      return 'success';
    case PaymentStatus.UNPAID:
      return 'warning';
    case PaymentStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
};
