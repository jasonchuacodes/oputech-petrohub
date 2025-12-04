import type { Dayjs } from 'dayjs';

import axios from '~/lib/axiosInstance';

import type { AttendanceUser, DailyTimesheetUser, Timesheet } from './timesheet.types';

// Queries
const getTodayTimesheet = async (): Promise<Timesheet> => {
  const res = await axios.get(`/timesheets/today`);

  return res.data.data.timesheet;
};

const getTimesheet = async (timesheetId: string): Promise<Timesheet> => {
  const res = await axios.get(`/timesheets/${timesheetId}`);

  return res.data.data.timesheet;
};

const getUserTimesheets = async ({
  tenantId,
  userId,
  startDate,
  endDate,
}: {
  tenantId?: string;
  userId?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}): Promise<Timesheet[]> => {
  const res = await axios.get('/timesheets', {
    params: {
      tenantId,
      userId,
      startDate: startDate ? startDate.utc().toISOString() : undefined,
      endDate: endDate ? endDate.utc().toISOString() : undefined,
    },
  });

  return res.data.data.timesheets;
};

const getAllTimesheets = async ({
  tenantId,
  startDate,
  endDate,
}: {
  tenantId?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}): Promise<Timesheet[]> => {
  const res = await axios.get('/timesheets/all', {
    params: {
      tenantId,
      startDate: startDate ? startDate.utc().toISOString() : undefined,
      endDate: endDate ? endDate.utc().toISOString() : undefined,
    },
  });

  return res.data.data.timesheets;
};

const getTenantAttendance = async (tenantId: string): Promise<AttendanceUser[]> => {
  const res = await axios.get('/timesheets/attendance', {
    params: { tenantId },
  });

  return res.data.data.users;
};

const getDailyTimesheets = async (tenantId: string): Promise<DailyTimesheetUser[]> => {
  const res = await axios.get('/timesheets/daily', {
    params: { tenantId },
  });

  return res.data.data.users;
};

// Mutations
const checkIn = async () => {
  const res = await axios.post('/timesheets/check-in');

  return res.data.message;
};

const checkOut = async () => {
  const res = await axios.post('/timesheets/check-out');

  return res.data.message;
};

const updateTimesheet = async ({
  timesheetId,
  totalHours,
}: {
  timesheetId: string;
  totalHours: number;
}): Promise<Timesheet> => {
  const res = await axios.put('/timesheets/update', {
    timesheetId,
    totalHours,
  });

  return res.data.message;
};

const deleteTimesheet = async (timesheetId: string) => {
  return axios.delete(`/timesheets/${timesheetId}`);
};

export {
  getTodayTimesheet,
  getTimesheet,
  getUserTimesheets,
  getAllTimesheets,
  checkIn,
  checkOut,
  updateTimesheet,
  deleteTimesheet,
  getTenantAttendance,
  getDailyTimesheets,
};
