import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { Dayjs } from 'dayjs';

import { getInitialDateRange } from '~/utils/dateUtils';

const TIMESHEETS_KEY = 'timesheetRange';

interface TimesheetContextValue {
  selectedUserId: string | undefined;
  setSelectedUserId: (id: string | undefined) => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TimesheetContext = createContext<TimesheetContextValue | undefined>(undefined);

const TimesheetProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

  // Get initial dates from sessionStorage using existing utility
  const initialRange = getInitialDateRange(TIMESHEETS_KEY);
  const [startDate, setStartDate] = useState<Dayjs | null>(initialRange.startDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialRange.endDate);
  const [searchTerm, setSearchTerm] = useState('');

  // Persist date range to sessionStorage when it changes
  useEffect(() => {
    if (startDate && endDate) {
      sessionStorage.setItem(
        TIMESHEETS_KEY,
        JSON.stringify({
          start: startDate.utc().toISOString(),
          end: endDate.utc().toISOString(),
        }),
      );
    }
  }, [startDate, endDate]);

  return (
    <TimesheetContext.Provider
      value={{
        selectedUserId,
        setSelectedUserId,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </TimesheetContext.Provider>
  );
};

export { TimesheetContext, TimesheetProvider };
