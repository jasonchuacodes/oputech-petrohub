import { createContext, useContext } from 'react';

import type { usePagination } from './hooks/usePagination';

type DataTableContextValue = {
  pagination: ReturnType<typeof usePagination>;
};

export const DataTableContext = createContext<DataTableContextValue | null>(null);

export function useDataTableContext() {
  const ctx = useContext(DataTableContext);
  if (!ctx) throw new Error('useDataTableContext must be used inside DataTable');
  return ctx;
}
