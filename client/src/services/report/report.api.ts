import axios from '~/lib/axiosInstance';
import type { CreateReportPayload, Report, ReportIncome, ReportExpense } from './report.types';

const getReports = async (tenantId: string): Promise<Report[]> => {
  const res = await axios.get('/reports', { params: { tenantId } });
  return res.data.data.reports;
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

const createIncome = async (reportId: string, data: { description: string; amount: number }): Promise<ReportIncome> => {
  const res = await axios.post(`/reports/${reportId}/income`, data);
  return res.data.data.income;
};

const deleteIncome = async (reportId: string, incomeId: string): Promise<void> => {
  await axios.delete(`/reports/${reportId}/income/${incomeId}`);
};

const createExpense = async (reportId: string, data: { description: string; amount: number }): Promise<ReportExpense> => {
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

export { getReports, getReportById, getReportByShift, createReport, createIncome, deleteIncome, createExpense, deleteExpense, assignEmployee, removeEmployee };
