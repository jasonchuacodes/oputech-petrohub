import { useContext } from 'react';

import { StockInventoryContext } from './StockInventoryContext';

export const useStockInventoryContext = () => {
  const context = useContext(StockInventoryContext);
  if (!context) {
    throw new Error('useStockInventoryContext must be used within StockInventoryProvider');
  }
  return context;
};
