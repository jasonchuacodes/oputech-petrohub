import { createContext, useState, type ReactNode } from 'react';

export type AnalyticsPreset = 'monthly';

type DashboardContextValue = {
  preset: AnalyticsPreset;
  setPreset: (preset: AnalyticsPreset) => void;
};

type DashboardProviderProps = {
  children: ReactNode;
};

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [preset, setPreset] = useState<AnalyticsPreset>('monthly');

  return (
    <DashboardContext.Provider value={{ preset, setPreset }}>{children}</DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardProvider };
