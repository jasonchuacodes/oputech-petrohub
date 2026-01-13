import type { ValueOf } from '~/utils/valueOf';

export const ReportStatusEnum = {
  DRAFT: 'DRAFT',
  VALIDATED: 'VALIDATED',
  SUBMITTED: 'SUBMITTED',
} as const;

export type ReportStatus = ValueOf<typeof ReportStatusEnum>;

export type ReportIncome = {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
};

export type ReportExpense = {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
};

export type ReportDisposal = {
  id: string;
  reportId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
    unit: string;
  };
  beforeReading: number;
  afterReading: number;
  netDisposal: number;
  priceSnapshot: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
};

export type Employee = {
  id: string;
  name: string;
  username: string;
};

export type Report = {
  id: string;
  tenantId: string;
  creatorId: string;
  shiftId: string;
  shiftDate: string;
  status: ReportStatus;
  totalIncome: number;
  totalExpenses: number;
  totalDisposalSales: number;
  shortages: number;
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
  income: ReportIncome[];
  expenses: ReportExpense[];
  disposals: ReportDisposal[];
  employees: {
    user: {
      id: string;
      username: string;
      name: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
};
