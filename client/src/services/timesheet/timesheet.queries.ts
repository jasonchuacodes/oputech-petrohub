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
  deleteTimesheet,
  getTenantAttendance,
  getDailyTimesheets,
} from './timesheet.api';
import type { AttendanceUser, DailyTimesheetUser, Timesheet } from './timesheet.types';

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

const useGetDailyTimesheetsQuery = ({
  tenantId,
}: {
  tenantId?: string;
}): UseQueryResult<DailyTimesheetUser[]> => {
  return useQuery({
    queryKey: ['daily-timesheets', tenantId],
    queryFn: () => getDailyTimesheets(tenantId!),
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
      queryClient.invalidateQueries({ queryKey: ['daily-timesheets'] });
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
      queryClient.invalidateQueries({ queryKey: ['daily-timesheets'] });
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

const useDeleteTimesheetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timesheetId }: { timesheetId: string; tenantId?: string }) =>
      deleteTimesheet(timesheetId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['timesheet', variables.timesheetId] });
      if (variables.tenantId) {
        queryClient.invalidateQueries({ queryKey: ['attendance', variables.tenantId] });
        queryClient.invalidateQueries({ queryKey: ['daily-timesheets', variables.tenantId] });
      }
    },
  });
};

export {
  useGetTodayTimesheetQuery,
  useGetUserTimesheetsQuery,
  useGetAllTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useGetTenantAttendanceQuery,
  useGetDailyTimesheetsQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useUpdateTimesheetMutation,
  useDeleteTimesheetMutation,
};
