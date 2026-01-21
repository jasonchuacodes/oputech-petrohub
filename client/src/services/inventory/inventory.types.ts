export interface StockInventory {
  id: string;
  productId: string;
  productName: string;
  productDescription?: string;
  quantity: number;
  currentPrice: number | null;
  updatedAt: string;
}

export interface CreateStockInventoryPayload {
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
}

export interface UpdateStockInventoryPayload {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  effectiveFrom?: string;
}
