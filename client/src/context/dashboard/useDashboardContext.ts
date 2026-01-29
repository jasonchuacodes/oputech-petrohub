import { useContext } from 'react';
import { DashboardContext, type DashboardContextValue } from './DashboardContext';

export function useDashboardContext(): DashboardContextValue {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }

  return context;
}
