import type { ReactNode } from 'react';
import { createContext } from 'react';

import type { Shift } from '~/services/shift/shift.types';

type ShiftContextType = {
  shift: Shift;
};

type ShiftProviderProps = {
  shift: Shift;
  children: ReactNode;
};

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

const ShiftProvider = ({ shift, children }: ShiftProviderProps) => {
  return <ShiftContext.Provider value={{ shift }}>{children}</ShiftContext.Provider>;
};

export { ShiftContext, ShiftProvider };
