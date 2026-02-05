export interface Inventory {
  id: string;
  productId: string;
  productName: string;
  productDescription?: string;
  quantity: number;
  currentPrice: number | null;
  lowStockThreshold: number | null;
  updatedAt: string;
}

export interface CreateInventoryPayload {
  tenantId: string;
  name: string;
  description?: string | null,
  price: number;
  quantity?: number;
  lowStockThreshold?: number | null;
}

export interface UpdateInventoryPayload {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  effectiveFrom?: string;
  lowStockThreshold?: number | null;
}

export interface GetInventoriesFilters {
  searchTerm?: string;
}
