import { useContext } from 'react';

import { TimesheetLogContext } from './TimesheetLogContext';

export const useTimesheetLogContext = () => {
  const context = useContext(TimesheetLogContext);
  if (!context) {
    throw new Error('useTimesheetLogContext must be used within TimesheetLogProvider');
  }
  return context;
};
