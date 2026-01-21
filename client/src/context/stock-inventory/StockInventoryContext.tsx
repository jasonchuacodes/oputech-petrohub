import type { ReactNode } from 'react';
import { createContext } from 'react';

import type { StockInventory } from '~/services/inventory/inventory.types';

type StockInventoryContextType = {
  stockInventory: StockInventory;
};

type StockInventoryProviderProps = {
  stockInventory: StockInventory;
  children: ReactNode;
};

const StockInventoryContext = createContext<StockInventoryContextType | undefined>(undefined);

const StockInventoryProvider = ({ stockInventory, children }: StockInventoryProviderProps) => {
  return <StockInventoryContext.Provider value={{ stockInventory }}>{children}</StockInventoryContext.Provider>;
};

export { StockInventoryContext, StockInventoryProvider };
