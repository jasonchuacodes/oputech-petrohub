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
};

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  productPrice?: number;
  productReading?: number;
  effectiveFrom?: string;
};
