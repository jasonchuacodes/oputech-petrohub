import type { ReactNode } from 'react';
import { createContext } from 'react';

type DeductionItem = {
  name: string;
  amount: number;
};

export type PayslipData = {
  id: string;
  name: string;
  position: string | null;
  salaryRate: number;
  totalHours: number;
  overtime: number;
  grossPay: number;
  deductions: DeductionItem[];
  totalDeductions: number;
  netAmount: number;
  notes?: string;
};

type PayslipContextType = {
  payslip: PayslipData;
  payslipId: string;
};

type PayslipProviderProps = {
  payslipId: string;
  payslip: PayslipData;
  children: ReactNode;
};

const PayslipContext = createContext<PayslipContextType | undefined>(undefined);

const PayslipProvider = ({ payslip, payslipId, children }: PayslipProviderProps) => {
  return <PayslipContext.Provider value={{ payslip, payslipId }}>{children}</PayslipContext.Provider>;
};

export { PayslipContext, PayslipProvider };
