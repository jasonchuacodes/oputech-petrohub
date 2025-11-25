import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import type { Dayjs } from 'dayjs';

import {
  checkIn,
  checkOut,
  getTimesheet,
  getUserTimesheets,
  getTodayTimesheet,
  getAllTimesheets,
  updateTimesheet,
  getTenantAttendance,
} from './timesheet.api';
import type { AttendanceUser, Timesheet } from './timesheet.types';

// Queries
const useGetTodayTimesheetQuery = (): UseQueryResult<Timesheet> => {
  return useQuery({
    queryKey: ['timesheet', 'today'],
    queryFn: getTodayTimesheet,
  });
};

const useGetUserTimesheetsQuery = ({
  tenantId,
  userId,
  startDate,
  endDate,
}: {
  tenantId?: string;
  userId?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}): UseQueryResult<Timesheet[]> => {
  return useQuery({
    queryKey: [
      'timesheets',
      { userId, startDate: startDate?.toISOString(), endDate: endDate?.toISOString() },
    ],
    queryFn: () => getUserTimesheets({ tenantId, userId, startDate, endDate }),
  });
};

const useGetAllTimesheetsQuery = ({
  tenantId,
  startDate,
  endDate,
}: {
  tenantId?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}): UseQueryResult<Timesheet[]> => {
  return useQuery({
    queryKey: [
      'timesheets',
      {
        tenantId,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    ],
    queryFn: () =>
      getAllTimesheets({
        startDate,
        endDate,
        tenantId,
      }),
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

const useGetTenantAttendanceQuery = ({
  tenantId,
}: {
  tenantId?: string;
}): UseQueryResult<AttendanceUser[]> => {
  return useQuery({
    queryKey: ['attendance', tenantId],
    queryFn: () => getTenantAttendance(tenantId!),
    enabled: !!tenantId,
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
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
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
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

const useUpdateTimesheetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimesheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });
};

export {
  useGetTodayTimesheetQuery,
  useGetUserTimesheetsQuery,
  useGetAllTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useGetTenantAttendanceQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useUpdateTimesheetMutation,
};
