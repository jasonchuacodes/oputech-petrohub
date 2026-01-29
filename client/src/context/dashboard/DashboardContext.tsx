import { createContext, useState, type ReactNode } from 'react';

export type AnalyticsPreset = 'daily' | 'weekly' | 'monthly';

export interface DashboardContextValue {
  preset: AnalyticsPreset;
  setPreset: (preset: AnalyticsPreset) => void;
}

export const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [preset, setPreset] = useState<AnalyticsPreset>('daily');

  return (
    <DashboardContext.Provider value={{ preset, setPreset }}>
      {children}
    </DashboardContext.Provider>
  );
}
