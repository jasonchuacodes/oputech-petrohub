import type { Dayjs } from 'dayjs';

import axios from '~/lib/axiosInstance';

import type { Timesheet } from './timesheet.types';

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
  userId,
  startDate,
  endDate,
}: {
  userId?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}): Promise<Timesheet[]> => {
  const res = await axios.get('/timesheets', {
    params: {
      startDate: startDate ? startDate.utc().toISOString() : undefined,
      endDate: endDate ? endDate.utc().toISOString() : undefined,
      userId,
    },
  });

  return res.data.data.timesheets;
};

const getAllTimesheets = async ({
  startDate,
  endDate,
  tenantId,
}: {
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  tenantId?: string;
}): Promise<Timesheet[]> => {
  const res = await axios.get('/timesheets/all', {
    params: {
      startDate: startDate ? startDate.utc().toISOString() : undefined,
      endDate: endDate ? endDate.utc().toISOString() : undefined,
      tenantId,
    },
  });

  return res.data.data.timesheets;
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

export { getTodayTimesheet, getTimesheet, getUserTimesheets, getAllTimesheets, checkIn, checkOut };
