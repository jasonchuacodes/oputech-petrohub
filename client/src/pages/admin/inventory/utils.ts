export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface StockStatusConfig {
  label: string;
  color: 'success' | 'warning' | 'error';
}

export const getStockStatus = (quantity: number, lowStockThreshold: number | null): StockStatus | null => {
  if (lowStockThreshold === null) return null;
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= lowStockThreshold) return 'low_stock';
  return 'in_stock';
};

export const getStockStatusConfig = (status: StockStatus): StockStatusConfig => {
  const configs: Record<StockStatus, StockStatusConfig> = {
    in_stock: { label: 'In Stock', color: 'success' },
    low_stock: { label: 'Low Stock', color: 'warning' },
    out_of_stock: { label: 'Out of Stock', color: 'error' },
  };
  return configs[status];
};
