import axios from '~/lib/axiosInstance';
import type { CreateReportPayload, Report } from './report.types';

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

export { getReports, getReportById, getReportByShift, createReport };
