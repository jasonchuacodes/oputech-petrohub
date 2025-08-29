import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { checkIn, checkOut, getTimesheet, getTimesheets, getTodayTimesheet } from './timesheet.api';
import type { Timesheet } from './timesheet.types';

// Queries
const useGetTodayTimesheetQuery = (): UseQueryResult<Timesheet> => {
  return useQuery({
    queryKey: ['timesheet', 'today'],
    queryFn: getTodayTimesheet,
  });
};

const useGetTimesheetsQuery = (): UseQueryResult<Timesheet[]> => {
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: getTimesheets,
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
  useGetTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useCheckInMutation,
  useCheckOutMutation,
};
