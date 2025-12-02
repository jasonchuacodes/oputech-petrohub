import { useContext } from 'react';

import { TimesheetContext } from './TimesheetContext';

export const useTimesheetContext = () => {
  const context = useContext(TimesheetContext);
  if (!context) {
    throw new Error('useTimesheetContext must be used within TimesheetProvider');
  }
  return context;
};
