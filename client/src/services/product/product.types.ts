export type ProductPrice = {
  id: string;
  price: number;
  effectiveFrom: Date;
};

export type Product = {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  productPrice: ProductPrice | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductPayload = {
  tenantId: string;
  name: string;
  description?: string;
  productPrice: number;
  effectiveFrom?: string;
};

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  productPrice?: number;
  effectiveFrom?: string;
};
