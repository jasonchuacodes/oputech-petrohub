import type { ValueOf } from '../utils/valueOf';

export const TimesheetEntryActionEnum = {
  CHECK_IN: 'CHECK IN',
  CHECK_OUT: 'CHECK OUT',
} as const;
export type TimesheetEntryAction = ValueOf<typeof TimesheetEntryActionEnum>;

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

export type Timesheet = {
  id: string;
  user: {
    id: string;
    name: string;
  };
  totalHours: number;
  status: TimesheetStatus;
  entries: TimesheetEntry[];
  createdAt: string;
  updatedAt: string;
};

export const timesheets: Timesheet[] = [
  {
    id: 'a1f8c9f0-45b2-11ef-861e-0242ac120002',
    user: {
      id: 'u1-123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
    },
    totalHours: 8.5,
    status: TimesheetStatusEnum.IN_PROGRESS,
    entries: [
      {
        id: 'e1-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_IN,
        timestamp: '2025-08-25T09:00:00Z',
        createdAt: '2025-08-25T09:00:00Z',
        updatedAt: '2025-08-25T09:00:00Z',
      },
      {
        id: 'e2-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_OUT,
        timestamp: '2025-08-25T17:30:00Z',
        createdAt: '2025-08-25T17:30:00Z',
        updatedAt: '2025-08-25T17:30:00Z',
      },
    ],
    createdAt: '2025-08-25T09:00:00Z',
    updatedAt: '2025-08-25T17:30:00Z',
  },
  {
    id: 'a2f8c9f0-45b2-11ef-861e-0242ac120002',
    user: {
      id: 'u1-123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
    },
    totalHours: 0,
    status: TimesheetStatusEnum.IN_PROGRESS,
    entries: [
      {
        id: 'e3-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_IN,
        timestamp: '2025-08-26T09:15:00Z',
        createdAt: '2025-08-26T09:15:00Z',
        updatedAt: '2025-08-26T09:15:00Z',
      },
    ],
    createdAt: '2025-08-26T09:15:00Z',
    updatedAt: '2025-08-26T09:15:00Z',
  },
  {
    id: 'b2f8d9a1-45b2-11ef-861e-0242ac120002',
    user: {
      id: 'u2-123e4567-e89b-12d3-a456-426614174111',
      name: 'Jane Smith',
    },
    totalHours: 8.25,
    status: TimesheetStatusEnum.IN_PROGRESS,
    entries: [
      {
        id: 'e4-987e4567-e89b-12d3-a456-426614174111',
        action: TimesheetEntryActionEnum.CHECK_IN,
        timestamp: '2025-08-25T08:45:00Z',
        createdAt: '2025-08-25T08:45:00Z',
        updatedAt: '2025-08-25T08:45:00Z',
      },
      {
        id: 'e5-987e4567-e89b-12d3-a456-426614174111',
        action: TimesheetEntryActionEnum.CHECK_OUT,
        timestamp: '2025-08-25T17:00:00Z',
        createdAt: '2025-08-25T17:00:00Z',
        updatedAt: '2025-08-25T17:00:00Z',
      },
    ],
    createdAt: '2025-08-25T08:45:00Z',
    updatedAt: '2025-08-25T17:00:00Z',
  },
  {
    id: 'b3f8d9a1-45b2-11ef-861e-0242ac120002',
    user: {
      id: 'u2-123e4567-e89b-12d3-a456-426614174111',
      name: 'Jane Smith',
    },
    totalHours: 0,
    status: TimesheetStatusEnum.IN_PROGRESS,
    entries: [
      {
        id: 'e6-987e4567-e89b-12d3-a456-426614174111',
        action: TimesheetEntryActionEnum.CHECK_IN,
        timestamp: '2025-08-26T09:10:00Z',
        createdAt: '2025-08-26T09:10:00Z',
        updatedAt: '2025-08-26T09:10:00Z',
      },
    ],
    createdAt: '2025-08-26T09:10:00Z',
    updatedAt: '2025-08-26T09:10:00Z',
  },
];
