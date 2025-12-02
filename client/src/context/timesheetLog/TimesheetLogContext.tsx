import type { ReactNode } from 'react';
import { createContext } from 'react';

import type { Timesheet } from '~/services/timesheet/timesheet.types';

type TimesheetLogContextType = {
  timesheetLog: Timesheet;
};

type TimesheetLogProviderProps = {
  timesheetLog: Timesheet;
  children: ReactNode;
};

const TimesheetLogContext = createContext<TimesheetLogContextType | undefined>(undefined);

const TimesheetLogProvider = ({ timesheetLog, children }: TimesheetLogProviderProps) => {
  return <TimesheetLogContext.Provider value={{ timesheetLog }}>{children}</TimesheetLogContext.Provider>;
};

export { TimesheetLogContext, TimesheetLogProvider };
