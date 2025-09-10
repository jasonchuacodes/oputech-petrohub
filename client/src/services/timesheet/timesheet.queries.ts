import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import type { Dayjs } from 'dayjs';

import {
  checkIn,
  checkOut,
  getTimesheet,
  getUserTimesheets,
  getTodayTimesheet,
  getAllTimesheets,
} from './timesheet.api';
import type { Timesheet } from './timesheet.types';

// Queries
const useGetTodayTimesheetQuery = (): UseQueryResult<Timesheet> => {
  return useQuery({
    queryKey: ['timesheet', 'today'],
    queryFn: getTodayTimesheet,
  });
};

const useGetUserTimesheetsQuery = ({
  startDate,
  endDate,
}: {
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}): UseQueryResult<Timesheet[]> => {
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: () => getUserTimesheets({ endDate, startDate }),
  });
};

const useGetAllTimesheetsQuery = (filters: {
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  userName?: string;
}): UseQueryResult<Timesheet[]> => {
  return useQuery({
    queryKey: [
      'timesheets',
      {
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        username: filters.userName,
      },
    ],
    queryFn: () => getAllTimesheets(filters),
  });
};

const useGetTimesheetByIdQuery = ({ timesheetId }: { timesheetId?: string }) => {
  return useQuery({
    queryKey: ['timesheet', timesheetId],
    queryFn: () => getTimesheet(timesheetId!),
    enabled: !!timesheetId,
    retry: false,
  });
};

// Mutations
const useCheckInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['timesheet', 'today'] });
    },
  });
};

const useCheckOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['timesheet', 'today'] });
    },
  });
};

export {
  useGetTodayTimesheetQuery,
  useGetUserTimesheetsQuery,
  useGetAllTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useCheckInMutation,
  useCheckOutMutation,
};
