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
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductPayload = {
  tenantId: string;
  name: string;
  description?: string;
  reading: number;
  productPrice: number;
  effectiveFrom?: string;
};

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  productPrice?: number;
  reading?: number;
  effectiveFrom?: string;
};
