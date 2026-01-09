import type { ValueOf } from '~/utils/valueOf';

export const ReportStatusEnum = {
  DRAFT: 'DRAFT',
  VALIDATED: 'VALIDATED',
  SUBMITTED: 'SUBMITTED',
} as const;

export type ReportStatus = ValueOf<typeof ReportStatusEnum>;

export type Report = {
  id: string;
  tenantId: string;
  creatorId: string;
  shiftId: string;
  shiftDate: string;
  status: ReportStatus;
  totalIncome: number;
  totalExpenses: number;
  netTotal: number;
  shift: {
    id: string;
    name: string;
    shiftStart: string;
    shiftEnd: string;
    color?: string;
  };
  creator: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};
