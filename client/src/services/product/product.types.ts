type ValueOf<T> = T[keyof T];

export const ProductCategory = {
  FUEL: 'FUEL',
  STOCK_INVENTORY: 'STOCK_INVENTORY',
} as const;

export type ProductCategory = ValueOf<typeof ProductCategory>;

export const ProductType = {
  GASOLINE: 'GASOLINE',
  PREMIUM: 'PREMIUM',
  DIESEL: 'DIESEL',
  KEROSENE: 'KEROSENE',
} as const;

export type ProductType = ValueOf<typeof ProductType>;

export type ProductColor = 'grey' | 'error' | 'warning' | 'success' | 'info' | 'primary';

export type ProductPrice = {
  id: string;
  price: number;
  effectiveFrom: Date;
};

export type ProductReading = {
  id: string;
  reading: number;
  createdAt: Date;
};

export type Product = {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  color: ProductColor;
  type: ProductType | null;
  active: boolean;
  productReading: ProductReading;
  productPrice: ProductPrice | null;
  scheduledPrice: ProductPrice | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductPayload = {
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  reading: number;
  color?: ProductColor;
  type: ProductType;
};

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  productPrice?: number;
  productReading?: number;
  effectiveFrom?: string;
  color?: ProductColor;
};

export interface GetProductsFilters {
  category?: ProductCategory;
  searchTerm?: string;
}
