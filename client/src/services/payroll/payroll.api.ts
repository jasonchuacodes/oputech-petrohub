import axios from '~/lib/axiosInstance';
import type {
  GeneratePayslipInput,
  GetPayslipsParams,
  Payslip,
  PayrollRun,
  RunPayrollInput,
  UnprocessedTimesheet,
} from './payroll.types';

const generatePayslip = async (data: GeneratePayslipInput): Promise<Payslip> => {
  const res = await axios.post('/payroll/payslips', data);
  return res.data.data;
};

const getPayslips = async (params: GetPayslipsParams): Promise<Payslip[]> => {
  const res = await axios.get('/payroll/payslips', { params });
  return res.data.data;
};

const runPayroll = async (data: RunPayrollInput): Promise<PayrollRun> => {
  const res = await axios.post('/payroll/run', data);
  return res.data.data;
};

const getPayrollRuns = async (params: {
  tenantId: string;
  periodStart?: string;
  periodEnd?: string;
}): Promise<PayrollRun[]> => {
  const res = await axios.get('/payroll/runs', { params });
  return res.data.data;
};

const getPayrollRunById = async (
  payrollRunId: string
): Promise<PayrollRun & { payslips: Payslip[] }> => {
  const res = await axios.get(`/payroll/runs/${payrollRunId}`);
  return res.data.data;
};

const markPayslipAsPaid = async (data: {
  payslipId: string;
  paidAt?: string;
  paymentMethod?: string;
  paymentNotes?: string;
}): Promise<Payslip> => {
  const res = await axios.patch(`/payroll/payslips/${data.payslipId}/mark-paid`, data);
  return res.data.data;
};

const cancelPayrollRun = async (payrollRunId: string): Promise<PayrollRun> => {
  const res = await axios.patch(`/payroll/runs/${payrollRunId}/cancel`);
  return res.data.data;
};

const getUnprocessedTimesheets = async (
  userId: string,
  tenantId: string,
  startDate?: string,
  endDate?: string
): Promise<UnprocessedTimesheet[]> => {
  const res = await axios.get('/payroll/timesheets/unprocessed', {
    params: { userId, tenantId, startDate, endDate },
  });
  return res.data.data;
};

export {
  generatePayslip,
  getPayslips,
  runPayroll,
  getPayrollRuns,
  getPayrollRunById,
  markPayslipAsPaid,
  cancelPayrollRun,
  getUnprocessedTimesheets,
};
