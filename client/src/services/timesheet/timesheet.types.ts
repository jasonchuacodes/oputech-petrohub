import type { ValueOf } from "~/utils/valueOf";

import type { User } from "../user/user.types";

export type Timesheet = {
  id: string;
  user: User;
  totalHours: number;
  status: TimesheetStatus;
  entries: TimesheetEntry[];
  createdAt: string;
  updatedAt: string;
};

export const TimesheetEntryActionEnum = {
  CHECK_IN: 'CHECK_IN',
  CHECK_OUT: 'CHECK_OUT',
} as const;

export type TimesheetEntryAction = ValueOf<typeof TimesheetEntryActionEnum>;

export const TimesheetEntryActionMap: Record<TimesheetEntryAction, string> = {
  [TimesheetEntryActionEnum.CHECK_IN]: 'CHECK IN',
  [TimesheetEntryActionEnum.CHECK_OUT]: 'CHECK OUT',
};

export const TimesheetStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type TimesheetStatus = ValueOf<typeof TimesheetStatusEnum>;

export type TimesheetEntry = {
  id: string;
  action: TimesheetEntryAction;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};