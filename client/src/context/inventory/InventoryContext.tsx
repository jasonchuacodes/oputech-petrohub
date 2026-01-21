import type { ReactNode } from 'react';
import { createContext } from 'react';

import type { Inventory } from '~/services/inventory/inventory.types';

type InventoryContextType = {
  inventory: Inventory;
};

type InventoryProviderProps = {
  inventory: Inventory;
  children: ReactNode;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const InventoryProvider = ({ inventory, children }: InventoryProviderProps) => {
  return <InventoryContext.Provider value={{ inventory }}>{children}</InventoryContext.Provider>;
};

export { InventoryContext, InventoryProvider };
