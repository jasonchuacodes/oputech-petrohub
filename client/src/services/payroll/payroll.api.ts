import axios from '~/lib/axiosInstance';
import type {
  GeneratePayrollInput,
  GetPayrollRecordsParams,
  Payroll,
  UnprocessedTimesheet,
} from './payroll.types';

const generatePayroll = async (data: GeneratePayrollInput): Promise<Payroll> => {
  const res = await axios.post('/payroll/', data);
  return res.data.data;
};

const getPayrollRecords = async (params: GetPayrollRecordsParams): Promise<Payroll[]> => {
  const res = await axios.get('/payroll/', { params });
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

export { generatePayroll, getPayrollRecords, getUnprocessedTimesheets };
