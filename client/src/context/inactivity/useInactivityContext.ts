import { useContext } from 'react';

import { InactivityContext } from './InactivityContext';

export const useInactivityContext = () => {
  const context = useContext(InactivityContext);

  if (context === undefined) {
    throw new Error('useInactivityContext must be used within InactivityProvider');
  }

  return context;
};
