import axios from '~/lib/axiosInstance';
import type { Shift, CreateShiftPayload, UpdateShiftPayload } from './shift.types';
import type { ShiftPeriod } from '../report/report.types';

const getShiftsByTenantId = async (tenantId: string): Promise<Shift[]> => {
  const res = await axios.get('/shifts', { params: { tenantId } });
  return res.data.data;
};

const getShiftById = async (shiftId: string, tenantId: string): Promise<Shift> => {
  const res = await axios.get(`/shifts/${shiftId}`, { params: { tenantId } });
  return res.data.data;
};

const createShift = (data: CreateShiftPayload) => {
  return axios.post('/shifts', data);
};

const updateShift = (shiftId: string, data: UpdateShiftPayload, tenantId: string) => {
  return axios.put(`/shifts/${shiftId}`, data, { params: { tenantId } });
};

const deleteShift = (shiftId: string, tenantId: string) => {
  return axios.delete(`/shifts/${shiftId}`, { params: { tenantId } });
};

const getShiftPeriods = async (shiftDate: string): Promise<ShiftPeriod[]> => {
  const res = await axios.get('/shifts/periods', { params: { shiftDate } });
  return res.data.data;
};

export {
  getShiftsByTenantId,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  getShiftPeriods,
};
