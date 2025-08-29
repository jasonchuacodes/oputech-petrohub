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

const getTimesheets = async (): Promise<Timesheet[]> => {
  const res = await axios.get('/timesheets');

  return res.data.data.timesheet;
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

export { getTodayTimesheet, getTimesheet, getTimesheets, checkIn, checkOut };
