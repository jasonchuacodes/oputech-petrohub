import axios from '~/lib/axiosInstance';
import type {
  CreateReportPayload,
  Report,
  ReportIncome,
  ReportExpense,
  ReportDisposal,
  ReportInventory,
} from './report.types';

const getReports = async (
  tenantId: string,
  filters?: {
    shiftDate?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    creatorId?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<{ reports: Report[]; total: number }> => {
  const res = await axios.get('/reports', {
    params: {
      tenantId,
      ...filters,
    },
  });
  return res.data.data;
};

const getReportById = async (tenantId: string, reportId: string): Promise<Report> => {
  const res = await axios.get(`/reports/${reportId}`, { params: { tenantId } });
  return res.data.data.report;
};

const getReportByShift = async (
  tenantId: string,
  shiftId: string,
  shiftDate: string, // ISO string
): Promise<Report | null> => {
  const res = await axios.get('/reports/by-shift', {
    params: {
      tenantId,
      shiftId,
      shiftDate,
    },
  });

  return res.data.data.report;
};

const createReport = async (data: CreateReportPayload): Promise<Report> => {
  const res = await axios.post('/reports', data);
  return res.data.data.report;
};

const createIncome = async (
  reportId: string,
  data: { description: string; amount: number },
): Promise<ReportIncome> => {
  const res = await axios.post(`/reports/${reportId}/income`, data);
  return res.data.data.income;
};

const deleteIncome = async (reportId: string, incomeId: string): Promise<void> => {
  await axios.delete(`/reports/${reportId}/income/${incomeId}`);
};

const createExpense = async (
  reportId: string,
  data: { description: string; amount: number },
): Promise<ReportExpense> => {
  const res = await axios.post(`/reports/${reportId}/expenses`, data);
  return res.data.data.expense;
};

const deleteExpense = async (reportId: string, expenseId: string): Promise<void> => {
  await axios.delete(`/reports/${reportId}/expenses/${expenseId}`);
};

const assignEmployee = async (reportId: string, userId: string): Promise<void> => {
  await axios.post(`/reports/${reportId}/employees`, { userId });
};

const removeEmployee = async (reportId: string, userId: string): Promise<void> => {
  await axios.delete(`/reports/${reportId}/employees/${userId}`);
};

const updateDisposal = async (
  reportId: string,
  disposalId: string,
  data: { afterReading: number; calibrate?: number },
): Promise<ReportDisposal> => {
  const res = await axios.put(`/reports/${reportId}/disposals/${disposalId}`, data);
  return res.data.data.disposal;
};

const validateReport = async (reportId: string): Promise<Report> => {
  const res = await axios.patch(`/reports/${reportId}/validate`);
  return res.data.data.report;
};

const submitReport = async (reportId: string): Promise<Report> => {
  const res = await axios.patch(`/reports/${reportId}/submit`);
  return res.data.data.report;
};

const createInventory = async (
  reportId: string,
  data: { productId: string; quantity: number },
): Promise<ReportInventory> => {
  const res = await axios.post(`/reports/${reportId}/inventory`, data);
  return res.data.data.inventory;
};

const updateInventory = async (
  reportId: string,
  productId: string,
  data: { quantity: number },
): Promise<ReportInventory> => {
  const res = await axios.put(`/reports/${reportId}/inventory/${productId}`, data);
  return res.data.data.inventory;
};

const deleteInventory = async (reportId: string, productId: string): Promise<void> => {
  await axios.delete(`/reports/${reportId}/inventory/${productId}`);
};

const deleteReport = async (reportId: string): Promise<void> => {
  await axios.delete(`/reports/${reportId}`);
};

export {
  getReports,
  getReportById,
  getReportByShift,
  createReport,
  createIncome,
  deleteIncome,
  createExpense,
  deleteExpense,
  assignEmployee,
  removeEmployee,
  updateDisposal,
  validateReport,
  submitReport,
  createInventory,
  updateInventory,
  deleteInventory,
  deleteReport,
};
