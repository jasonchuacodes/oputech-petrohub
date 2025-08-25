import type { ValueOf } from '../utils/valueOf';
import type { Timesheet } from './mockAllTimesheets';

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

export const userTimesheets: Timesheet[] = [
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
    id: 'a3f8c9f0-45b2-11ef-861e-0242ac120002',
    user: {
      id: 'u1-123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
    },
    totalHours: 7.75,
    status: TimesheetStatusEnum.SUBMITTED,
    entries: [
      {
        id: 'e4-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_IN,
        timestamp: '2025-08-27T08:50:00Z',
        createdAt: '2025-08-27T08:50:00Z',
        updatedAt: '2025-08-27T08:50:00Z',
      },
      {
        id: 'e5-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_OUT,
        timestamp: '2025-08-27T16:35:00Z',
        createdAt: '2025-08-27T16:35:00Z',
        updatedAt: '2025-08-27T16:35:00Z',
      },
    ],
    createdAt: '2025-08-27T08:50:00Z',
    updatedAt: '2025-08-27T16:35:00Z',
  },
  {
    id: 'a4f8c9f0-45b2-11ef-861e-0242ac120002',
    user: {
      id: 'u1-123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
    },
    totalHours: 8,
    status: TimesheetStatusEnum.APPROVED,
    entries: [
      {
        id: 'e6-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_IN,
        timestamp: '2025-08-28T09:05:00Z',
        createdAt: '2025-08-28T09:05:00Z',
        updatedAt: '2025-08-28T09:05:00Z',
      },
      {
        id: 'e7-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_OUT,
        timestamp: '2025-08-28T17:05:00Z',
        createdAt: '2025-08-28T17:05:00Z',
        updatedAt: '2025-08-28T17:05:00Z',
      },
    ],
    createdAt: '2025-08-28T09:05:00Z',
    updatedAt: '2025-08-28T17:05:00Z',
  },
  {
    id: 'a5f8c9f0-45b2-11ef-861e-0242ac120002',
    user: {
      id: 'u1-123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
    },
    totalHours: 6.5,
    status: TimesheetStatusEnum.REJECTED,
    entries: [
      {
        id: 'e8-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_IN,
        timestamp: '2025-08-29T09:20:00Z',
        createdAt: '2025-08-29T09:20:00Z',
        updatedAt: '2025-08-29T09:20:00Z',
      },
      {
        id: 'e9-987e4567-e89b-12d3-a456-426614174000',
        action: TimesheetEntryActionEnum.CHECK_OUT,
        timestamp: '2025-08-29T15:50:00Z',
        createdAt: '2025-08-29T15:50:00Z',
        updatedAt: '2025-08-29T15:50:00Z',
      },
    ],
    createdAt: '2025-08-29T09:20:00Z',
    updatedAt: '2025-08-29T15:50:00Z',
  },
];
