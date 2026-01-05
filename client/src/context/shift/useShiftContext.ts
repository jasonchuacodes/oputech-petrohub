import { useContext } from 'react';

import { ShiftContext } from './ShiftContext';

export const useShiftContext = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShiftContext must be used within ShiftProvider');
  }
  return context;
};
