import axios from '~/lib/axiosInstance';
import type { Report } from './report.types';

const getReports = async (tenantId: string): Promise<Report[]> => {
  const res = await axios.get('/reports', { params: { tenantId } });
  return res.data.data.reports;
};

const getReportById = async (tenantId: string, reportId: string): Promise<Report> => {
  const res = await axios.get(`/reports/${reportId}`, { params: { tenantId } });
  return res.data.data.report;
};

export { getReports, getReportById };
