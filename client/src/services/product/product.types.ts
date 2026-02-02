type ValueOf<T> = T[keyof T];

export const ProductCategory = {
  FUEL: 'FUEL',
  STOCK_INVENTORY: 'STOCK_INVENTORY',
} as const;

export type ProductCategory = ValueOf<typeof ProductCategory>;

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
  productReading: ProductReading;
  productPrice: ProductPrice;
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
};

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  productPrice?: number;
  productReading?: number;
  effectiveFrom?: string;
  color?: ProductColor;
};
