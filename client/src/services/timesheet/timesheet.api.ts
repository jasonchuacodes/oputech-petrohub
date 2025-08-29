import axios from '~/lib/axiosInstance';

import type { Timesheet } from './timesheet.types';

// Queries
const getTimesheet = async (timesheetId: string): Promise<Timesheet> => {
  const res = await axios.get(`/timesheets/${timesheetId}`);

  return res.data.data.tenant;
};

const getTimesheets = async (): Promise<Timesheet[]> => {
  const res = await axios.get('/timesheets');

  return res.data.data.tenant;
};

// Mutations
const checkIn = async () => {
  const res = await axios.post('/timesheets/check-in');

  return res.data.data.timesheet;
};

const checkOut = async () => {
  const res = await axios.post('/timesheets/check-out');

  return res.data.data.timesheet;
};

export { getTimesheet, getTimesheets, checkIn, checkOut };
