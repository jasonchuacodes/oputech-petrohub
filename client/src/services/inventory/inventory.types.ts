export interface Inventory {
  id: string;
  productId: string;
  productName: string;
  productDescription?: string;
  quantity: number;
  currentPrice: number | null;
  updatedAt: string;
}

export interface CreateInventoryPayload {
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
}

export interface UpdateInventoryPayload {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  effectiveFrom?: string;
}
