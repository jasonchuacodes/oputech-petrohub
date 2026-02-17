import type { ReactNode } from 'react';
import { createContext } from 'react';

import type { Payslip } from '~/services/payroll/payroll.types';

type PayslipContextType = {
  payslip: Payslip;
  payslipId: string;
};

type PayslipProviderProps = {
  payslipId: string;
  payslip: Payslip;
  children: ReactNode;
};

const PayslipContext = createContext<PayslipContextType | undefined>(undefined);

const PayslipProvider = ({ payslip, payslipId, children }: PayslipProviderProps) => {
  return <PayslipContext.Provider value={{ payslip, payslipId }}>{children}</PayslipContext.Provider>;
};

export { PayslipContext, PayslipProvider };
