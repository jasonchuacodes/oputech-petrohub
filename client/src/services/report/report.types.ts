import type { ValueOf } from '~/utils/valueOf';

import type { Shift } from '../shift/shift.types';
import type { ProductColor } from '../product/product.types';

export const ReportStatus = {
  DRAFT: 'DRAFT',
  VALIDATED: 'VALIDATED',
  SUBMITTED: 'SUBMITTED',
} as const;

export type ReportStatus = ValueOf<typeof ReportStatus>;

export type ShiftPeriod = {
  shiftId: string;
  shiftName: string;
  periodStart: string;
  periodEnd: string;
  label: string;
};

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
    color?: ProductColor;
    code?: string;
    unit?: string;
  };
  beforeReading: number;
  afterReading: number;
  calibrate: number;
  netDisposal: number;
  priceSnapshot: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
};

export type ReportInventory = {
  id: string;
  reportId: string;
  productId: string;
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  unitPriceSnapshot: number;
  amount: number;
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
  periodStart: string;
  periodEnd: string;
  status: ReportStatus;
  totalIncome: number;
  totalExpenses: number;
  totalDisposalSales: number;
  shortages: number;
  netTotal: number;
  shift: Shift;
  creator: {
    id: string;
    name: string;
  };
  income: ReportIncome[];
  expenses: ReportExpense[];
  disposals: ReportDisposal[];
  inventories: ReportInventory[];
  totalInventorySales: number;
  totalSales: number;
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

export type CreateReportPayload = {
  tenantId: string;
  shiftId: string;
  periodStart: string;
  periodEnd: string;
};
