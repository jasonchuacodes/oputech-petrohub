import { prisma } from '~/db';
import { ConflictError, NotFoundError } from '~/errors';

import type { CreateProductPayload } from '../schema/createProductSchema';
import type { UpdateProductPayload } from '../schema/updateProductSchema';

const createProduct = async (data: CreateProductPayload) => {
  const product = await prisma.product.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      description: data.description,
    },
  });

  await prisma.productPrice.create({
    data: {
      productId: product.id,
      price: data.productPrice,
      effectiveFrom: new Date(data.effectiveFrom),
    },
  });

  return await getProductById(product.id, data.tenantId);
};

const getProductsByTenantId = async (tenantId: string) => {
  const products = await prisma.product.findMany({
    where: { tenantId },
    include: {
      productPrices: {
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map((product) => ({
    ...product,
    productPrice: product.productPrices[0] || null,
    productPrices: undefined,
  }));
};

const getProductById = async (productId: string, tenantId: string) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
    include: {
      productPrices: {
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
    },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return {
    ...product,
    productPrice: product.productPrices[0] || null,
    productPrices: undefined,
  };
};

const updateProduct = async (productId: string, tenantId: string, data: UpdateProductPayload) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      description: data.description,
    },
  });

  if (data.productPrice !== undefined) {
    await prisma.productPrice.create({
      data: {
        productId,
        price: data.productPrice,
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : new Date(),
      },
    });
  }

  return await getProductById(productId, tenantId);
};

const deleteProduct = async (productId: string, tenantId: string) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
    include: {
      reportEntries: { select: { id: true } },
      reportDisposals: { select: { id: true } },
    },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  if (product.reportEntries.length > 0 || product.reportDisposals.length > 0) {
    throw new ConflictError('Cannot delete product that is referenced in reports');
  }

  return await prisma.product.delete({
    where: { id: productId },
  });
};

export { createProduct, getProductsByTenantId, getProductById, updateProduct, deleteProduct };
