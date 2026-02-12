import { useContext } from 'react';

import { PayslipContext } from './PayslipContext';

export const usePayslipContext = () => {
  const context = useContext(PayslipContext);
  if (!context) {
    throw new Error('usePayslipContext must be used within PayslipProvider');
  }
  return context;
};
